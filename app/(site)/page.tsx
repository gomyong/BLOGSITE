import { getInsights } from "@/lib/mdx";
import HomeFeed from "@/components/insight/HomeFeed";

export default function HomePage() {
  // 클라이언트 필터 컴포넌트에는 본문을 제외한 메타데이터만 전달
  const insights = getInsights().map(({ content: _content, ...meta }) => meta);

  return (
    <div className="mx-auto max-w-container-max px-[20px] py-lg md:px-lg">
      <HomeFeed insights={insights} />
    </div>
  );
}
