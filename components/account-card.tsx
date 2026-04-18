"use client";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { Alert, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchMe, type UserProfile } from "@/lib/api";

export function AccountCard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const response = await fetchMe();
        if (mounted) {
          setProfile(response);
        }
      } catch {
        if (mounted) {
          setError("Unable to load account info.");
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Paper className="glass-panel" sx={{ p: 2.2, borderRadius: 4 }}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Account
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <AccountCircleRoundedIcon fontSize="small" />
          <Typography variant="body2" fontWeight={700}>
            {profile?.email ?? "Loading profile..."}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <AdminPanelSettingsRoundedIcon fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {profile ? `${profile.role} · ${profile.plan} plan` : "Checking role..."}
          </Typography>
        </Stack>
        {error && <Alert severity="warning">{error}</Alert>}
      </Stack>
    </Paper>
  );
}
