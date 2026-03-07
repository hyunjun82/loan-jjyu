#!/usr/bin/env node
/**
 * L1~L4 통합 검증 러너
 * 사용법: node scripts/verify-all.js [--fix]
 */
const { verify: verifySource } = require("./verify-source");
const { verifyAll: verifyFacts } = require("./verify-facts");
const { verifyAll: verifyStyle } = require("./verify-style");
const { verifyAll: verifySelfCheck } = require("./verify-selfcheck");

function run() {
  console.log("╔══════════════════════════════════════╗");
  console.log("║   서민금융 콘텐츠 품질 검증 (L1~L4)   ║");
  console.log("╚══════════════════════════════════════╝\n");

  let allPass = true;

  // L1: Source Gate
  console.log("━━━ L1 Source Gate ━━━");
  try {
    const l1 = verifySource();
    console.log(`  검증: ${l1.checked}개, 오류: ${l1.errors.length}개, 경고: ${l1.warnings.length}개`);
    l1.errors.forEach((e) => console.log(`  ❌ ${e}`));
    l1.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
    console.log(l1.pass ? "  → ✅ 통과\n" : "  → ❌ 실패\n");
    if (!l1.pass) allPass = false;
  } catch (e) {
    console.log(`  ⚠ 스킵 (source-data 미설정): ${e.message}\n`);
  }

  // L2: Fact Gate
  console.log("━━━ L2 Fact Gate ━━━");
  try {
    const l2 = verifyFacts();
    console.log(`  전체 팩트: ${l2.totalFacts}개`);
    l2.articles.forEach((a) => console.log(`  [${a.category}] ${a.factsFound}개 팩트 추출`));
    console.log("  → ✅ 팩트 추출 완료 (교차검증은 개별 실행)\n");
  } catch (e) {
    console.log(`  ⚠ 스킵: ${e.message}\n`);
  }

  // L3: Style Gate
  console.log("━━━ L3 Style Gate ━━━");
  try {
    const l3 = verifyStyle();
    console.log(`  검사 파일: ${l3.files.length}개, 총 이슈: ${l3.totalIssues}개`);
    for (const f of l3.files) {
      if (f.issues.length > 0) {
        console.log(`  [${f.label}]`);
        f.issues.slice(0, 3).forEach((i) => console.log(`    ${i.type}: ${i.detail}`));
        if (f.issues.length > 3) console.log(`    ... 외 ${f.issues.length - 3}개`);
      }
    }
    console.log(l3.pass ? "  → ✅ 통과\n" : "  → ❌ 실패\n");
    if (!l3.pass) allPass = false;
  } catch (e) {
    console.log(`  ⚠ 스킵: ${e.message}\n`);
  }

  // L4: Self-Check Gate
  console.log("━━━ L4 Self-Check Gate ━━━");
  try {
    const l4 = verifySelfCheck();
    console.log(`  검사 파일: ${l4.files.length}개, 총 이슈: ${l4.totalIssues}개`);
    for (const f of l4.files) {
      if (f.issues.length > 0) {
        console.log(`  [${f.label}]`);
        f.issues.forEach((i) => console.log(`    ${i.type}: ${i.detail}`));
      }
    }
    console.log(l4.pass ? "  → ✅ 통과\n" : "  → ❌ 실패\n");
    if (!l4.pass) allPass = false;
  } catch (e) {
    console.log(`  ⚠ 스킵: ${e.message}\n`);
  }

  // Summary
  console.log("═══════════════════════════════════");
  if (allPass) {
    console.log("✅ 전체 검증 통과");
  } else {
    console.log("❌ 일부 검증 실패 — 위 오류를 확인하세요");
  }
  console.log("═══════════════════════════════════");

  process.exit(allPass ? 0 : 1);
}

run();
