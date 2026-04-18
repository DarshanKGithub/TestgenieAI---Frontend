"use client";

import { AuthForm } from "@/components/auth-form";

interface AuthPanelProps {
  onAuthenticated: () => Promise<void>;
}

export function AuthPanel({ onAuthenticated }: AuthPanelProps) {
  return (
    <AuthForm mode="login" onAuthenticated={onAuthenticated} />
  );
}
