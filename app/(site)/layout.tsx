import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/** 공개 사이트 공통 레이아웃 — 스튜디오(/studio)는 자체 레이아웃을 사용 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
