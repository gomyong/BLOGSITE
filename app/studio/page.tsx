import { isAuthenticated, isStudioEnabled } from "@/lib/adminAuth";
import LoginForm from "@/components/studio/LoginForm";
import Dashboard from "@/components/studio/Dashboard";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const authed = await isAuthenticated();
  if (!authed) return <LoginForm enabled={isStudioEnabled()} />;
  return <Dashboard />;
}
