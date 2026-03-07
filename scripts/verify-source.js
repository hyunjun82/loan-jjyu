#!/usr/bin/env node
/**
 * L1 Source Gate — 출처 JSON 존재·스키마·신선도 검증
 */
const fs = require("fs");
const path = require("path");

const CONFIG = JSON.parse(
  fs.readFileSync(path.join(__dirname, "quality-config.json"), "utf-8")
);
const SOURCE_DIR = path.join(__dirname, "..", "source-data");
const MAP_PATH = path.join(SOURCE_DIR, "source-map.json");
const SCHEMA_PATH = path.join(SOURCE_DIR, "schema.json");

function loadSourceMap() {
  if (!fs.existsSync(MAP_PATH)) {
    return { error: "source-map.json 파일이 없습니다." };
  }
  try {
    return { data: JSON.parse(fs.readFileSync(MAP_PATH, "utf-8")) };
  } catch (e) {
    return { error: `source-map.json 파싱 실패: ${e.message}` };
  }
}

function loadSchema() {
  if (!fs.existsSync(SCHEMA_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf-8"));
  } catch {
    return null;
  }
}

function checkFreshness(dateStr) {
  if (!dateStr) return { fresh: false, reason: "날짜 정보 없음" };
  const fetched = new Date(dateStr);
  const now = new Date();
  const diffDays = (now - fetched) / (1000 * 60 * 60 * 24);
  const maxAge = CONFIG.freshness?.maxAgeDays || 180;
  if (diffDays > maxAge) {
    return { fresh: false, reason: `${Math.floor(diffDays)}일 경과 (기준: ${maxAge}일)` };
  }
  return { fresh: true, days: Math.floor(diffDays) };
}

function validateSchema(entry, schema) {
  if (!schema || !schema.requiredFields) return [];
  const errors = [];
  for (const field of schema.requiredFields) {
    if (!(field in entry)) {
      errors.push(`필수 필드 "${field}" 누락`);
    }
  }
  return errors;
}

function verify(targetSlug) {
  const results = { pass: true, errors: [], warnings: [], checked: 0 };

  const mapResult = loadSourceMap();
  if (mapResult.error) {
    results.pass = false;
    results.errors.push(mapResult.error);
    return results;
  }

  const sourceMap = mapResult.data;
  const schema = loadSchema();
  const entries = targetSlug
    ? { [targetSlug]: sourceMap[targetSlug] }
    : sourceMap;

  for (const [slug, entry] of Object.entries(entries)) {
    if (!entry) {
      results.errors.push(`[${slug}] source-map에 항목 없음`);
      results.pass = false;
      continue;
    }
    results.checked++;

    // 출처 파일 존재 확인
    if (entry.file) {
      const filePath = path.join(SOURCE_DIR, entry.file);
      if (!fs.existsSync(filePath)) {
        results.errors.push(`[${slug}] 출처 파일 없음: ${entry.file}`);
        results.pass = false;
      }
    }

    // 스키마 검증
    const schemaErrors = validateSchema(entry, schema);
    if (schemaErrors.length > 0) {
      results.errors.push(`[${slug}] 스키마 오류: ${schemaErrors.join(", ")}`);
      results.pass = false;
    }

    // 신선도 검증
    const freshness = checkFreshness(entry.fetchedAt || entry.dateModified);
    if (!freshness.fresh) {
      results.warnings.push(`[${slug}] 데이터 신선도 경고: ${freshness.reason}`);
    }
  }

  return results;
}

// CLI
if (require.main === module) {
  const slug = process.argv[2] || null;
  console.log("=== L1 Source Gate ===");

  if (!fs.existsSync(SOURCE_DIR)) {
    console.log("⚠ source-data/ 디렉터리 없음 — 초기 상태입니다.");
    console.log("  source-data/source-map.json 을 생성하세요.");
    process.exit(0);
  }

  const result = verify(slug);
  console.log(`검증 항목: ${result.checked}개`);

  if (result.errors.length) {
    console.log("\n❌ 오류:");
    result.errors.forEach((e) => console.log(`  - ${e}`));
  }
  if (result.warnings.length) {
    console.log("\n⚠ 경고:");
    result.warnings.forEach((w) => console.log(`  - ${w}`));
  }
  if (result.pass) {
    console.log("\n✅ L1 Source Gate 통과");
  } else {
    console.log("\n❌ L1 Source Gate 실패");
  }

  process.exit(result.pass ? 0 : 1);
}

module.exports = { verify };
