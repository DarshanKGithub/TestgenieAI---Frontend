"use client";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Alert, Box, Container, Drawer, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AccountCard } from "@/components/account-card";
import { AuthPanel } from "@/components/auth-panel";
import { SaasHero } from "@/components/saas-hero";
import { SidebarNav } from "@/components/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { clearToken, hasToken } from "@/lib/api";

interface WorkspaceShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function WorkspaceShell({ title, subtitle, children }: WorkspaceShellProps) {
  const [hydrated, setHydrated] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setAuthenticated(hasToken());
    setHydrated(true);
  }, []);

  async function handleAuthenticated() {
    setAuthenticated(true);
  }

  function handleLogout() {
    clearToken();
    setAuthenticated(false);
  }

  const nav = (
    <Stack spacing={2.2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" color="primary.main" fontWeight={800}>
          TestGenie
        </Typography>
        <ThemeToggle />
      </Stack>
      <AccountCard />
      <SidebarNav />
    </Stack>
  );

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={2.5}>
          <SaasHero />

          {!hydrated && (
            <Paper className="glass-panel" sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Initializing workspace...
              </Typography>
            </Paper>
          )}

          {hydrated && !authenticated && (
            <AuthPanel onAuthenticated={handleAuthenticated} />
          )}

          {hydrated && authenticated && (
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.2} alignItems="flex-start">
              <Paper className="glass-panel" sx={{ p: 2, borderRadius: 4, width: { xs: "100%", md: 260 }, display: { xs: "none", md: "block" }, position: "sticky", top: 20 }}>
                {nav}
              </Paper>

              <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{ sx: { width: 280, p: 2, bgcolor: "background.paper" } }}
              >
                {nav}
              </Drawer>

              <Box sx={{ flex: 1, width: "100%" }}>
                <Paper className="glass-panel" sx={{ p: { xs: 2, md: 2.8 }, borderRadius: 4, mb: 2.2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack>
                      <Typography variant="h5" fontWeight={800}>{title}</Typography>
                      <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <IconButton sx={{ display: { xs: "inline-flex", md: "none" } }} onClick={() => setMobileOpen(true)}>
                        <MenuRoundedIcon />
                      </IconButton>
                      <Alert icon={false} severity="info" sx={{ display: { xs: "none", sm: "flex" } }}>
                        Product Mode
                      </Alert>
                      <Alert icon={false} severity="warning" sx={{ display: { xs: "none", md: "flex" }, cursor: "pointer" }} onClick={handleLogout}>
                        Logout
                      </Alert>
                    </Stack>
                  </Stack>
                </Paper>

                <Stack spacing={2.2}>{children}</Stack>
              </Box>
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
