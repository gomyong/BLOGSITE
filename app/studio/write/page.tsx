import { isAuthenticated, isStudioEnabled } from "@/lib/adminAuth";
import LoginForm from "@/components/studio/LoginForm";
import Editor from "@/components/studio/Editor";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ type?: string; slug?: string }>;
}

export default async function WritePage({ searchParams }: PageProps) {
  const authed = await isAuthenticated();
  if (!authed) return <LoginForm enabled={isStudioEnabled()} />;

  const { type, slug } = await searchParams;
  const postType = type === "brief" ? "brief" : "insight";
  return <Editor type={postType} slug={slug} />;
}
