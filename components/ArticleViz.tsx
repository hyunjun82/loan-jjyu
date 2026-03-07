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
} from "@/components/viz";

type VizPosition = "top" | `after-${number}`;

const VIZ_MAP: Record<string, Partial<Record<VizPosition, React.ReactNode>>> = {
  "햇살론유스": {
    top: (
      <StatCard
        items={[
          { value: "3.5~4.5%", label: "금리", sub: "정부보증 저금리" },
          { value: "1,200만", label: "최대 한도", sub: "학자금+생활자금" },
          { value: "15년", label: "상환 기간", sub: "거치기간 포함" },
          { value: "19~34세", label: "연령 조건", sub: "청년 전용" },
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
    "after-2": (
      <Calculator
        title="햇살론유스 월 상환액 계산기"
        description="대출 금액과 금리를 입력하면 월 상환액을 계산해 드려요."
        fields={[
          { key: "amount", label: "대출 금액", placeholder: "1200", unit: "만원", defaultValue: "1200" },
          { key: "rate", label: "금리", placeholder: "4.0", unit: "%", defaultValue: "4.0" },
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
    "after-3": (
      <ProcessTimeline
        steps={[
          { step: "1", title: "사전 상담", desc: "서민금융진흥원 홈페이지 또는 1397 콜센터로 자격 확인" },
          { step: "2", title: "서류 준비", desc: "신분증, 소득증빙, 재학증명서 등 필요 서류 준비" },
          { step: "3", title: "신청 접수", desc: "온라인(kinfa.or.kr) 또는 서민금융통합지원센터 방문" },
          { step: "4", title: "심사", desc: "접수 후 3~5영업일 내 심사 결과 통보" },
          { step: "5", title: "대출 실행", desc: "승인 시 본인 계좌로 대출금 입금" },
        ]}
      />
    ),
    "after-4": (
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
    "after-5": (
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

  "햇살론15": {
    top: (
      <StatCard
        items={[
          { value: "15.9%", label: "최대 금리", sub: "실제 10~14% 수준" },
          { value: "700만", label: "최대 한도", sub: "생활+긴급" },
          { value: "3~5년", label: "상환 기간" },
          { value: "744점", label: "신용점수", sub: "하위 20% 이하" },
        ]}
      />
    ),
    "after-0": (
      <EligibilityChecker
        questions={[
          { question: "연소득 3,500만원 이하인가요?" },
          { question: "신용점수가 744점 이하(하위 20%)인가요?", helpText: "NICE 또는 KCB 기준" },
          { question: "현재 채무불이행(연체) 상태가 아닌가요?" },
          { question: "신용회복지원/개인회생/파산 절차 중이 아닌가요?" },
        ]}
        passMessage="햇살론15 신청 자격이 있어요!"
        failMessage="조건이 맞지 않아요. 햇살론뱅크나 미소금융을 검토해 보세요."
      />
    ),
    "after-3": (
      <ProcessTimeline
        steps={[
          { step: "1", title: "1397 전화 또는 센터 방문", desc: "서민금융통합지원센터에서 사전 상담" },
          { step: "2", title: "자격 확인", desc: "상담원이 소득/신용 상태 확인 후 적합 상품 추천" },
          { step: "3", title: "서류 제출", desc: "신분증, 소득증빙, 복지 관련 서류 제출" },
          { step: "4", title: "심사 (3~7영업일)", desc: "서류 심사 후 결과 통보" },
          { step: "5", title: "대출 실행", desc: "약정 체결 후 본인 계좌 입금" },
        ]}
      />
    ),
  },

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
  position,
}: {
  slug: string;
  position: VizPosition;
}) {
  const vizMap = VIZ_MAP[slug];
  if (!vizMap) return null;
  const element = vizMap[position];
  if (!element) return null;
  return <>{element}</>;
}
