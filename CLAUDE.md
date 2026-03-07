# loan-jjyu 프로젝트 가이드

## 프로젝트 개요
서민금융 대출상품 정보 위키 사이트. 정부지원 대출(햇살론, 미소금융, 새희망홀씨 등)의 정확한 정보를 구어체로 제공한다.

## 글쓰기 규칙

### 문체
- **구어체** 사용 (해요체): "~에요", "~이에요", "~거예요", "~돼요"
- **문어체 금지**: "~합니다", "~입니다", "~됩니다" 절대 사용하지 않는다
- **AI냄새 금지**: "살펴보겠습니다", "알아보겠습니다", "여러분", "핵심 포인트" 등 사용 금지
- Em dash (—) 사용 금지
- 같은 어미 3회 이상 연속 반복 금지

### 글 구조 (spoke 기준)
- **title**: "상품명 신청자격 금리 한도 | 부제" 형식
- **h1**: title과 동일하거나 대응
- **FAQ**: 정확히 3개
- **sections**: 6개 섹션
  1. {slug} 상품 개요
  2. {slug} 신청자격
  3. {slug} 금리 및 한도
  4. {slug} 신청방법
  5. {slug} 필요서류
  6. {slug} 주의사항
- 각 섹션은 최소 3문단 (\\n\\n으로 구분)

### 숫자/팩트 규칙
- 금리, 한도, 기간, 연령제한 등 숫자는 반드시 출처 데이터(`source-data/`)와 일치해야 한다
- 출처 없는 숫자를 임의로 생성하지 않는다
- 출처: 금융위원회, 서민금융진흥원, 한국주택금융공사 등 공공기관 데이터

## 글 작성 절차

1. **출처 확인**: `source-data/{slug}.json` 읽기 → hook이 자동 기록
2. **글 작성**: `data/articles/{카테고리}.ts`에 spoke 추가
3. **검증 실행**: `node scripts/verify-all.js`로 4층 검증
   - L1 Source Gate: 출처 JSON 존재/스키마/신선도
   - L2 Fact Gate: 글 숫자 ↔ 출처 교차검증
   - L3 Style Gate: AI냄새/문어체/어미반복
   - L4 Self-Check Gate: 부정-긍정 충돌/금리범위/한도 모순
4. **푸시 전**: `node scripts/verify-wiki-quality.js`가 자동으로 변경 파일 검사

## 출처 데이터 관리

- `source-data/source-map.json`: 상품별 출처 매핑
- `source-data/{slug}.json`: 개별 상품 출처 데이터
- `source-data/schema.json`: 출처 데이터 스키마
- `node scripts/fetch-source.js`: 공공데이터 API에서 수집 (DATA_GO_KR_KEY 환경변수 필요)

## 카테고리
- 대출상품, 자산형성, 사회적금융, 보증보험, 신용채무

## 주요 명령어
```bash
node scripts/verify-all.js          # 4층 전체 검증
node scripts/verify-source.js       # L1 출처 검증
node scripts/verify-facts.js        # L2 팩트 교차검증
node scripts/verify-style.js        # L3 문체 검증
node scripts/verify-selfcheck.js    # L4 자기검증
node scripts/verify-wiki-quality.js # push 전 빠른 검사
node scripts/fetch-source.js        # 출처 데이터 수집
```
