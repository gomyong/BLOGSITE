import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${siteConfig.name} 개인정보처리방침`,
  alternates: { canonical: `${siteConfig.url}/privacy` },
};

const sections = [
  {
    title: "1. 수집하는 개인정보 항목",
    body: [
      `${siteConfig.name}(이하 "사이트")는 별도의 회원가입 없이 콘텐츠를 열람할 수 있으며, 이용자가 직접 입력하는 개인정보는 원칙적으로 수집하지 않습니다.`,
      "다만 서비스 운영 과정에서 다음 정보가 자동으로 생성·수집될 수 있습니다.",
      "· 접속 로그, IP 주소, 브라우저 및 기기 정보, 방문 페이지, 체류 시간 등 통계성 접속 데이터(Vercel Analytics를 통해 익명으로 집계)",
      "· (편집샵 구매 시) 배송지, 연락처, 결제 정보 — 결제대행사(Stripe)가 직접 수집·처리하며, 사이트는 해당 원본 정보를 저장하지 않습니다.",
    ],
  },
  {
    title: "2. 개인정보의 수집 방법",
    body: [
      "웹사이트 방문 시 자동으로 생성되는 접속 정보(쿠키, 방문 기록 등)를 통해 수집됩니다.",
      "다크모드 설정과 같은 화면 표시 설정은 브라우저 로컬 저장소(localStorage)에만 저장되며 서버로 전송되지 않습니다.",
    ],
  },
  {
    title: "3. 개인정보의 이용 목적",
    body: [
      "· 서비스 이용 통계 분석 및 콘텐츠 품질 개선",
      "· (편집샵 이용 시) 주문 처리, 배송, 결제 확인 및 관련 문의 응대",
    ],
  },
  {
    title: "4. 개인정보의 보유 및 이용 기간",
    body: [
      "접속 통계 데이터는 집계된 형태로만 보관되며 개인을 식별하지 않습니다.",
      "결제·배송 관련 정보는 관계 법령(전자상거래 등에서의 소비자보호에 관한 법률 등)이 정한 기간 동안 결제대행사가 보관합니다.",
    ],
  },
  {
    title: "5. 개인정보의 제3자 제공 및 처리 위탁",
    body: [
      "사이트는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.",
      "· 접속 통계 분석: Vercel Inc. (Vercel Analytics)",
      "· (편집샵 이용 시) 결제 처리: Stripe, Inc.",
    ],
  },
  {
    title: "6. 이용자의 권리",
    body: [
      "이용자는 언제든지 자신의 개인정보 처리 현황에 대해 문의하거나, 관련 문의를 아래 연락처로 요청할 수 있습니다.",
    ],
  },
  {
    title: "7. 문의처",
    body: [
      `운영자: ${siteConfig.name}`,
      "이메일: hello@tealdot.dev",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-content-max px-[20px] py-xl md:px-lg">
      <h1 className="font-headline text-2xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-display">
        개인정보처리방침
      </h1>
      <p className="mt-sm text-body-md text-on-surface-variant">
        시행일: 2026년 7월 23일
      </p>

      <div className="mt-lg space-y-lg">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-headline text-[18px] font-extrabold tracking-tight text-on-surface">
              {section.title}
            </h2>
            <div className="mt-sm space-y-xs text-body-md leading-[1.8] text-on-surface-variant">
              {section.body.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
