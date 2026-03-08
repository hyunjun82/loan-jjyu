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
    .filter((s) => s.length > 5)
    .filter((s) => /[가-힣]/.test(s))  // 한국어 포함 문장만
    .filter((s) => /[가-힣요죠네다]$/.test(s.replace(/["""'`\s]/g, ""))); // 한국어로 끝나는 문장만
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
  // 해요체 필수 어미는 연속 반복 허용
  const allowedEndings = ["요", "죠", "네요", "어요", "아요", "예요", "이요"];

  // Extract last 2-char endings
  const endings = sentences
    .filter((s) => s.length >= 2)
    .map((s) => s.slice(-2));

  let streak = 1;
  for (let i = 1; i < endings.length; i++) {
    if (endings[i] === endings[i - 1]) {
      streak++;
      const isAllowed = allowedEndings.some((e) => endings[i].endsWith(e[e.length - 1]));
      if (streak > max && !isAllowed) {
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

// 연결어 반복 사용 감지 — 같은 연결어로 시작하는 문단이 전체의 20% 초과 시 경고
function checkDiscourseMarkerRepetition(text) {
  const issues = [];
  const markers = [
    "이때", "반면", "따라서", "이후", "참고로", "또한", "한편",
    "그러나", "하지만", "그리고", "그런데", "아울러", "더불어",
    "다만", "먼저", "그래서", "마지막으로", "우선", "특히",
  ];
  // <p> 태그 또는 빈줄로 나뉜 문단 추출
  const paragraphs = text
    .split(/<p>|\n\n/)
    .map((p) => p.replace(/<[^>]+>/g, "").trim())
    .filter((p) => p.length > 10 && /[가-힣]/.test(p));

  if (paragraphs.length < 5) return issues; // 문단 적으면 스킵

  for (const marker of markers) {
    const count = paragraphs.filter((p) => p.startsWith(marker)).length;
    const ratio = count / paragraphs.length;
    if (ratio > 0.2 && count >= 3) {
      issues.push({
        type: "연결어 반복",
        detail: `"${marker}"로 시작하는 문단 ${count}개 (전체 ${paragraphs.length}개의 ${Math.round(ratio * 100)}%) — 자연스럽게 바꾸세요`,
      });
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
    ...checkDiscourseMarkerRepetition(text),
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
