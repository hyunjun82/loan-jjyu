#!/usr/bin/env node
/**
 * 롱테일 키워드 타이틀 생성기
 *
 * source-data/*.json에서 팩트 데이터를 읽어
 * 실제 사용자 검색어 패턴 기반 롱테일 타이틀을 자동 생성한다.
 *
 * 사용법: node scripts/generate-longtail.js [--json] [--count]
 *   --json   결과를 JSON으로 출력
 *   --count  개수만 출력
 */
const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(__dirname, "..", "source-data");
const MAP_PATH = path.join(SOURCE_DIR, "source-map.json");

// ── 헬퍼 ──

function loadProduct(slug) {
  const filePath = path.join(SOURCE_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function fmt한도(만원) {
  const n = typeof 만원 === "number" ? 만원 : parseInt(만원, 10);
  if (isNaN(n)) return `${만원}`;
  return n >= 10000 ? `${n / 10000}억원` : `${n}만원`;
}

function fmt금리(raw) {
  const s = String(raw).replace(/^연\s*/, "");
  return s.includes("%") ? s : `${s}%`;
}

function split대상(raw) {
  if (!raw) return [];
  // 쉼표로만 분할 (중·저신용자 같은 가운뎃점은 유지)
  return raw
    .split(/,/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
}

// ── 롱테일 패턴 정의 ──
// 각 패턴은 (product) => { slug, title, usedFields } | null

const PATTERNS = [
  // 1. 기본 (hub spoke)
  (p) => {
    const rate = p["금리(%)"] ? fmt금리(p["금리(%)"]) : "";
    const limit = p["한도(만원)"] ? fmt한도(p["한도(만원)"]) : "";
    return {
      slug: `${p.name}`,
      title: `${p.name} 신청자격 금리 한도 | ${rate} ${limit} ${targetLabel(p)} 조건`,
      type: "기본",
      usedFields: ["name", "금리(%)", "한도(만원)"],
    };
  },

  // 2. 금리
  (p) => {
    if (!p["금리(%)"]) return null;
    const rate = fmt금리(p["금리(%)"]);
    const limit = p["한도(만원)"] ? fmt한도(p["한도(만원)"]) : "";
    const period = p["기간(년)"] ? `${p["기간(년)"]}년` : "";
    return {
      slug: `${p.name}-금리`,
      title: `${p.name} 금리 ${rate} 조건 | ${limit} ${period} 이자 계산`,
      type: "금리",
      usedFields: ["name", "금리(%)", "한도(만원)", "기간(년)"],
    };
  },

  // 3. 한도
  (p) => {
    if (!p["한도(만원)"]) return null;
    const limit = fmt한도(p["한도(만원)"]);
    const rate = p["금리(%)"] ? fmt금리(p["금리(%)"]) : "";
    return {
      slug: `${p.name}-한도`,
      title: `${p.name} ${limit} 한도 조건 | 금리 ${rate} 상환 기간 정리`,
      type: "한도",
      usedFields: ["name", "한도(만원)", "금리(%)"],
    };
  },

  // 4. 연령 (있는 상품만)
  (p) => {
    if (!p["연령제한"]) return null;
    const age = p["연령제한"];
    const maxAge = age.match(/(\d+)세/g);
    const upper = maxAge ? maxAge[maxAge.length - 1] : age;
    const rate = p["금리(%)"] ? fmt금리(p["금리(%)"]) : "";
    return {
      slug: `${p.name}-나이`,
      title: `${p.name} 나이 ${age} 조건 | ${upper} 초과 시 대체 상품 금리 ${rate}`,
      type: "연령",
      usedFields: ["name", "연령제한", "금리(%)"],
    };
  },

  // 5. 신청방법
  (p) => {
    const methods = p["신청방법"] || [];
    const channel = p["상담채널"] || "1397";
    const methodStr = methods.length > 0 ? methods[0] : "방문";
    return {
      slug: `${p.name}-신청방법`,
      title: `${p.name} 신청 방법 ${methodStr} | ${channel} 접수 절차`,
      type: "신청방법",
      usedFields: ["name", "신청방법", "상담채널"],
    };
  },

  // 6. 부결사유
  (p) => {
    if (!p["부결사유"] || p["부결사유"].length === 0) return null;
    const top = p["부결사유"][0];
    const count = p["부결사유"].length;
    return {
      slug: `${p.name}-부결`,
      title: `${p.name} 부결 사유 ${count}가지 | ${top} 등 재신청 조건`,
      type: "부결",
      usedFields: ["name", "부결사유"],
    };
  },

  // 7. 대환 (가능한 상품만)
  (p) => {
    if (!p["대환가능"]) return null;
    const cond = p["대환조건"] || "기존 대출 전환";
    const rate = p["금리(%)"] ? fmt금리(p["금리(%)"]) : "";
    return {
      slug: `${p.name}-대환`,
      title: `${p.name} 대환 대출 금리 ${rate} | ${cond.slice(0, 20)}`,
      type: "대환",
      usedFields: ["name", "대환가능", "대환조건", "금리(%)"],
    };
  },

  // 8. 필요서류
  (p) => {
    if (!p["필요서류"] || p["필요서류"].length === 0) return null;
    const count = p["필요서류"].length;
    const first = p["필요서류"][0];
    return {
      slug: `${p.name}-서류`,
      title: `${p.name} 필요서류 ${count}종 | ${first} 등 준비 목록`,
      type: "필요서류",
      usedFields: ["name", "필요서류"],
    };
  },

  // 9. 대상별 분할 (대상이 여러 개인 경우)
  (p) => {
    const targets = split대상(p["대상"]);
    if (targets.length <= 1) return null;
    const rate = p["금리(%)"] ? fmt금리(p["금리(%)"]) : "";
    const limit = p["한도(만원)"] ? fmt한도(p["한도(만원)"]) : "";
    return targets.map((t) => ({
      slug: `${p.name}-${t}`,
      title: `${p.name} ${t} 신청 조건 | 금리 ${rate} 한도 ${limit}`,
      type: "대상",
      usedFields: ["name", "대상", "금리(%)", "한도(만원)"],
    }));
  },

  // 10. 신용점수 (있는 상품만)
  (p) => {
    if (!p["신용점수"]) return null;
    const rate = p["금리(%)"] ? fmt금리(p["금리(%)"]) : "";
    return {
      slug: `${p.name}-신용점수`,
      title: `${p.name} 신용점수 ${p["신용점수"]} | 금리 ${rate} 한도 ${fmt한도(p["한도(만원)"])}`,
      type: "신용점수",
      usedFields: ["name", "신용점수", "금리(%)", "한도(만원)"],
    };
  },

  // 11. 소득기준
  (p) => {
    if (!p["소득기준(만원)"]) return null;
    const income = p["소득기준(만원)"];
    const label = typeof income === "number" ? `${income}만원 이하` : income;
    const rate = p["금리(%)"] ? fmt금리(p["금리(%)"]) : "";
    return {
      slug: `${p.name}-소득기준`,
      title: `${p.name} 소득기준 ${label} | 금리 ${rate} 신청 자격`,
      type: "소득기준",
      usedFields: ["name", "소득기준(만원)", "금리(%)"],
    };
  },

  // 12. 취급기관
  (p) => {
    if (!p["취급기관"] || p["취급기관"].length === 0) return null;
    const all = p["취급기관"];
    const channel = p["상담채널"] || "";
    return {
      slug: `${p.name}-취급기관`,
      title: `${p.name} 취급기관 ${all.join(" ")} | ${channel} 신청 접수`,
      type: "취급기관",
      usedFields: ["name", "취급기관", "상담채널"],
    };
  },

  // 13. 상환방식
  (p) => {
    if (!p["상환방식"]) return null;
    const rate = p["금리(%)"] ? fmt금리(p["금리(%)"]) : "";
    const limit = p["한도(만원)"] ? fmt한도(p["한도(만원)"]) : "";
    const period = p["기간(년)"] ? `${p["기간(년)"]}년` : "";
    return {
      slug: `${p.name}-상환`,
      title: `${p.name} ${p["상환방식"].split("(")[0].trim()} | ${limit} ${rate} ${period} 월 상환액`,
      type: "상환방식",
      usedFields: ["name", "상환방식", "금리(%)", "한도(만원)", "기간(년)"],
    };
  },
];

// 상품간 비교 패턴
function generateComparisons(products) {
  const results = [];
  const names = Object.keys(products);

  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = products[names[i]];
      const b = products[names[j]];
      if (!a || !b) continue;

      const rateA = a["금리(%)"] ? fmt금리(a["금리(%)"]) : "";
      const rateB = b["금리(%)"] ? fmt금리(b["금리(%)"]) : "";
      const limitA = a["한도(만원)"] ? fmt한도(a["한도(만원)"]) : "";
      const limitB = b["한도(만원)"] ? fmt한도(b["한도(만원)"]) : "";
      results.push({
        slug: `${a.name}-vs-${b.name}`,
        title: `${a.name} vs ${b.name} 비교 | 금리 ${rateA} vs ${rateB} 한도 ${limitA} vs ${limitB}`,
        type: "비교",
        usedFields: ["금리(%)", "한도(만원)", "대상", "신용점수"],
        products: [a.name, b.name],
      });
    }
  }
  return results;
}

// 상위 키워드 패턴 (카테고리/일반 검색어)
function generateCategoryKeywords(products) {
  const results = [];

  const categoryKeywords = [
    { kw: "서민대출", sub: "정부지원 서민 대출상품 비교" },
    { kw: "서민금융", sub: "서민금융진흥원 대출 종류 총정리" },
    { kw: "정부지원 대출", sub: "2026년 정부지원 서민 대출 비교" },
    { kw: "저금리 대출", sub: "정부보증 저금리 대출상품 안내" },
    { kw: "저신용자 대출", sub: "신용점수 낮아도 가능한 대출" },
    { kw: "무직자 대출", sub: "소득 없어도 가능한 정부지원 대출" },
    { kw: "긴급 대출", sub: "위기 상황 긴급 소액 대출 안내" },
    { kw: "대환대출", sub: "고금리 대출 갈아타기 조건 방법" },
    { kw: "소액대출", sub: "100만원 소액 대출 신청 방법" },
    { kw: "청년 대출", sub: "만 19~34세 청년 정부지원 대출" },
  ];

  for (const { kw, sub } of categoryKeywords) {
    results.push({
      slug: kw,
      title: `${kw} 종류 조건 비교 | ${sub}`,
      type: "카테고리",
      usedFields: ["전체 상품 데이터"],
    });
  }

  return results;
}

function targetLabel(p) {
  const d = p["대상"] || "";
  if (d.includes("청년") || d.includes("대학생")) return "청년 대출";
  if (d.includes("저신용")) return "저신용자 대출";
  if (d.includes("중·저신용")) return "중금리 대출";
  if (d.includes("저소득")) return "서민 대출";
  if (d.includes("위기")) return "긴급 대출";
  return "서민 대출";
}

// ── 메인 ──

function run() {
  const sourceMap = JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"));
  const products = {};

  for (const slug of Object.keys(sourceMap)) {
    const data = loadProduct(slug);
    if (data) products[slug] = data;
  }

  const allKeywords = [];
  const seenSlugs = new Set();

  // 1. 상품별 패턴
  for (const [slug, product] of Object.entries(products)) {
    for (const patternFn of PATTERNS) {
      const result = patternFn(product);
      if (!result) continue;

      const items = Array.isArray(result) ? result : [result];
      for (const item of items) {
        if (!seenSlugs.has(item.slug)) {
          seenSlugs.add(item.slug);
          allKeywords.push({ ...item, sourceProduct: product.name });
        }
      }
    }
  }

  // 2. 상품간 비교
  const comparisons = generateComparisons(products);
  for (const item of comparisons) {
    if (!seenSlugs.has(item.slug)) {
      seenSlugs.add(item.slug);
      allKeywords.push(item);
    }
  }

  // 3. 카테고리 키워드
  const categoryKws = generateCategoryKeywords(products);
  for (const item of categoryKws) {
    if (!seenSlugs.has(item.slug)) {
      seenSlugs.add(item.slug);
      allKeywords.push(item);
    }
  }

  // 출력
  const isJson = process.argv.includes("--json");
  const isCount = process.argv.includes("--count");

  if (isCount) {
    const byType = {};
    for (const kw of allKeywords) {
      byType[kw.type] = (byType[kw.type] || 0) + 1;
    }
    console.log(`\n=== 롱테일 키워드 생성 결과 ===\n`);
    console.log(`총 ${allKeywords.length}개 키워드 (중복 제거 완료)\n`);
    for (const [type, count] of Object.entries(byType)) {
      console.log(`  ${type}: ${count}개`);
    }
    return;
  }

  if (isJson) {
    console.log(JSON.stringify(allKeywords, null, 2));
    return;
  }

  // 기본: 테이블 출력
  console.log(`\n=== 롱테일 키워드 생성 결과 ===\n`);
  console.log(`총 ${allKeywords.length}개 키워드 (중복 제거 완료)\n`);

  let currentType = "";
  for (const kw of allKeywords) {
    if (kw.type !== currentType) {
      currentType = kw.type;
      console.log(`\n── ${currentType} ──`);
    }
    const src = kw.sourceProduct || (kw.products ? kw.products.join(" vs ") : "전체");
    console.log(`  [${src}] ${kw.title}`);
    console.log(`    slug: ${kw.slug}`);
    console.log(`    사용 필드: ${kw.usedFields.join(", ")}`);
  }
}

run();
