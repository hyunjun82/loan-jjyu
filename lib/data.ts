export interface Product {
  id: string
  name: string
  category: string
  institution: string
  description: string
  target: string
  rate: string
  limit: string
  period: string
  howToApply: string
  features: string[]
  tags: string[]
}

export interface Guide {
  id: string
  title: string
  summary: string
  category: string
  content: string
  tags: string[]
}

export interface Category {
  name: string
  slug: string
  description: string
  color: string
  bgColor: string
  iconBg: string
}

export const CATEGORIES: Category[] = [
  {
    name: "대출상품",
    slug: "loan",
    description: "서민·저신용자를 위한 정부지원 대출",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    name: "자산형성",
    slug: "asset",
    description: "저소득층 자산 형성 지원 프로그램",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    name: "사회적금융",
    slug: "social",
    description: "사회적 경제 조직 대상 금융지원",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    iconBg: "bg-violet-100",
  },
  {
    name: "보증/보험",
    slug: "guarantee",
    description: "신용보증 및 보험 지원 상품",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-100",
  },
  {
    name: "신용/채무",
    slug: "credit",
    description: "신용회복 및 채무조정 프로그램",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
]

export const PRODUCTS: Product[] = [
  // 대출상품
  {
    id: "haesallon-youth",
    name: "햇살론유스",
    category: "loan",
    institution: "서민금융진흥원",
    description: "대학생·청년을 위한 저금리 생활자금 대출. 취업준비생, 사회초년생 등 소득이 부족한 청년층의 경제적 자립을 지원합니다.",
    target: "만 19~34세 대학생, 취업준비생, 사회초년생 (연소득 3,500만원 이하 또는 중위소득 100% 이하)",
    rate: "연 3.5%~4.5%",
    limit: "최대 1,200만원 (학자금 900만원 + 생활자금 300만원)",
    period: "최대 15년 (거치기간 포함)",
    howToApply: "서민금융진흥원 콜센터(1397) 또는 온라인 신청",
    features: ["저금리 정부지원 대출", "재학 중 이자 면제 가능", "취업 후 소득연동 상환"],
    tags: ["청년", "대학생", "생활자금"],
  },
  {
    id: "haesallon15",
    name: "햇살론15",
    category: "loan",
    institution: "서민금융진흥원",
    description: "저신용·저소득 서민을 위한 보증부 대출. 제도권 금융 이용이 어려운 분들에게 연 15% 이내의 금리로 자금을 지원합니다.",
    target: "연소득 3,500만원 이하, 신용점수 하위 20% 이하 (개인신용평점 744점 이하)",
    rate: "연 15.9% 이내",
    limit: "최대 700만원 (생활자금 600만원 + 긴급자금 100만원)",
    period: "3년 또는 5년",
    howToApply: "서민금융통합지원센터 방문 또는 1397 전화상담",
    features: ["고금리 대출 대안", "신용등급 낮아도 신청 가능", "소득증빙 간소화"],
    tags: ["저신용", "서민", "긴급자금"],
  },
  {
    id: "haesallon-bank",
    name: "햇살론뱅크",
    category: "loan",
    institution: "저축은행 등",
    description: "중·저신용자를 위한 중금리 대출. 은행권 대출이 어렵지만 고금리 대출까지는 필요하지 않은 분들을 위한 상품입니다.",
    target: "연소득 4,500만원 이하, 신용점수 하위 20%~50% (개인신용평점 745~919점)",
    rate: "연 6%~10.5%",
    limit: "최대 2,000만원",
    period: "최대 5년",
    howToApply: "저축은행, 상호금융 등 취급기관 방문 또는 모바일 앱",
    features: ["중금리 대출", "기존 고금리 대출 대환 가능", "신용점수 개선 효과"],
    tags: ["중금리", "대환", "저축은행"],
  },
  {
    id: "miso-loan",
    name: "미소금융",
    category: "loan",
    institution: "서민금융진흥원",
    description: "저소득·저신용 계층의 자립을 위한 무담보·무보증 소액대출. 창업자금, 운영자금, 긴급생계자금 등을 지원합니다.",
    target: "기초생활수급자, 차상위계층, 저신용자 등",
    rate: "연 2%~4.5%",
    limit: "최대 7,000만원 (창업) / 2,000만원 (운영) / 100만원 (긴급)",
    period: "최대 6년 (거치기간 1년 포함)",
    howToApply: "미소금융 지점 또는 서민금융통합지원센터 방문",
    features: ["무담보·무보증", "초저금리", "창업·운영자금 동시 지원"],
    tags: ["소액대출", "창업", "기초생활"],
  },
  {
    id: "saehope-holssi",
    name: "새희망홀씨",
    category: "loan",
    institution: "시중은행",
    description: "저소득·저신용 근로자를 위한 은행권 서민대출. 연소득이 낮거나 신용점수가 낮은 분들도 은행에서 대출받을 수 있습니다.",
    target: "연소득 3,500만원 이하 또는 신용점수 하위 20% 이하",
    rate: "연 7%~10.5%",
    limit: "최대 3,000만원",
    period: "최대 5년",
    howToApply: "시중은행 영업점 방문 또는 인터넷/모바일 뱅킹",
    features: ["은행권 대출", "신용회복 지원 연계", "분할상환"],
    tags: ["은행", "근로자", "서민대출"],
  },
  {
    id: "emergency-loan",
    name: "긴급생계자금",
    category: "loan",
    institution: "서민금융진흥원",
    description: "갑작스러운 위기 상황에 처한 서민을 위한 긴급 소액 대출. 의료비, 실직 등 긴급한 생계 문제 해결을 지원합니다.",
    target: "긴급한 생계 곤란 사유 발생자 (연소득 2,200만원 이하)",
    rate: "연 3% 이내",
    limit: "최대 100만원",
    period: "최대 2년",
    howToApply: "서민금융통합지원센터 방문 (사유 증빙 필요)",
    features: ["초저금리", "신속 지급", "긴급 상황 전용"],
    tags: ["긴급", "생계", "소액"],
  },
  // 자산형성
  {
    id: "hope-two-savings",
    name: "희망두배청년통장",
    category: "asset",
    institution: "지자체 (서울시 등)",
    description: "일하는 청년이 매월 저축하면 정부가 같은 금액을 매칭해 주는 자산형성 지원 프로그램입니다.",
    target: "만 18~34세 근로청년 (기준중위소득 100% 이하)",
    rate: "본인 저축액의 100% 매칭",
    limit: "월 15만원 저축 시 정부 매칭 15만원",
    period: "3년 만기",
    howToApply: "각 지자체 복지 포털 또는 주민센터",
    features: ["정부 매칭 저축", "최대 2배 자산형성", "금융교육 연계"],
    tags: ["청년", "저축", "매칭"],
  },
  {
    id: "ido-savings",
    name: "내일키움통장 (IDA)",
    category: "asset",
    institution: "보건복지부",
    description: "자활근로 참여자를 위한 자산형성 프로그램. 매월 저축하면 정부가 매칭 적립금을 지원합니다.",
    target: "자활근로 참여자 (조건부 수급자, 차상위 등)",
    rate: "본인 저축액 대비 1:1~1:3 매칭",
    limit: "월 5만원~20만원 저축",
    period: "3년 만기",
    howToApply: "지역자활센터 문의 및 신청",
    features: ["자활 연계", "정부 매칭 적립", "자립 지원"],
    tags: ["자활", "저축", "매칭"],
  },
  // 사회적금융
  {
    id: "social-enterprise-loan",
    name: "사회적기업 대출",
    category: "social",
    institution: "서민금융진흥원",
    description: "사회적기업, 협동조합 등 사회적경제 조직의 운영자금 및 시설자금을 저금리로 지원합니다.",
    target: "인증 사회적기업, 사회적협동조합, 마을기업 등",
    rate: "연 2%~3%",
    limit: "최대 5억원",
    period: "최대 8년 (거치기간 3년 포함)",
    howToApply: "서민금융진흥원 사회적금융팀 접수",
    features: ["초저금리", "운영·시설자금", "사회적 가치 평가 반영"],
    tags: ["사회적기업", "협동조합", "운영자금"],
  },
  // 보증/보험
  {
    id: "credit-guarantee",
    name: "서민금융 신용보증",
    category: "guarantee",
    institution: "신용보증기금 / 기술보증기금",
    description: "담보력이 부족한 서민·소상공인에게 신용보증서를 발급하여 금융기관 대출을 지원합니다.",
    target: "소상공인, 영세자영업자",
    rate: "보증료 연 0.5%~1.5%",
    limit: "최대 2억원",
    period: "1년 (갱신 가능)",
    howToApply: "신용보증기금 또는 기술보증기금 지점 방문",
    features: ["담보 없이 보증서 발급", "금융기관 대출 연계", "갱신 가능"],
    tags: ["소상공인", "보증", "담보"],
  },
  {
    id: "miso-insurance",
    name: "미소보험",
    category: "guarantee",
    institution: "서민금융진흥원",
    description: "저소득층이 보험료 부담 없이 질병, 상해 등의 위험에 대비할 수 있는 무료 보험 상품입니다.",
    target: "기초생활수급자, 차상위계층, 한부모가족 등",
    rate: "무료 (보험료 전액 지원)",
    limit: "상해사망 최대 1,000만원, 질병입원 일당 3만원",
    period: "1년 (갱신 가능)",
    howToApply: "서민금융진흥원 홈페이지 또는 1397",
    features: ["보험료 무료", "질병·상해 보장", "자동갱신"],
    tags: ["무료보험", "저소득", "보장"],
  },
  // 신용/채무
  {
    id: "credit-recovery",
    name: "신용회복지원",
    category: "credit",
    institution: "신용회복위원회",
    description: "과다채무로 어려움을 겪는 분들의 채무 조정 및 신용 회복을 돕는 프로그램입니다.",
    target: "3개월 이상 연체 중인 채무자",
    rate: "이자율 조정 (최저 연 1%)",
    limit: "채무감면 최대 70%",
    period: "최대 10년 분할상환",
    howToApply: "신용회복위원회 방문 또는 1600-5500",
    features: ["이자감면", "원금감면", "장기분할상환"],
    tags: ["채무조정", "연체", "신용회복"],
  },
  {
    id: "personal-recovery",
    name: "개인회생",
    category: "credit",
    institution: "법원",
    description: "정기적 소득이 있는 채무자가 법원의 인가를 받아 채무를 조정받는 법적 절차입니다.",
    target: "정기적 소득이 있는 과다채무자 (무담보채무 10억원 이하, 담보채무 15억원 이하)",
    rate: "채무의 상당 부분 면제",
    limit: "가용소득 범위 내 변제",
    period: "3~5년 변제기간",
    howToApply: "관할 지방법원 신청 (법률구조공단 무료 상담 가능)",
    features: ["법적 채무조정", "이자 정지", "면책 가능"],
    tags: ["개인회생", "법원", "채무면제"],
  },
]

export const GUIDES: Guide[] = [
  {
    id: "guide-haesallon",
    title: "햇살론 종류와 신청 방법 총정리",
    summary: "햇살론유스, 햇살론15, 햇살론뱅크의 차이점과 나에게 맞는 상품을 찾는 방법을 안내합니다.",
    category: "loan",
    content: `## 햇살론이란?

햇살론은 제도권 금융 이용이 어려운 서민·저신용자를 위한 정부 보증 대출 상품입니다. 서민금융진흥원이 보증을 제공하고, 은행·저축은행 등 금융기관에서 실제 대출을 실행합니다.

## 햇살론 종류 비교

### 1. 햇살론유스
- **대상**: 만 19~34세 대학생, 취업준비생, 사회초년생
- **금리**: 연 3.5%~4.5%
- **한도**: 최대 1,200만원
- **특징**: 재학 중 이자 면제, 취업 후 소득연동 상환

### 2. 햇살론15
- **대상**: 연소득 3,500만원 이하, 신용점수 하위 20%
- **금리**: 연 15.9% 이내
- **한도**: 최대 700만원
- **특징**: 고금리 대출 대안, 신용등급 낮아도 가능

### 3. 햇살론뱅크
- **대상**: 연소득 4,500만원 이하, 신용점수 하위 20%~50%
- **금리**: 연 6%~10.5%
- **한도**: 최대 2,000만원
- **특징**: 중금리 대출, 기존 고금리 대출 대환 가능

## 어떤 햇살론이 나에게 맞을까?

1. **청년(34세 이하)이라면** → 햇살론유스가 가장 유리합니다
2. **신용점수가 매우 낮다면** → 햇살론15로 급한 자금을 마련하세요
3. **고금리 대출을 이미 쓰고 있다면** → 햇살론뱅크로 대환을 고려하세요

## 신청 방법

1. **서민금융진흥원 콜센터**: 1397 (평일 9:00~18:00)
2. **서민금융통합지원센터**: 전국 48개소 방문 상담
3. **온라인**: 서민금융진흥원 홈페이지에서 사전 신청`,
    tags: ["햇살론", "신청방법", "비교"],
  },
  {
    id: "guide-low-credit",
    title: "신용점수 낮을 때 대출받는 방법",
    summary: "신용점수가 낮아 대출이 어려운 분들을 위한 실질적인 대안과 단계별 가이드입니다.",
    category: "loan",
    content: `## 신용점수가 낮으면 대출이 불가능할까?

신용점수가 낮다고 대출이 완전히 불가능한 것은 아닙니다. 정부 지원 서민금융 상품을 활용하면 합리적인 금리로 대출을 받을 수 있습니다.

## 신용점수별 이용 가능한 서민금융 상품

### 신용점수 600점 이하
- **미소금융**: 무담보·무보증 소액대출 (연 2%~4.5%)
- **햇살론15**: 서민금융진흥원 보증 대출 (연 15.9% 이내)
- **긴급생계자금**: 위기 상황 시 소액 지원 (연 3% 이내)

### 신용점수 600~744점
- **햇살론15**: 최대 700만원
- **새희망홀씨**: 시중은행 서민대출 (연 7%~10.5%)

### 신용점수 745~919점
- **햇살론뱅크**: 중금리 대출 (연 6%~10.5%)
- **새희망홀씨**: 시중은행 서민대출

## 절대 하지 말아야 할 것

1. **불법 사금융 이용 금지**: 연 20% 초과 금리는 불법입니다
2. **대출 모집인 주의**: 수수료를 요구하는 대출 중개는 불법입니다
3. **다중 채무 주의**: 여러 곳에서 동시 대출 시 신용점수 하락

## 신용점수 올리는 방법

1. 통신비, 공과금 등 정기 납부 내역을 신용정보에 등록
2. 소액이라도 대출 후 성실히 상환
3. 체크카드 꾸준히 사용 (월 30만원 이상)
4. 연체 즉시 해소 (1영업일이라도 빠르게)`,
    tags: ["저신용", "대출", "신용점수"],
  },
  {
    id: "guide-debt-relief",
    title: "채무조정 제도 완벽 가이드",
    summary: "신용회복지원, 개인회생, 파산 면책 등 과다채무 해결 방법을 단계별로 안내합니다.",
    category: "credit",
    content: `## 빚이 감당이 안 될 때, 어떤 방법이 있을까?

과다 채무로 힘든 상황이라면, 국가에서 운영하는 채무조정 제도를 활용할 수 있습니다. 상황에 따라 적절한 제도를 선택하는 것이 중요합니다.

## 채무조정 제도 비교

### 1. 신용회복지원 (사적 워크아웃)
- **운영기관**: 신용회복위원회
- **대상**: 3개월 이상 연체 채무자
- **혜택**: 이자감면, 원금 최대 70% 감면, 최대 10년 분할상환
- **장점**: 절차가 간단하고 빠름
- **단점**: 채권자 동의 필요

### 2. 개인회생
- **운영기관**: 법원
- **대상**: 정기소득자, 무담보채무 10억 이하
- **혜택**: 3~5년 변제 후 나머지 채무 면제
- **장점**: 채권자 동의 불필요, 강제력 있음
- **단점**: 법원 절차로 시간 소요

### 3. 개인파산·면책
- **운영기관**: 법원
- **대상**: 소득이 없거나 매우 적은 채무자
- **혜택**: 채무 전액 면제 가능
- **장점**: 완전한 새 출발 가능
- **단점**: 재산 처분, 자격 제한

## 어떤 제도를 선택해야 할까?

1. **연체 중이지만 소득이 있다면** → 신용회복지원부터 시도
2. **신용회복지원이 안 되면** → 개인회생 신청
3. **소득이 없고 갚을 능력이 없다면** → 개인파산·면책 검토

## 무료 상담 안내

- **신용회복위원회**: 1600-5500
- **대한법률구조공단**: 132
- **서민금융진흥원**: 1397`,
    tags: ["채무조정", "신용회복", "개인회생"],
  },
  {
    id: "guide-youth-finance",
    title: "청년을 위한 금융지원 총정리",
    summary: "청년 대출, 저축 지원, 주거 지원까지 청년이 활용할 수 있는 금융 제도를 모았습니다.",
    category: "asset",
    content: `## 청년이 활용할 수 있는 금융지원

사회에 첫발을 내딛는 청년들을 위한 다양한 금융지원 제도가 있습니다. 대출, 저축, 주거 등 분야별로 정리했습니다.

## 대출 지원

### 햇살론유스
- **대상**: 만 19~34세 대학생, 취업준비생, 사회초년생
- **금리**: 연 3.5%~4.5%
- **한도**: 학자금 900만원 + 생활자금 300만원
- 재학 중 이자 면제 가능

## 자산형성 지원

### 청년내일저축계좌
- **대상**: 기준중위소득 100% 이하 만 19~34세 근로청년
- **지원**: 본인 월 10만원 저축 시 정부 월 30만원 매칭
- **만기**: 3년 후 최대 1,440만원 수령

### 희망두배청년통장
- **대상**: 서울 거주 만 18~34세 근로청년
- **지원**: 본인 저축액 100% 매칭
- **만기**: 3년

## 주거 지원

### 청년전용 버팀목 전세대출
- **대상**: 만 19~34세, 연소득 5,000만원 이하
- **금리**: 연 1.5%~2.1%
- **한도**: 최대 2억원

## 신청 팁

1. **복지로**(bokjiro.go.kr)에서 본인이 해당하는 제도 확인
2. 소득 기준은 건강보험료 납부액으로 간편 확인 가능
3. 신청 기간을 놓치지 않도록 알림 설정`,
    tags: ["청년", "금융지원", "저축"],
  },
  {
    id: "guide-small-business",
    title: "소상공인·자영업자 대출 가이드",
    summary: "소상공인과 자영업자가 활용할 수 있는 정부지원 대출과 보증 제도를 소개합니다.",
    category: "guarantee",
    content: `## 소상공인을 위한 금융지원

매출 감소, 운영자금 부족 등으로 어려운 소상공인·자영업자를 위한 정부지원 금융 제도를 정리했습니다.

## 대출 상품

### 미소금융 창업/운영자금
- **대상**: 저소득·저신용 소상공인
- **금리**: 연 2%~4.5%
- **한도**: 창업 최대 7,000만원, 운영 최대 2,000만원
- 무담보·무보증

### 소상공인 정책자금
- **대상**: 소상공인확인서 발급 가능 사업자
- **금리**: 연 2%~3.4%
- **한도**: 최대 7,000만원
- 소상공인시장진흥공단 운영

## 보증 제도

### 신용보증기금 소상공인 보증
- **보증한도**: 최대 2억원
- **보증료**: 연 0.5%~1.5%
- 담보 없이 보증서로 은행 대출 가능

### 지역신용보증재단
- **보증한도**: 최대 8,000만원
- **보증료**: 연 0.5%~1%
- 지역 소상공인 우대

## 신청 순서

1. **소상공인확인서** 발급 (소상공인시장진흥공단)
2. **사업자등록증** 및 소득 증빙 서류 준비
3. 해당 기관 방문 또는 온라인 신청
4. 심사 후 대출 실행

## 주의사항

- 사업자등록 후 일정 기간 경과 필요 (보통 3개월~1년)
- 업종에 따라 제한이 있을 수 있음 (유흥업 등 제외)
- 기존 정부지원 대출과 중복 여부 확인`,
    tags: ["소상공인", "자영업", "창업"],
  },
]

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category)
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getGuidesByCategory(category: string): Guide[] {
  return GUIDES.filter((g) => g.category === category)
}

export function getGuideById(id: string): Guide | undefined {
  return GUIDES.find((g) => g.id === id)
}

export function searchAll(query: string): { products: Product[]; guides: Guide[] } {
  const q = query.toLowerCase()
  return {
    products: PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.target.toLowerCase().includes(q)
    ),
    guides: GUIDES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.tags.some((t) => t.includes(q))
    ),
  }
}
