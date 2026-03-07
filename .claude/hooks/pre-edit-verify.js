#!/usr/bin/env node
/**
 * Hook: 글 편집 전 출처 확인 여부 검증
 * data/articles/*.ts 편집 시 source-data JSON을 먼저 읽었는지 확인
 *
 * 동작:
 *   1. 편집 대상이 data/articles/*.ts 가 아니면 통과
 *   2. source-map.json에서 해당 카테고리의 상품 slug 목록 확인
 *   3. 최근 60분 내 source-data/{slug}.json을 읽은 기록이 있는지 확인
 *   4. 하나도 안 읽었으면 exit(1)로 차단
 */
const fs = require("fs");
const path = require("path");
const { hasReadSource, getRecentReads } = require("./track-source-read");

const SOURCE_MAP_PATH = path.resolve(__dirname, "../../source-data/source-map.json");
const ARTICLES_DIR = path.resolve(__dirname, "../../data/articles");

function shouldCheck(filePath) {
  return (
    filePath.includes("data/articles/") &&
    filePath.endsWith(".ts") &&
    !filePath.endsWith("index.ts")
  );
}

function getSlugsByCategory(categorySlug) {
  // 해당 카테고리 article 파일에서 spoke slug 목록 추출
  const articlePath = path.join(ARTICLES_DIR, `${categorySlug}.ts`);
  if (!fs.existsSync(articlePath)) return [];
  const content = fs.readFileSync(articlePath, "utf-8");
  const slugMatches = [...content.matchAll(/slug:\s*"([^"]+)"/g)];
  return [...new Set(slugMatches.map((m) => m[1]))];
}

function getSourceMappedSlugs(slugs) {
  // source-map에 등록된 slug만 필터
  if (!fs.existsSync(SOURCE_MAP_PATH)) return [];
  const map = JSON.parse(fs.readFileSync(SOURCE_MAP_PATH, "utf-8"));
  return slugs.filter((s) => map[s] && map[s].file);
}

// CLI
if (require.main === module) {
  const filePath = process.argv[2];

  if (!filePath || !shouldCheck(filePath)) {
    process.exit(0);
  }

  const categorySlug = path.basename(filePath, ".ts");
  const allSlugs = getSlugsByCategory(categorySlug);
  const mappedSlugs = getSourceMappedSlugs(allSlugs);

  if (mappedSlugs.length === 0) {
    // source-map에 등록된 상품이 없으면 통과
    process.exit(0);
  }

  const recentReads = getRecentReads(60);
  const readSlugs = mappedSlugs.filter((slug) =>
    recentReads.some((r) => r.includes(slug))
  );
  const unreadSlugs = mappedSlugs.filter((slug) => !readSlugs.includes(slug));

  if (readSlugs.length === 0) {
    // 하나도 안 읽었으면 차단
    console.error(`BLOCKED: source-data JSON을 먼저 읽지 않았어요.`);
    console.error(`[${categorySlug}] 카테고리의 출처 데이터를 먼저 확인하세요:`);
    for (const slug of unreadSlugs) {
      console.error(`  - source-data/${slug}.json`);
    }
    process.exit(1);
  }

  if (unreadSlugs.length > 0) {
    // 일부만 읽었으면 경고 (차단은 안 함)
    console.log(`주의: 아직 읽지 않은 출처 데이터가 있어요:`);
    for (const slug of unreadSlugs) {
      console.log(`  - source-data/${slug}.json`);
    }
  }

  process.exit(0);
}

module.exports = { shouldCheck };
