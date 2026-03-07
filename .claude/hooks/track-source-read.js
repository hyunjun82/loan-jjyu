#!/usr/bin/env node
/**
 * Hook: source-data 파일 읽기 추적
 * 글 작성 전 출처 데이터를 확인했는지 로그 기록
 */
const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, ".source-reads.log");

function logRead(filePath) {
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} READ ${filePath}\n`;
  fs.appendFileSync(LOG_PATH, entry);
}

function getRecentReads(minutes = 30) {
  if (!fs.existsSync(LOG_PATH)) return [];
  const lines = fs.readFileSync(LOG_PATH, "utf-8").trim().split("\n").filter(Boolean);
  const cutoff = Date.now() - minutes * 60 * 1000;
  return lines.filter((line) => {
    const ts = new Date(line.split(" ")[0]).getTime();
    return ts > cutoff;
  });
}

function hasReadSource(slug, minutes = 30) {
  const reads = getRecentReads(minutes);
  return reads.some((r) => r.includes(slug));
}

// CLI
if (require.main === module) {
  const action = process.argv[2];
  const target = process.argv[3];

  if (action === "log" && target) {
    logRead(target);
    console.log(`📋 출처 읽기 기록: ${target}`);
  } else if (action === "check" && target) {
    const read = hasReadSource(target);
    console.log(read ? `✅ ${target} 출처 확인됨` : `⚠ ${target} 출처 미확인`);
    process.exit(read ? 0 : 1);
  } else {
    console.log("사용법: track-source-read.js [log|check] <slug>");
  }
}

module.exports = { logRead, hasReadSource, getRecentReads };
