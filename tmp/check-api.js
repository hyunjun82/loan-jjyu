const https = require("https");
const API_KEY = "cf7552de3d61cdff45c878062b431dd4578ca18c4487cd44f545477356f2947b";
const url = `https://apis.data.go.kr/1160100/service/GetSmallLoanFinanceInstituteInfoService/getOrdinaryFinanceInfo?serviceKey=${API_KEY}&resultType=json&numOfRows=200&pageNo=1`;

https.get(url, (res) => {
  let data = "";
  res.on("data", c => data += c);
  res.on("end", () => {
    const json = JSON.parse(data);
    const items = json.response.body.items.item;
    console.log("총 상품 수:", json.response.body.totalCount);
    console.log("이번 페이지:", items.length);
    console.log("");

    const cats = {};
    const instTypes = {};
    const names = new Set();
    for (const i of items) {
      cats[i.prdNm || i.prdCtg] = (cats[i.prdNm || i.prdCtg] || 0) + 1;
      instTypes[i.instCtg || "unknown"] = (instTypes[i.instCtg || "unknown"] || 0) + 1;
      names.add(i.finPrdNm);
    }
    console.log("=== 상품 유형 ===");
    for (const [k, v] of Object.entries(cats).sort((a,b) => b[1]-a[1])) console.log(k + ": " + v);
    console.log("");
    console.log("=== 취급기관 유형 ===");
    for (const [k, v] of Object.entries(instTypes).sort((a,b) => b[1]-a[1])) console.log(k + ": " + v);
    console.log("");
    console.log("=== 대출 상품명 (고유 목록) ===");
    [...names].forEach(n => console.log("- " + n));
  });
}).on("error", console.error);
