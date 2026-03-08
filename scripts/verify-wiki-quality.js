#!/usr/bin/env node
/**
 * Push Hook 품질 검사 — git push 전 변경된 글 파일만 빠르게 검증
 * 사용법: node scripts/verify-wiki-quality.js [파일경로...]
 */
const fs = require("fs");
const path = require("path");
const { verify: verifyStyle } = require("./verify-style");
const { verify: verifySelfCheck } = require("./verify-selfcheck");
const { extractNumbers } = require("./verify-facts");

function getChangedArticleFiles() {
  // stdin에서 파일 목록을 받거나, argv에서 받음
  const args = process.argv.slice(2);
  if (args.length > 0) return args;

  // push되는 커밋에서 변경된 article 파일 추출
  try {
    const { execSync } = require("child_process");
    // 원격과 비교하여 push 대상 커밋의 변경 파일 확인
    let diff = "";
    try {
      const remote = execSync("git rev-parse --abbrev-ref --symbolic-full-name @{u}", { encoding: "utf-8" }).trim();
      diff = execSync(`git diff ${remote}..HEAD --name-only -- data/articles/`, { encoding: "utf-8" });
    } catch {
      // 원격 추적 브랜치 없으면 최근 커밋 기준
      diff = execSync("git diff HEAD~1..HEAD --name-only -- data/articles/", { encoding: "utf-8" });
    }
    return diff
      .split("\n")
      .filter((f) => f.endsWith(".ts") && !f.endsWith("index.ts"));
  } catch {
    return [];
  }
}

function quickCheck(filePath) {
  const absPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  if (!fs.existsSync(absPath)) {
    return { file: filePath, pass: true, skipped: true };
  }

  const content = fs.readFileSync(absPath, "utf-8");
  const textContent = content
    .replace(/\/\/.*$/gm, "")
    .replace(/import\s.*?;/g, "")
    .match(/"([^"]{10,})"|'([^']{10,})'|`([^`]{10,})`/g);

  if (!textContent) {
    return { file: filePath, pass: true, skipped: true };
  }

  const allText = textContent.join("\n");

  const styleResult = verifyStyle(allText, filePath);
  const selfCheckResult = verifySelfCheck(allText, filePath);
  const facts = extractNumbers(allText);

  const issues = [...styleResult.issues, ...selfCheckResult.issues];
  const errors = issues.filter((i) => i.type.includes("충돌") || i.type.includes("AI냄새"));
  const warnings = issues.filter((i) => !errors.includes(i));

  return {
    file: filePath,
    pass: errors.length === 0,
    errors,
    warnings,
    factsCount: facts.length,
  };
}

// CLI
if (require.main === module) {
  const files = getChangedArticleFiles();

  if (files.length === 0) {
    console.log("변경된 글 파일 없음 — 검사 스킵");
    process.exit(0);
  }

  console.log(`📝 ${files.length}개 파일 품질 검사...\n`);

  let allPass = true;
  for (const file of files) {
    const result = quickCheck(file);
    if (result.skipped) {
      console.log(`⏭ ${result.file} (스킵)`);
      continue;
    }

    const status = result.pass ? "✅" : "❌";
    console.log(`${status} ${result.file} (팩트 ${result.factsCount}개)`);

    if (result.errors.length) {
      result.errors.forEach((e) => console.log(`  ❌ [${e.type}] ${e.detail}`));
    }
    if (result.warnings.length) {
      result.warnings.slice(0, 3).forEach((w) => console.log(`  ⚠ [${w.type}] ${w.detail}`));
    }

    if (!result.pass) allPass = false;
  }

  console.log(allPass ? "\n✅ 품질 검사 통과" : "\n❌ 품질 검사 실패 — 오류를 수정하세요");
  process.exit(allPass ? 0 : 1);
}

module.exports = { quickCheck };
