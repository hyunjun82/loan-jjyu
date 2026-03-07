#!/usr/bin/env node
/**
 * L2 Fact Gate — 글 속 숫자 ↔ 출처 JSON 교차 검증
 * 금리(%), 한도(만원/원), 기간(년/개월), 연령제한, 소득기준, 신용점수
 */
const fs = require("fs");
const path = require("path");

const CONFIG = JSON.parse(
  fs.readFileSync(path.join(__dirname, "quality-config.json"), "utf-8")
);
const SOURCE_DIR = path.join(__dirname, "..", "source-data");
const ARTICLES_DIR = path.join(__dirname, "..", "data", "articles");

function extractNumbers(text) {
  const found = [];
  for (const { pattern, label } of CONFIG.factCheck.numberPatterns) {
    const re = new RegExp(pattern, "g");
    let match;
    while ((match = re.exec(text)) !== null) {
      found.push({
        label,
        value: match[1].replace(/,/g, ""),
        raw: match[0],
      });
    }
  }
  return found;
}

function loadSourceData(slug) {
  const mapPath = path.join(SOURCE_DIR, "source-map.json");
  if (!fs.existsSync(mapPath)) return null;
  const map = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
  const entry = map[slug];
  if (!entry || !entry.file) return null;
  const filePath = path.join(SOURCE_DIR, entry.file);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function loadArticleText(categorySlug, spokeSlug) {
  // Try to load the article module and extract text
  const catFile = path.join(ARTICLES_DIR, `${categorySlug}.ts`);
  if (!fs.existsSync(catFile)) return null;

  const content = fs.readFileSync(catFile, "utf-8");

  // Extract sections content for the specific spoke
  const spokePattern = new RegExp(
    `["']${spokeSlug}["']\\s*:\\s*\\{[\\s\\S]*?sections\\s*:\\s*\\[([\\s\\S]*?)\\]\\s*,?\\s*(?:datePublished|dateModified|faq|\\})`,
    "m"
  );
  const match = content.match(spokePattern);
  if (!match) return content; // fallback: check entire file
  return match[1];
}

function verify(categorySlug, spokeSlug) {
  const results = { pass: true, errors: [], warnings: [], facts: [] };

  const articleText = loadArticleText(categorySlug, spokeSlug);
  if (!articleText) {
    results.warnings.push("글 텍스트를 불러올 수 없습니다.");
    return results;
  }

  const numbers = extractNumbers(articleText);
  results.facts = numbers;

  if (numbers.length === 0) {
    results.warnings.push("글에서 숫자 데이터를 찾을 수 없습니다.");
    return results;
  }

  // 출처 데이터와 교차 검증
  const sourceData = loadSourceData(spokeSlug);
  if (!sourceData) {
    results.warnings.push(
      `출처 데이터 없음 (${spokeSlug}) — 교차검증 스킵. source-data/ 에 데이터를 추가하세요.`
    );
    return results;
  }

  // Compare extracted numbers with source data
  for (const fact of numbers) {
    const sourceValue = sourceData[fact.label];
    if (sourceValue !== undefined) {
      const articleVal = parseFloat(fact.value);
      const srcVal = parseFloat(String(sourceValue).replace(/,/g, ""));
      if (!isNaN(articleVal) && !isNaN(srcVal) && articleVal !== srcVal) {
        results.errors.push(
          `[${fact.label}] 글: ${fact.value} vs 출처: ${sourceValue} — "${fact.raw}"`
        );
        results.pass = false;
      }
    }
  }

  return results;
}

function verifyAll() {
  const results = { pass: true, articles: [], totalFacts: 0 };

  // Scan article files
  if (!fs.existsSync(ARTICLES_DIR)) {
    results.pass = false;
    return results;
  }

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".ts") && f !== "index.ts");

  for (const file of files) {
    const categorySlug = file.replace(".ts", "");
    const content = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
    const numbers = extractNumbers(content);
    results.totalFacts += numbers.length;
    results.articles.push({
      category: categorySlug,
      factsFound: numbers.length,
      facts: numbers.slice(0, 10), // sample
    });
  }

  return results;
}

// CLI
if (require.main === module) {
  console.log("=== L2 Fact Gate ===");

  const arg1 = process.argv[2];
  const arg2 = process.argv[3];

  if (arg1 && arg2) {
    const result = verify(arg1, arg2);
    console.log(`추출된 팩트: ${result.facts.length}개`);
    result.facts.forEach((f) => console.log(`  ${f.label}: ${f.value} (${f.raw})`));
    if (result.errors.length) {
      console.log("\n❌ 불일치:");
      result.errors.forEach((e) => console.log(`  - ${e}`));
    }
    if (result.warnings.length) {
      console.log("\n⚠ 경고:");
      result.warnings.forEach((w) => console.log(`  - ${w}`));
    }
    console.log(result.pass ? "\n✅ L2 Fact Gate 통과" : "\n❌ L2 Fact Gate 실패");
    process.exit(result.pass ? 0 : 1);
  } else {
    const result = verifyAll();
    console.log(`전체 팩트 추출: ${result.totalFacts}개`);
    result.articles.forEach((a) => {
      console.log(`\n[${a.category}] ${a.factsFound}개 팩트`);
      a.facts.forEach((f) => console.log(`  ${f.label}: ${f.value}`));
    });
    console.log("\n(교차검증은 개별 글 단위로 실행: node verify-facts.js <category> <slug>)");
  }
}

module.exports = { verify, verifyAll, extractNumbers };
