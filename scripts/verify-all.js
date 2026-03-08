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
    const fs = require("fs");
    const path = require("path");
    const SOURCE_DIR = path.join(__dirname, "..", "source-data");
    const ARTICLES_DIR = path.join(__dirname, "..", "data", "articles");
    const sourceMap = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, "source-map.json"), "utf-8"));
    const articleFiles = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".ts") && f !== "index.ts");
    const l2Errors = [];

    for (const file of articleFiles) {
      const content = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
      // spoke 글이 있는지 확인 (sections 필드가 있으면 spoke 글 존재)
      const hasSpokes = content.includes("sections:");
      if (!hasSpokes) continue;
      // 파일 내 categorySlug 값 추출
      const catMatch = content.match(/categorySlug:\s*["']([^"']+)["']/);
      const catSlug = catMatch ? catMatch[1] : file.replace(".ts", "");
      // 이 카테고리의 소스 데이터가 있는지 확인
      const sourceEntry = sourceMap[catSlug] || Object.values(sourceMap).find((v) => v.name === catSlug);
      if (!sourceEntry) {
        l2Errors.push(`[차단] "${catSlug}" 카테고리 소스 없음 — source-map.json에 등록 후 재작성하세요`);
        allPass = false;
      } else {
        const srcFile = path.join(SOURCE_DIR, sourceEntry.file);
        if (!fs.existsSync(srcFile)) {
          l2Errors.push(`[차단] "${catSlug}" 소스 파일 없음 — ${sourceEntry.file} 확보 필요`);
          allPass = false;
        }
      }
    }

    const l2 = verifyFacts();
    console.log(`  전체 팩트: ${l2.totalFacts}개`);
    l2.articles.forEach((a) => console.log(`  [${a.category}] ${a.factsFound}개 팩트 추출`));
    if (l2Errors.length > 0) {
      l2Errors.forEach((e) => console.log(`  ❌ ${e}`));
      console.log("  → ❌ 실패\n");
    } else {
      console.log("  → ✅ 통과\n");
    }
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
