#!/usr/bin/env node
/**
 * L3 Style Gate — AI냄새 단어, 문체(구어체), 어미반복 검증
 */
const fs = require("fs");
const path = require("path");

const CONFIG = JSON.parse(
  fs.readFileSync(path.join(__dirname, "quality-config.json"), "utf-8")
);
const ARTICLES_DIR = path.join(__dirname, "..", "data", "articles");

function getSentences(text) {
  return text
    .split(/[.!?\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
}

function checkForbiddenEndings(sentences) {
  const issues = [];
  const { forbiddenEndings } = CONFIG.style;
  for (const sentence of sentences) {
    for (const ending of forbiddenEndings) {
      if (sentence.endsWith(ending)) {
        issues.push({
          type: "문어체 어미",
          detail: `"...${sentence.slice(-20)}" → "${ending}" 사용`,
        });
      }
    }
  }
  return issues;
}

function checkForbiddenWords(text) {
  const issues = [];
  const { forbiddenWords, maxForbiddenWordCount } = CONFIG.style;
  for (const word of forbiddenWords) {
    const count = (text.match(new RegExp(word, "g")) || []).length;
    if (count > maxForbiddenWordCount) {
      issues.push({
        type: "AI냄새 단어",
        detail: `"${word}" ${count}회 사용`,
      });
    }
  }
  return issues;
}

function checkFillerPatterns(text) {
  const issues = [];
  for (const filler of CONFIG.style.fillerPatterns) {
    if (text.includes(filler)) {
      issues.push({
        type: "채움말",
        detail: `"${filler}" 발견`,
      });
    }
  }
  return issues;
}

function checkConsecutiveEndings(sentences) {
  const issues = [];
  const max = CONFIG.style.maxConsecutiveSameEnding || 3;

  // Extract last 2-char endings
  const endings = sentences
    .filter((s) => s.length >= 2)
    .map((s) => s.slice(-2));

  let streak = 1;
  for (let i = 1; i < endings.length; i++) {
    if (endings[i] === endings[i - 1]) {
      streak++;
      if (streak > max) {
        issues.push({
          type: "어미 반복",
          detail: `"${endings[i]}" ${streak}회 연속 (기준: ${max}회)`,
        });
      }
    } else {
      streak = 1;
    }
  }
  return issues;
}

function checkConsecutiveStarts(sentences) {
  const issues = [];
  const max = CONFIG.style.maxConsecutiveSameStart || 3;

  const starts = sentences
    .filter((s) => s.length >= 2)
    .map((s) => s.slice(0, 2));

  let streak = 1;
  for (let i = 1; i < starts.length; i++) {
    if (starts[i] === starts[i - 1]) {
      streak++;
      if (streak > max) {
        issues.push({
          type: "문장시작 반복",
          detail: `"${starts[i]}..." ${streak}회 연속 (기준: ${max}회)`,
        });
      }
    } else {
      streak = 1;
    }
  }
  return issues;
}

function verifyText(text, label) {
  const sentences = getSentences(text);
  const issues = [
    ...checkForbiddenEndings(sentences),
    ...checkForbiddenWords(text),
    ...checkFillerPatterns(text),
    ...checkConsecutiveEndings(sentences),
    ...checkConsecutiveStarts(sentences),
  ];

  return {
    label,
    sentenceCount: sentences.length,
    issues,
    pass: issues.length === 0,
  };
}

function verifyAll() {
  const results = { pass: true, files: [], totalIssues: 0 };

  if (!fs.existsSync(ARTICLES_DIR)) return results;

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".ts") && f !== "index.ts");

  for (const file of files) {
    const content = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");

    // Extract string content from template literals and quoted strings
    const textContent = content
      .replace(/\/\/.*$/gm, "")
      .replace(/import\s.*?;/g, "")
      .replace(/export\s/g, "")
      .match(/"([^"]{10,})"|'([^']{10,})'|`([^`]{10,})`/g);

    if (!textContent) continue;

    const allText = textContent.join("\n");
    const result = verifyText(allText, file);
    results.files.push(result);
    results.totalIssues += result.issues.length;
    if (!result.pass) results.pass = false;
  }

  return results;
}

// CLI
if (require.main === module) {
  console.log("=== L3 Style Gate ===");

  const result = verifyAll();
  console.log(`검사 파일: ${result.files.length}개, 총 이슈: ${result.totalIssues}개\n`);

  for (const file of result.files) {
    const status = file.pass ? "✅" : "❌";
    console.log(`${status} ${file.label} (문장 ${file.sentenceCount}개, 이슈 ${file.issues.length}개)`);
    for (const issue of file.issues.slice(0, 5)) {
      console.log(`   [${issue.type}] ${issue.detail}`);
    }
    if (file.issues.length > 5) {
      console.log(`   ... 외 ${file.issues.length - 5}개`);
    }
  }

  console.log(result.pass ? "\n✅ L3 Style Gate 통과" : "\n❌ L3 Style Gate 실패");
  process.exit(result.pass ? 0 : 1);
}

module.exports = { verify: verifyText, verifyAll };
