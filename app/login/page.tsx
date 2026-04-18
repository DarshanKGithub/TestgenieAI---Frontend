"use client";

import { useRouter } from "next/navigation";
import { ModernAuthLayout } from "@/components/modern-auth-layout";
import { ModernAuthForm } from "@/components/modern-auth-form";

export default function LoginPage() {
  const router = useRouter();

  return (
    <ModernAuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your TestGenie dashboard and manage your test automation"
    >
      <ModernAuthForm mode="login" onAuthenticated={async () => router.push("/dashboard")} />
    </ModernAuthLayout>
  );
}
