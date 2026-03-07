#!/usr/bin/env node
/**
 * Hook: 글 편집 전 출처 확인 여부 검증
 * data/articles/*.ts 편집 시 source-data를 먼저 읽었는지 확인
 */
const path = require("path");
const { hasReadSource } = require("./track-source-read");

function shouldCheck(filePath) {
  return (
    filePath.includes("data/articles/") &&
    filePath.endsWith(".ts") &&
    !filePath.endsWith("index.ts")
  );
}

function extractSlugFromPath(filePath) {
  const basename = path.basename(filePath, ".ts");
  return basename;
}

// CLI
if (require.main === module) {
  const filePath = process.argv[2];

  if (!filePath || !shouldCheck(filePath)) {
    process.exit(0);
  }

  const slug = extractSlugFromPath(filePath);
  const read = hasReadSource(slug, 60);

  if (!read) {
    console.log(`⚠ 출처 데이터를 먼저 확인하세요.`);
    console.log(`  실행: node .claude/hooks/track-source-read.js log ${slug}`);
    console.log(`  또는: source-data/${slug}.json 을 확인 후 진행하세요.`);
    // 경고만 — 차단하지 않음
    process.exit(0);
  }

  console.log(`✅ ${slug} 출처 확인됨 — 편집 진행`);
  process.exit(0);
}

module.exports = { shouldCheck, extractSlugFromPath };
