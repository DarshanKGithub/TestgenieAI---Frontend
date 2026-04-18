"use client";

import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Alert, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchMe, fetchUsers, type UserListItem, type UserProfile } from "@/lib/api";

export function AdminUserManagement() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const currentUser = await fetchMe();
        if (!mounted) {
          return;
        }

        setProfile(currentUser);

        if (currentUser.role !== "ADMIN") {
          setLoading(false);
          return;
        }

        const loadedUsers = await fetchUsers();
        if (mounted) {
          setUsers(loadedUsers);
        }
      } catch {
        if (mounted) {
          setError("Unable to load the admin user management screen.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Loading admin workspace...
        </Typography>
      </Paper>
    );
  }

  if (profile?.role !== "ADMIN") {
    return (
      <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 4 }}>
        <Stack spacing={1.2}>
          <Typography variant="h6" fontWeight={700}>
            Admin User Management
          </Typography>
          <Alert severity="info">
            You are signed in as {profile?.email ?? "an unknown account"}. Admin access is required to manage users.
          </Alert>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 4 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <AdminPanelSettingsRoundedIcon />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Admin User Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review registered users, roles, and account tiers.
            </Typography>
          </Box>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <Stack spacing={1.2}>
          {users.map((user) => (
            <Box key={user.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonRoundedIcon fontSize="small" />
                  <Box>
                    <Typography variant="body1" fontWeight={700}>
                      {user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      User ID: {user.id}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={user.role} color={user.role === "ADMIN" ? "warning" : "default"} size="small" />
                  <Chip label={user.plan} variant="outlined" size="small" />
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
