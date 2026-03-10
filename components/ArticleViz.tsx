"use client";

import {
  StatCard,
  ComparisonTable,
  Calculator,
  EligibilityChecker,
  ProcessTimeline,
  AccordionChecklist,
  ContactCard,
  WarningBox,
  RangeTable,
  DecisionTree,
} from "@/components/viz";

type VizPosition = "top" | `after-${number}`;

/* ───────────────────────────────────────────
   키 규칙:  "카테고리/spoke"  →  spoke 전용
             "카테고리"        →  fallback (spoke 키 없을 때)
   ─────────────────────────────────────────── */

const VIZ_MAP: Record<string, Partial<Record<VizPosition, React.ReactNode>>> = {

  /* ══════════════════════════════════════════
     햇살론유스 — spoke별 시각화
     ══════════════════════════════════════════ */

  // 신청조건 (자격확인형)
  "햇살론유스/신청조건": {
    top: (
      <StatCard
        items={[
          { value: "19~34세", label: "나이 조건", sub: "신청일 기준 만 나이" },
          { value: "3,500만", label: "소득 상한", sub: "연소득 기준" },
          { value: "제한 없음", label: "신용점수", sub: "점수 무관" },
          { value: "청년 전용", label: "대상", sub: "대학생·취준생·초년생" },
        ]}
      />
    ),
    "after-0": (
      <EligibilityChecker
        questions={[
          { question: "만 19세 이상 34세 이하인가요?", helpText: "신청일 기준" },
          { question: "연소득 3,500만원 이하인가요?", helpText: "기준중위소득 100% 이하도 가능" },
          { question: "대학생, 취업준비생, 또는 사회초년생인가요?" },
          { question: "신용정보에 연체 기록이 없나요?" },
          { question: "현재 신용회복지원을 받고 있지 않나요?" },
        ]}
        passMessage="햇살론유스 신청 자격이 있어요!"
        failMessage="일부 조건이 충족되지 않았어요. 다른 상품을 검토해 보세요."
      />
    ),
  },

  // 금리조건 (비용계산형)
  "햇살론유스/금리조건": {
    top: (
      <StatCard
        items={[
          { value: "3.5%", label: "고정금리", sub: "취업준비생 기준" },
          { value: "4.5%", label: "사회초년생", sub: "중소기업 재직자" },
          { value: "15년", label: "상환 기간", sub: "거치기간 포함" },
          { value: "고정", label: "금리 유형", sub: "변동 없음" },
        ]}
      />
    ),
    "after-1": (
      <ComparisonTable
        title="유형별 금리 비교"
        columns={[
          { name: "취업준비생", highlight: true },
          { name: "사회초년생" },
          { name: "대학(원)생" },
        ]}
        rows={[
          { label: "금리", values: ["연 3.5%", "연 4.5%", "연 3.5%"] },
          { label: "거치기간", values: ["최대 2년", "최대 1년", "재학 중"] },
          { label: "한도", values: ["1,200만원", "1,200만원", "등록금+생활비"] },
        ]}
      />
    ),
  },

  // 대출한도 (비용계산형)
  "햇살론유스/대출한도": {
    top: (
      <StatCard
        items={[
          { value: "1,200만", label: "최대 한도", sub: "학자금+생활자금 합산" },
          { value: "등록금", label: "학자금", sub: "등록금 실비" },
          { value: "200만", label: "생활자금", sub: "학기당 최대" },
          { value: "누적 관리", label: "한도 차감", sub: "기존 잔액 합산" },
        ]}
      />
    ),
    "after-2": (
      <Calculator
        title="햇살론유스 월 상환액 계산기"
        description="대출 금액과 금리를 입력하면 월 상환액을 계산해 드려요."
        fields={[
          { key: "amount", label: "대출 금액", placeholder: "1200", unit: "만원", defaultValue: "1200" },
          { key: "rate", label: "금리", placeholder: "3.5", unit: "%", defaultValue: "3.5" },
          { key: "years", label: "상환 기간", placeholder: "15", unit: "년", defaultValue: "15" },
        ]}
        results={[
          {
            label: "월 상환액",
            formula: (v) => {
              const p = (v.amount as number) * 10000;
              const r = (v.rate as number) / 100 / 12;
              const n = (v.years as number) * 12;
              if (!p || !r || !n) return "\u2014";
              const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
              return `${Math.round(m).toLocaleString()}원`;
            },
            highlight: true,
          },
          {
            label: "총 상환액",
            formula: (v) => {
              const p = (v.amount as number) * 10000;
              const r = (v.rate as number) / 100 / 12;
              const n = (v.years as number) * 12;
              if (!p || !r || !n) return "\u2014";
              const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
              return `${Math.round(m * n).toLocaleString()}원`;
            },
          },
          {
            label: "총 이자",
            formula: (v) => {
              const p = (v.amount as number) * 10000;
              const r = (v.rate as number) / 100 / 12;
              const n = (v.years as number) * 12;
              if (!p || !r || !n) return "\u2014";
              const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
              return `${Math.round(m * n - p).toLocaleString()}원`;
            },
          },
        ]}
      />
    ),
  },

  // 나이제한 (문제해결형)
  "햇살론유스/나이제한": {
    top: (
      <StatCard
        items={[
          { value: "34세", label: "상한 나이", sub: "만 나이 기준" },
          { value: "19세", label: "하한 나이", sub: "성인만 가능" },
          { value: "신청일", label: "기준 시점", sub: "생일 전 신청 가능" },
          { value: "대안 있음", label: "초과 시", sub: "햇살론뱅크 등" },
        ]}
      />
    ),
    "after-1": (
      <DecisionTree
        title="나이 초과 시 대체 상품 찾기"
        nodes={[
          {
            id: "age",
            question: "현재 만 나이가 몇 세인가요?",
            options: [
              { label: "만 34세 이하", resultTitle: "햇살론유스 신청 가능", resultDesc: "신청일 기준 만 34세 이하면 신청할 수 있어요." },
              { label: "만 35세 이상", nextId: "income" },
            ],
          },
          {
            id: "income",
            question: "연소득이 얼마인가요?",
            options: [
              { label: "3,500만원 이하", resultTitle: "햇살론15 검토", resultDesc: "소득 기준을 충족해요. 신용점수에 따라 햇살론15를 신청할 수 있어요.", resultLink: "/햇살론15/신청조건" },
              { label: "3,500만~4,500만원", resultTitle: "햇살론뱅크 검토", resultDesc: "중간 소득 구간이에요. 햇살론뱅크가 적합할 수 있어요." },
              { label: "4,500만원 초과", resultTitle: "새희망홀씨 또는 일반 대출", resultDesc: "서민금융 소득 기준을 초과해요. 새희망홀씨나 시중은행 대출을 검토하세요." },
            ],
          },
        ]}
      />
    ),
  },

  // 신청방법 (절차확인형)
  "햇살론유스/신청방법": {
    top: (
      <ProcessTimeline
        steps={[
          { step: "1", title: "서금원 앱 설치", desc: "'서민금융 잇다' 앱 다운로드 후 본인인증" },
          { step: "2", title: "보증 신청", desc: "앱에서 햇살론유스 보증 신청 접수" },
          { step: "3", title: "서류 제출", desc: "신분증, 소득증빙, 재학증명서 등 업로드" },
          { step: "4", title: "심사 (3~5일)", desc: "접수 후 3~5영업일 내 심사 결과 통보" },
          { step: "5", title: "대출 실행", desc: "보증서 발급 → 협약은행에서 대출금 입금" },
        ]}
      />
    ),
    "after-2": (
      <AccordionChecklist
        groups={[
          {
            title: "기본 서류",
            items: ["신분증 (주민등록증 또는 운전면허증)", "주민등록등본 (3개월 이내)", "소득증빙서류"],
          },
          {
            title: "학자금 신청 시 추가",
            items: ["재학증명서", "등록금 납부 고지서", "성적증명서 (신입생/복학 첫 학기 면제)"],
          },
          {
            title: "생활자금 신청 시 추가",
            items: ["졸업증명서 또는 취업 관련 서류"],
          },
        ]}
      />
    ),
  },

  // 부결재신청 (문제해결형)
  "햇살론유스/부결재신청": {
    top: (
      <StatCard
        items={[
          { value: "3가지", label: "주요 부결 사유", sub: "소득·연체·서류" },
          { value: "즉시", label: "재신청 가능", sub: "사유 해소 후" },
          { value: "1397", label: "사유 확인", sub: "콜센터 문의" },
          { value: "대안 있음", label: "불가 시", sub: "햇살론15 등" },
        ]}
      />
    ),
    "after-0": (
      <WarningBox type="warning" title="부결 사유를 먼저 정확히 확인하세요">
        <p>부결 통보를 받으면 1397 콜센터에 전화해서 정확한 사유를 확인하세요. 사유에 따라 재신청 가능 여부와 시기가 달라요.</p>
      </WarningBox>
    ),
  },

  // 대환대출 (절차확인형)
  "햇살론유스/대환대출": {
    top: (
      <StatCard
        items={[
          { value: "3.5%", label: "전환 후 금리", sub: "고정금리" },
          { value: "1,200만", label: "대환 한도", sub: "기존 대출 잔액 이내" },
          { value: "15년", label: "상환 기간", sub: "거치기간 포함" },
          { value: "고금리→저금리", label: "전환 효과", sub: "이자 부담 감소" },
        ]}
      />
    ),
    "after-1": (
      <ProcessTimeline
        steps={[
          { step: "1", title: "기존 대출 확인", desc: "현재 고금리 대출 잔액과 금리 확인" },
          { step: "2", title: "대환 자격 확인", desc: "1397 상담 또는 서금원 앱에서 확인" },
          { step: "3", title: "대환 신청", desc: "서금원 앱에서 대환대출 접수" },
          { step: "4", title: "심사·실행", desc: "승인 시 기존 대출 상환 + 신규 대출 실행" },
        ]}
      />
    ),
  },

  // 필요서류 (절차확인형)
  "햇살론유스/필요서류": {
    top: (
      <AccordionChecklist
        groups={[
          {
            title: "공통 기본 서류",
            items: ["신분증 (주민등록증 또는 운전면허증)", "주민등록등본 (3개월 이내)", "소득증빙서류 (원천징수영수증, 소득금액증명원 등)"],
          },
          {
            title: "대학(원)생 추가 서류",
            items: ["재학증명서", "등록금 납부 고지서", "성적증명서 (신입생/복학 첫 학기 면제)"],
          },
          {
            title: "취업준비생 추가 서류",
            items: ["졸업증명서", "구직활동 증빙 (워크넷 구직등록 등)"],
          },
          {
            title: "사회초년생 추가 서류",
            items: ["재직증명서 (입사 1년 이내)", "건강보험자격득실확인서"],
          },
        ]}
      />
    ),
  },

  // 대학생 (자격확인형)
  "햇살론유스/대학생": {
    top: (
      <StatCard
        items={[
          { value: "19~34세", label: "나이", sub: "대학(원) 재학 중" },
          { value: "3,500만", label: "소득 상한", sub: "본인 연소득" },
          { value: "등록금", label: "학자금", sub: "등록금 실비 지원" },
          { value: "200만/학기", label: "생활자금", sub: "학기당 최대" },
        ]}
      />
    ),
    "after-0": (
      <EligibilityChecker
        questions={[
          { question: "만 19세 이상 34세 이하인가요?", helpText: "신청일 기준 만 나이" },
          { question: "국내 대학교에 재학 중인가요?", helpText: "대학원생도 가능" },
          { question: "연소득 3,500만원 이하인가요?" },
          { question: "신용정보에 연체 기록이 없나요?" },
        ]}
        passMessage="대학생 햇살론유스 신청 자격이 있어요!"
        failMessage="일부 조건이 충족되지 않았어요. 한국장학재단 학자금대출도 검토해 보세요."
      />
    ),
  },

  // 취업준비생 (자격확인형)
  "햇살론유스/취업준비생": {
    top: (
      <StatCard
        items={[
          { value: "19~34세", label: "나이", sub: "미취업 상태" },
          { value: "3,500만", label: "소득 상한", sub: "연소득 기준" },
          { value: "3.5%", label: "적용 금리", sub: "고정금리" },
          { value: "1,200만", label: "최대 한도", sub: "생활자금" },
        ]}
      />
    ),
    "after-0": (
      <EligibilityChecker
        questions={[
          { question: "만 19세 이상 34세 이하인가요?" },
          { question: "현재 미취업 상태인가요?", helpText: "소득이 없어도 신청 가능" },
          { question: "연소득 3,500만원 이하인가요?", helpText: "소득 없으면 자동 충족" },
          { question: "신용정보에 연체 기록이 없나요?" },
        ]}
        passMessage="취업준비생 햇살론유스 신청 자격이 있어요!"
        failMessage="일부 조건이 충족되지 않았어요."
      />
    ),
  },

  // 사회초년생 (자격확인형)
  "햇살론유스/사회초년생": {
    top: (
      <StatCard
        items={[
          { value: "19~34세", label: "나이", sub: "중소기업 재직" },
          { value: "3,500만", label: "소득 상한", sub: "연소득 기준" },
          { value: "1년 이내", label: "재직 기간", sub: "입사일 기준" },
          { value: "4.5%", label: "적용 금리", sub: "고정금리" },
        ]}
      />
    ),
    "after-0": (
      <EligibilityChecker
        questions={[
          { question: "만 19세 이상 34세 이하인가요?" },
          { question: "중소기업에 재직 중인가요?", helpText: "사업자등록 중인 자는 제외" },
          { question: "입사한 지 1년 이내인가요?" },
          { question: "연소득 3,500만원 이하인가요?" },
          { question: "신용정보에 연체 기록이 없나요?" },
        ]}
        passMessage="사회초년생 햇살론유스 신청 자격이 있어요!"
        failMessage="일부 조건이 충족되지 않았어요."
      />
    ),
  },

  // 소득기준 (자격확인형)
  "햇살론유스/소득기준": {
    top: (
      <StatCard
        items={[
          { value: "3,500만", label: "소득 상한", sub: "연소득 기준" },
          { value: "100%", label: "기준중위소득", sub: "이하도 가능" },
          { value: "원천징수", label: "증빙 방법", sub: "영수증·확인서" },
          { value: "0원 가능", label: "무소득", sub: "취준생 해당" },
        ]}
      />
    ),
  },

  // 취급기관 (절차확인형)
  "햇살론유스/취급기관": {
    top: (
      <RangeTable
        title="햇살론유스 취급 기관"
        description="서민금융진흥원 보증 + 협약은행 대출 실행 구조예요."
        rowHeader="취급 기관"
        colHeaders={[{ label: "역할" }, { label: "연락처" }]}
        rows={[
          { range: "서민금융진흥원", values: ["보증서 발급", "1397"] },
          { range: "기업은행", values: ["대출 실행", "1566-3566"] },
          { range: "신한은행", values: ["대출 실행", "1599-8000"] },
          { range: "전북은행", values: ["대출 실행", "1588-4477"] },
        ]}
        highlightLabel="서금원 앱으로 보증 신청 후 은행 방문"
      />
    ),
    "after-3": (
      <ContactCard
        contacts={[
          {
            name: "서민금융진흥원 콜센터",
            description: "햇살론유스 상담 및 신청 안내",
            phone: "1397",
            hours: "평일 09:00~18:00",
            url: "https://www.kinfa.or.kr",
            urlLabel: "서민금융진흥원 홈페이지",
          },
        ]}
      />
    ),
  },

  // 상환방식 (비용계산형)
  "햇살론유스/상환방식": {
    top: (
      <StatCard
        items={[
          { value: "원금균등", label: "상환 방식", sub: "분할상환" },
          { value: "15년", label: "상환 기간", sub: "거치 포함" },
          { value: "3.5%", label: "적용 금리", sub: "고정금리" },
          { value: "점점 줄어요", label: "월 납부액", sub: "매달 이자 감소" },
        ]}
      />
    ),
    "after-1": (
      <Calculator
        title="원금균등분할상환 월 납부액 계산"
        description="원금균등 방식은 매달 갚는 원금이 같고, 이자가 줄어들어요."
        fields={[
          { key: "amount", label: "대출 금액", placeholder: "1200", unit: "만원", defaultValue: "1200" },
          { key: "rate", label: "금리", placeholder: "3.5", unit: "%", defaultValue: "3.5" },
          { key: "years", label: "상환 기간", placeholder: "15", unit: "년", defaultValue: "15" },
        ]}
        results={[
          {
            label: "첫 달 납부액",
            formula: (v) => {
              const p = (v.amount as number) * 10000;
              const r = (v.rate as number) / 100 / 12;
              const n = (v.years as number) * 12;
              if (!p || !r || !n) return "\u2014";
              const principal = p / n;
              const interest = p * r;
              return `${Math.round(principal + interest).toLocaleString()}원`;
            },
            highlight: true,
          },
          {
            label: "마지막 달 납부액",
            formula: (v) => {
              const p = (v.amount as number) * 10000;
              const r = (v.rate as number) / 100 / 12;
              const n = (v.years as number) * 12;
              if (!p || !r || !n) return "\u2014";
              const principal = p / n;
              const lastInterest = (p / n) * r;
              return `${Math.round(principal + lastInterest).toLocaleString()}원`;
            },
          },
          {
            label: "총 이자",
            formula: (v) => {
              const p = (v.amount as number) * 10000;
              const r = (v.rate as number) / 100 / 12;
              const n = (v.years as number) * 12;
              if (!p || !r || !n) return "\u2014";
              const totalInterest = (p * r * (n + 1)) / 2;
              return `${Math.round(totalInterest).toLocaleString()}원`;
            },
          },
        ]}
      />
    ),
  },


  /* ══════════════════════════════════════════
     햇살론15 — spoke별 시각화
     ══════════════════════════════════════════ */

  // 신청조건 (자격확인형)
  "햇살론15/신청조건": {
    top: (
      <StatCard
        items={[
          { value: "3,500만", label: "소득 상한", sub: "신용점수 무관 구간" },
          { value: "4,500만", label: "소득 상한", sub: "하위20% 해당 시" },
          { value: "744점↓", label: "신용점수", sub: "하위 20% 기준" },
          { value: "나이 제한 없음", label: "연령", sub: "성인이면 가능" },
        ]}
      />
    ),
    "after-0": (
      <EligibilityChecker
        questions={[
          { question: "연소득 3,500만원 이하인가요?", helpText: "3,500만 이하면 신용점수 무관" },
          { question: "또는 신용점수가 744점 이하(하위 20%)인가요?", helpText: "NICE 또는 KCB 기준. 이 경우 연소득 4,500만원까지 가능" },
          { question: "현재 채무불이행(연체) 상태가 아닌가요?" },
          { question: "신용회복지원/개인회생/파산 절차 중이 아닌가요?" },
        ]}
        passMessage="햇살론15 신청 자격이 있어요!"
        failMessage="조건이 맞지 않아요. 햇살론뱅크나 미소금융을 검토해 보세요."
      />
    ),
  },

  // 금리한도 (비용계산형)
  "햇살론15/금리한도": {
    top: (
      <StatCard
        items={[
          { value: "15.9%", label: "최대 금리", sub: "고정금리" },
          { value: "10~14%", label: "실제 수준", sub: "신용·소득에 따라" },
          { value: "700만", label: "최대 한도", sub: "생활+긴급 합산" },
          { value: "3~5년", label: "상환 기간", sub: "선택 가능" },
        ]}
      />
    ),
    "after-1": (
      <Calculator
        title="햇살론15 월 상환액 계산기"
        description="금액과 금리를 입력하면 매달 갚을 금액을 계산해 드려요."
        fields={[
          { key: "amount", label: "대출 금액", placeholder: "700", unit: "만원", defaultValue: "700" },
          { key: "rate", label: "금리", placeholder: "15.9", unit: "%", defaultValue: "15.9" },
          { key: "years", label: "상환 기간", placeholder: "5", unit: "년", defaultValue: "5" },
        ]}
        results={[
          {
            label: "월 상환액",
            formula: (v) => {
              const p = (v.amount as number) * 10000;
              const r = (v.rate as number) / 100 / 12;
              const n = (v.years as number) * 12;
              if (!p || !r || !n) return "\u2014";
              const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
              return `${Math.round(m).toLocaleString()}원`;
            },
            highlight: true,
          },
          {
            label: "총 상환액",
            formula: (v) => {
              const p = (v.amount as number) * 10000;
              const r = (v.rate as number) / 100 / 12;
              const n = (v.years as number) * 12;
              if (!p || !r || !n) return "\u2014";
              const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
              return `${Math.round(m * n).toLocaleString()}원`;
            },
          },
          {
            label: "총 이자",
            formula: (v) => {
              const p = (v.amount as number) * 10000;
              const r = (v.rate as number) / 100 / 12;
              const n = (v.years as number) * 12;
              if (!p || !r || !n) return "\u2014";
              const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
              return `${Math.round(m * n - p).toLocaleString()}원`;
            },
          },
        ]}
      />
    ),
  },

  // 신청방법 (절차확인형)
  "햇살론15/신청방법": {
    top: (
      <ProcessTimeline
        steps={[
          { step: "1", title: "1397 사전상담", desc: "서민금융콜센터에 전화해서 자격 확인" },
          { step: "2", title: "센터 방문 예약", desc: "서민금융통합지원센터(전국 47개소) 방문 예약" },
          { step: "3", title: "서류 제출", desc: "신분증, 소득증빙, 복지 관련 서류 제출" },
          { step: "4", title: "심사 (3~7영업일)", desc: "서류 심사 후 결과 통보" },
          { step: "5", title: "대출 실행", desc: "약정 체결 후 본인 계좌 입금" },
        ]}
      />
    ),
    "after-2": (
      <AccordionChecklist
        groups={[
          {
            title: "기본 서류",
            items: ["신분증 (주민등록증 또는 운전면허증)", "주민등록등본 (3개월 이내)", "소득증빙서류 (원천징수영수증 등)"],
          },
          {
            title: "근로자 추가 서류",
            items: ["재직증명서", "건강보험자격득실확인서"],
          },
          {
            title: "자영업자 추가 서류",
            items: ["사업자등록증", "매출증빙자료"],
          },
        ]}
      />
    ),
    "after-3": (
      <ContactCard
        contacts={[
          {
            name: "서민금융콜센터",
            description: "햇살론15 사전상담·자격확인",
            phone: "1397",
            hours: "평일 09:00~18:00",
            url: "https://www.kinfa.or.kr",
            urlLabel: "서민금융진흥원 홈페이지",
          },
        ]}
      />
    ),
  },


  /* ══════════════════════════════════════════
     햇살론뱅크 — 카테고리 공통 (spoke 없음)
     ══════════════════════════════════════════ */
  "햇살론뱅크": {
    top: (
      <StatCard
        items={[
          { value: "6~10.5%", label: "금리", sub: "기관별 상이" },
          { value: "2,000만", label: "최대 한도" },
          { value: "5년", label: "상환 기간" },
          { value: "745~919", label: "신용점수", sub: "하위 20~50%" },
        ]}
      />
    ),
    "after-0": (
      <EligibilityChecker
        questions={[
          { question: "연소득 4,500만원 이하인가요?" },
          { question: "신용점수가 745~919점(하위 20~50%)인가요?" },
          { question: "현재 연체 중이 아닌가요?" },
          { question: "대환 시 기존 고금리(연 20%+) 대출이 있나요?", helpText: "대환대출 신청 시에만 해당" },
        ]}
        passMessage="햇살론뱅크 신청 자격이 있어요!"
        failMessage="조건이 맞지 않아요. 신용점수에 따라 햇살론15 또는 은행 대출을 검토하세요."
      />
    ),
  },


  /* ══════════════════════════════════════════
     미소금융 — 카테고리 공통
     ══════════════════════════════════════════ */
  "미소금융": {
    top: (
      <StatCard
        items={[
          { value: "2~4.5%", label: "금리", sub: "초저금리" },
          { value: "2,000만", label: "운영자금 한도" },
          { value: "6년", label: "최대 기간", sub: "거치 1년 포함" },
          { value: "무담보", label: "담보 조건", sub: "무보증" },
        ]}
      />
    ),
    "after-0": (
      <EligibilityChecker
        questions={[
          { question: "기준중위소득 100% 이하인가요?", helpText: "기초생활수급자, 차상위계층 포함" },
          { question: "창업 또는 기존 사업 운영 중인가요?", helpText: "긴급생계자금은 별도" },
          { question: "현재 연체 또는 채무불이행 상태가 아닌가요?" },
        ]}
        passMessage="미소금융 신청 자격이 있어요!"
        failMessage="조건이 맞지 않아요. 햇살론15를 검토해 보세요."
      />
    ),
    "after-4": (
      <AccordionChecklist
        groups={[
          {
            title: "기본 서류",
            items: ["신분증", "주민등록등본", "소득증빙서류 또는 기초생활수급자증명서"],
          },
          {
            title: "창업자금 추가",
            items: ["사업계획서 (미소금융 지점 양식)", "사업자등록증 (등록 시)", "임대차계약서", "견적서"],
          },
          {
            title: "운영자금 추가",
            items: ["사업자등록증", "매출증빙자료 (부가세 신고서, POS 매출)", "사업장 임대차계약서"],
          },
        ]}
      />
    ),
  },


  /* ══════════════════════════════════════════
     새희망홀씨 — 카테고리 공통
     ══════════════════════════════════════════ */
  "새희망홀씨": {
    top: (
      <StatCard
        items={[
          { value: "8~10.5%", label: "금리", sub: "은행별 상이" },
          { value: "2,500만", label: "최대 한도" },
          { value: "5년", label: "상환 기간" },
          { value: "6등급↓", label: "신용등급", sub: "하위 10% 이내" },
        ]}
      />
    ),
    "after-0": (
      <RangeTable
        title="새희망홀씨 은행별 금리 비교"
        description="은행마다 금리가 다를 수 있어요. 여러 곳을 비교해 보세요."
        rowHeader="취급 은행"
        colHeaders={[{ label: "금리 범위" }, { label: "한도" }]}
        rows={[
          { range: "KB국민은행", values: ["연 8~10%", "최대 2,500만원"] },
          { range: "신한은행", values: ["연 8~10.5%", "최대 2,500만원"] },
          { range: "하나은행", values: ["연 8.5~10.5%", "최대 2,500만원"] },
          { range: "우리은행", values: ["연 8~10%", "최대 2,500만원"] },
          { range: "NH농협은행", values: ["연 8~10.5%", "최대 2,500만원"] },
        ]}
        highlightLabel="은행별 조건 상이"
      />
    ),
  },


  /* ══════════════════════════════════════════
     긴급생계자금 — 카테고리 공통
     ══════════════════════════════════════════ */
  "긴급생계자금": {
    top: (
      <StatCard
        items={[
          { value: "3%", label: "금리", sub: "초저금리" },
          { value: "100만", label: "최대 한도" },
          { value: "2년", label: "상환 기간" },
          { value: "~4.3만", label: "월 상환액", sub: "100만원 기준" },
        ]}
      />
    ),
    "after-1": (
      <WarningBox type="info" title="긴급생계자금은 위기 사유가 있어야 해요">
        <p>실직, 질병, 재해 등 갑작스러운 위기 사유를 증빙해야 신청할 수 있어요. 단순 생활고로는 신청이 어려워요.</p>
      </WarningBox>
    ),
    "after-5": (
      <ContactCard
        contacts={[
          {
            name: "서민금융진흥원 콜센터",
            description: "긴급생계자금 상담",
            phone: "1397",
            hours: "평일 09:00~18:00",
            url: "https://www.kinfa.or.kr",
          },
          {
            name: "서민금융통합지원센터",
            description: "전국 약 48개소",
            phone: "1397",
            hours: "평일 09:00~18:00",
            urlLabel: "가까운 센터 찾기",
            url: "https://www.kinfa.or.kr",
          },
        ]}
      />
    ),
  },
};

export function ArticleViz({
  slug,
  spokeSlug,
  position,
}: {
  slug: string;
  spokeSlug?: string;
  position: VizPosition;
}) {
  // spoke 전용 키 우선 → 카테고리 fallback
  const spokeKey = spokeSlug ? `${slug}/${spokeSlug}` : null;
  const vizMap = (spokeKey && VIZ_MAP[spokeKey]) || VIZ_MAP[slug];
  if (!vizMap) return null;
  const element = vizMap[position];
  if (!element) return null;
  return <>{element}</>;
}
