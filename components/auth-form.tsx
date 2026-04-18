"use client";

import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { login, registerWithRole, saveToken } from "@/lib/api";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
  onAuthenticated: () => Promise<void>;
}

export function AuthForm({ mode, onAuthenticated }: AuthFormProps) {
  const isRegister = mode === "register";
  const [email, setEmail] = useState("demo@testgenie.ai");
  const [password, setPassword] = useState("Password@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const auth = isRegister
        ? await registerWithRole({ email, password, role: "MEMBER" })
        : await login({ email, password });
      saveToken(auth.token);
      await onAuthenticated();
    } catch {
      setError(isRegister ? "Registration failed." : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper className="glass-panel" sx={{ p: 3, borderRadius: 4, boxShadow: "0 18px 32px rgba(6, 34, 79, 0.08)", maxWidth: 520 }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        {isRegister ? "Create your TestGenie account" : "Sign In to TestGenie"}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {isRegister
          ? "Create a standard account for user-owned test runs. Admin accounts are invite-only."
          : "JWT authentication is required for user-owned test runs."}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={2}>
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? (isRegister ? "Registering..." : "Logging in...") : isRegister ? "Register" : "Login"}
        </Button>
      </Stack>
    </Paper>
  );
}
