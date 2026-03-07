#!/usr/bin/env node
/**
 * L4 Self-Check Gate — 역방향 팩트 추출 + 부정-긍정 충돌 검출
 */
const fs = require("fs");
const path = require("path");

const CONFIG = JSON.parse(
  fs.readFileSync(path.join(__dirname, "quality-config.json"), "utf-8")
);
const ARTICLES_DIR = path.join(__dirname, "..", "data", "articles");

function checkNegationConflicts(text) {
  const conflicts = [];
  const { negationPairs } = CONFIG.selfCheck;

  for (const [negative, positive] of negationPairs) {
    const hasNeg = text.includes(negative);
    const hasPos = text.includes(positive);
    if (hasNeg && hasPos) {
      conflicts.push({
        type: "부정-긍정 충돌",
        negative,
        positive,
        detail: `같은 글에 "${negative}"과 "${positive}"이 공존`,
      });
    }
  }
  return conflicts;
}

function checkSectionConsistency(text) {
  const issues = [];

  // 같은 글에서 서로 다른 금리 범위가 모순되는지 확인
  const ratePattern = /연\s*(\d+\.?\d*)\s*%/g;
  const rates = [];
  let match;
  while ((match = ratePattern.exec(text)) !== null) {
    rates.push(parseFloat(match[1]));
  }

  if (rates.length >= 2) {
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    // 금리 범위가 10%p 이상 차이나면 경고
    if (max - min > 10) {
      issues.push({
        type: "금리 범위 의심",
        detail: `금리 범위 ${min}%~${max}% (차이 ${(max - min).toFixed(1)}%p) — 확인 필요`,
      });
    }
  }

  // 한도 모순 검출 (최소 > 최대 패턴)
  const limitPattern = /최대\s*(\d[\d,]*)\s*만원/g;
  const limits = [];
  while ((match = limitPattern.exec(text)) !== null) {
    limits.push(parseInt(match[1].replace(/,/g, "")));
  }

  if (limits.length >= 2) {
    const unique = [...new Set(limits)];
    if (unique.length > 2) {
      issues.push({
        type: "한도 다중 기재",
        detail: `한도가 ${unique.length}개 기재됨: ${unique.join(", ")}만원 — 확인 필요`,
      });
    }
  }

  return issues;
}

function checkStructure(text) {
  const issues = [];
  const { structure } = CONFIG;

  // 섹션 키워드 포함 확인
  if (structure.requiredSectionKeywords) {
    for (const keyword of structure.requiredSectionKeywords) {
      if (!text.includes(keyword)) {
        issues.push({
          type: "필수 섹션 누락",
          detail: `"${keyword}" 관련 내용이 없습니다`,
        });
      }
    }
  }

  return issues;
}

function verify(text, label) {
  const issues = [
    ...checkNegationConflicts(text),
    ...checkSectionConsistency(text),
    ...checkStructure(text),
  ];

  return {
    label,
    issues,
    pass: issues.filter((i) => i.type.includes("충돌")).length === 0,
  };
}

function verifyAll() {
  const results = { pass: true, files: [], totalIssues: 0 };

  if (!fs.existsSync(ARTICLES_DIR)) return results;

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".ts") && f !== "index.ts");

  for (const file of files) {
    const content = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");

    // Extract text content
    const textContent = content
      .replace(/\/\/.*$/gm, "")
      .replace(/import\s.*?;/g, "")
      .match(/"([^"]{10,})"|'([^']{10,})'|`([^`]{10,})`/g);

    if (!textContent) continue;

    const allText = textContent.join("\n");
    const result = verify(allText, file);
    results.files.push(result);
    results.totalIssues += result.issues.length;
    if (!result.pass) results.pass = false;
  }

  return results;
}

// CLI
if (require.main === module) {
  console.log("=== L4 Self-Check Gate ===");

  const result = verifyAll();
  console.log(`검사 파일: ${result.files.length}개, 총 이슈: ${result.totalIssues}개\n`);

  for (const file of result.files) {
    const status = file.pass ? "✅" : "❌";
    console.log(`${status} ${file.label} (이슈 ${file.issues.length}개)`);
    for (const issue of file.issues) {
      console.log(`   [${issue.type}] ${issue.detail}`);
    }
  }

  console.log(result.pass ? "\n✅ L4 Self-Check Gate 통과" : "\n❌ L4 Self-Check Gate 실패");
  process.exit(result.pass ? 0 : 1);
}

module.exports = { verify, verifyAll };
