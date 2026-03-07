#!/usr/bin/env node
/**
 * 금융위원회/서민금융진흥원 공공데이터 수집 스크립트
 * 사용법: node scripts/fetch-source.js [--all | --slug <slug>]
 *
 * 환경변수:
 *   DATA_GO_KR_KEY - data.go.kr API 인증키
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const SOURCE_DIR = path.join(__dirname, "..", "source-data");
const MAP_PATH = path.join(SOURCE_DIR, "source-map.json");

const API_KEY = process.env.DATA_GO_KR_KEY || "";

// 서민금융진흥원 API 엔드포인트 (공공데이터포털)
const ENDPOINTS = {
  서민금융진흥원: {
    base: "https://apis.data.go.kr/B553195",
    services: {
      햇살론유스: "/sunloan/youth",
      햇살론15: "/sunloan/fifteen",
      햇살론뱅크: "/sunloan/bank",
      미소금융: "/miso/loan",
      긴급생계자금: "/emergency/loan",
    },
  },
  금융위원회: {
    base: "https://apis.data.go.kr/1160100",
    services: {
      새희망홀씨: "/service/GetFinPrdInfoSvc",
    },
  },
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve({ raw: data });
          }
        });
      })
      .on("error", reject);
  });
}

async function fetchProduct(slug, entry) {
  const source = ENDPOINTS[entry.source];
  if (!source) {
    console.log(`  ⚠ ${entry.source} API 미등록 — 수동 수집 필요`);
    return null;
  }

  const servicePath = source.services[slug];
  if (!servicePath) {
    console.log(`  ⚠ ${slug} 서비스 경로 미등록`);
    return null;
  }

  if (!API_KEY) {
    console.log(`  ⚠ DATA_GO_KR_KEY 미설정 — 스텁 데이터 생성`);
    return createStub(slug, entry);
  }

  const url = `${source.base}${servicePath}?serviceKey=${encodeURIComponent(API_KEY)}&type=json&numOfRows=1`;
  console.log(`  📡 요청: ${slug}...`);

  try {
    const data = await fetchUrl(url);
    return data;
  } catch (e) {
    console.log(`  ❌ 요청 실패: ${e.message}`);
    return null;
  }
}

function createStub(slug, entry) {
  return {
    name: entry.name,
    source: entry.source,
    fetchedAt: new Date().toISOString().split("T")[0],
    status: "stub",
    note: "API키 미설정으로 스텁 생성됨. 실제 데이터로 교체 필요.",
  };
}

async function run() {
  console.log("=== 서민금융 출처 데이터 수집 ===\n");

  if (!fs.existsSync(SOURCE_DIR)) {
    fs.mkdirSync(SOURCE_DIR, { recursive: true });
  }

  const sourceMap = JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"));
  const targetSlug = process.argv.includes("--slug")
    ? process.argv[process.argv.indexOf("--slug") + 1]
    : null;

  const slugs = targetSlug ? [targetSlug] : Object.keys(sourceMap);

  for (const slug of slugs) {
    const entry = sourceMap[slug];
    if (!entry) {
      console.log(`⚠ ${slug}: source-map에 없음`);
      continue;
    }

    console.log(`\n[${slug}] (${entry.source})`);
    const data = await fetchProduct(slug, entry);

    if (data) {
      const outPath = path.join(SOURCE_DIR, `${slug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf-8");
      console.log(`  ✅ 저장: ${slug}.json`);

      // source-map 업데이트
      entry.fetchedAt = new Date().toISOString().split("T")[0];
    }
  }

  // source-map 저장
  fs.writeFileSync(MAP_PATH, JSON.stringify(sourceMap, null, 2), "utf-8");
  console.log("\n✅ source-map.json 업데이트 완료");
}

run().catch((e) => {
  console.error("오류:", e.message);
  process.exit(1);
});
