/**
 * apply-keywords.js — 롱테일 키워드를 article 파일에 자동 적용
 * 사용법:
 *   node scripts/apply-keywords.js              # 전체 적용
 *   node scripts/apply-keywords.js --dry-run    # 변경 예정 내역만 출력
 *   node scripts/apply-keywords.js 햇살론유스   # 특정 상품만
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run");
const FILTER = process.argv.slice(2).find(a => !a.startsWith("--"));

const FILES = {
  "햇살론유스": ["data/articles/haesallon-youth-spokes-1.ts"],
  "햇살론15":   ["data/articles/haesallon15-test.ts", "data/articles/haesallon15-spokes-1.ts"],
  "햇살론뱅크": ["data/articles/haesallon-bank-spokes-1.ts"],
  "미소금융":   ["data/articles/miso-spokes-1.ts"],
  "새희망홀씨": ["data/articles/saehope-spokes-1.ts"],
  "긴급생계자금": ["data/articles/emergency-spokes-1.ts"],
};

function loadCsv() {
  const csvFiles = fs.readdirSync(path.join(ROOT, "reports"))
    .filter(f => f.startsWith("keywords-") && f.endsWith(".csv"))
    .sort().reverse();
  if (!csvFiles.length) { console.error("❌ CSV 없음"); process.exit(1); }

  const csvPath = path.join(ROOT, "reports", csvFiles[0]);
  console.log(`📄 CSV: ${csvFiles[0]}`);

  const raw = fs.readFileSync(csvPath, "utf8");
  const map = {};

  for (const line of raw.split("\n").slice(1)) {
    if (!line.trim()) continue;
    // 간단 CSV 파싱 (따옴표 포함)
    const cols = [];
    let cur = "", inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur); cur = ""; }
      else { cur += ch; }
    }
    cols.push(cur);
    if (cols.length < 8) continue;
    const [product, slug, before, after, h1, h2, h3, h4] = cols;
    if (!map[product]) map[product] = {};
    map[product][slug] = {
      title: `${before} | ${after}`,
      h2: [h1.trim(), h2.trim(), h3.trim(), h4.trim()],
    };
  }
  return map;
}

function applyToFile(filePath, catMap) {
  const absPath = path.join(ROOT, filePath);
  if (!fs.existsSync(absPath)) { console.warn(`  ⚠️ 파일 없음: ${filePath}`); return 0; }

  let content = fs.readFileSync(absPath, "utf8");
  let applied = 0;
  const skipped = [];

  for (const [slug, kw] of Object.entries(catMap)) {
    // 해당 slug의 spoke 블록을 찾는다
    // 패턴: slug: "xxx",\n    categorySlug:
    // slug 필드가 정확히 일치하는 곳을 찾아야 함 (categorySlug와 구분)
    // ^\s+slug: "slug값", 형태
    const slugPattern = new RegExp(
      `(\\n\\s+slug:\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",)`,
      "g"
    );

    let m;
    while ((m = slugPattern.exec(content)) !== null) {
      const slugStart = m.index;

      // 이 slug 앞에 categorySlug가 없어야 진짜 slug 필드
      // (categorySlug 필드에도 "slug:" 텍스트가 들어있음)
      const lineStart = content.lastIndexOf("\n", slugStart - 1);
      const preceding = content.slice(lineStart, slugStart + m[0].length);
      if (preceding.includes("categorySlug")) continue;

      // spoke 블록 끝 찾기: 다음 slug: 또는 파일 끝
      const nextSlugIdx = content.indexOf('\n    slug:', slugStart + m[0].length);
      const blockEnd = nextSlugIdx === -1 ? content.length : nextSlugIdx;
      const block = content.slice(slugStart, blockEnd);

      // ── title 교체 (첫 번째 title 필드 = spoke 타이틀) ──
      let newBlock = block.replace(
        /^([\s\S]*?\n\s+title:\s*)"[^"]*"/,
        `$1"${kw.title}"`
      );

      // ── h1 교체 ──
      newBlock = newBlock.replace(
        /(\n\s+h1:\s*)"[^"]*"/,
        `$1"${kw.title}"`
      );

      // ── 섹션 title 4개 교체 (sections: 이후) ──
      const secIdx = newBlock.indexOf("sections:");
      if (secIdx !== -1) {
        let before2 = newBlock.slice(0, secIdx);
        let secPart = newBlock.slice(secIdx);
        let count = 0;
        secPart = secPart.replace(/(\n\s+title:\s*)"([^"]*)"/g, (full, prefix, old) => {
          if (count < 4) {
            const newTitle = kw.h2[count++];
            return `${prefix}"${newTitle}"`;
          }
          return full;
        });
        newBlock = before2 + secPart;
      }

      if (newBlock !== block) {
        content = content.slice(0, slugStart) + newBlock + content.slice(blockEnd);
        applied++;
        // 다음 검색 위치 재조정
        slugPattern.lastIndex = slugStart + newBlock.length;
      }
    }

    if (!content.match(new RegExp(`slug:\\s*"${slug}"`))) {
      skipped.push(slug);
    }
  }

  const baseName = path.basename(filePath);
  if (applied > 0) {
    if (!DRY_RUN) fs.writeFileSync(absPath, content, "utf8");
    console.log(`  ✅ ${baseName}: ${applied}개 spoke 교체${DRY_RUN ? " [dry]" : ""}`);
  } else {
    console.log(`  ℹ️  ${baseName}: 변경 없음`);
  }

  if (skipped.length) {
    console.log(`     ⚠️ slug 없음 (키워드 정의만 있고 파일에 없음): ${skipped.join(", ")}`);
  }

  return applied;
}

// ── main ──────────────────────────────────────────────────────
const keywordMap = loadCsv();
let total = 0;

console.log(`\n${DRY_RUN ? "[DRY-RUN] " : ""}키워드 적용 시작\n`);

for (const [cat, files] of Object.entries(FILES)) {
  if (FILTER && !cat.includes(FILTER)) continue;
  const catMap = keywordMap[cat] || {};
  console.log(`▶ ${cat} (키워드 ${Object.keys(catMap).length}개)`);
  for (const f of files) {
    total += applyToFile(f, catMap);
  }
}

console.log(`\n✅ 완료: 총 ${total}개 spoke 교체`);
