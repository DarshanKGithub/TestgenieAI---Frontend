"use client";

import { useRouter } from "next/navigation";
import { ModernAuthLayout } from "@/components/modern-auth-layout";
import { ModernAuthForm } from "@/components/modern-auth-form";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <ModernAuthLayout
      title="Get Started"
      subtitle="Create a standard TestGenie account and start automating your tests with AI"
    >
      <ModernAuthForm mode="register" onAuthenticated={async () => router.push("/dashboard")} />
    </ModernAuthLayout>
  );
}
