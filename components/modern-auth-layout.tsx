"use client";

import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { useThemeMode } from "@/app/providers";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

interface ModernAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function ModernAuthLayout({ children, title, subtitle }: ModernAuthLayoutProps) {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 3,
        background: isDark
          ? "linear-gradient(135deg, #060b14 0%, #0f1729 50%, #1a2e4d 100%)"
          : "linear-gradient(135deg, #ecf6ff 0%, #f0f9ff 50%, #e0f2fe 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} alignItems="center" mb={4}>
          {/* Logo/Icon */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: `linear-gradient(135deg, #155eef 0%, #0ea5a4 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 24px rgba(21, 94, 239, 0.24)",
              animation: "float 3s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-12px)" },
              },
            }}
          >
            <LockRoundedIcon sx={{ fontSize: 32, color: "white" }} />
          </Box>

          <Stack spacing={0.5} textAlign="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: isDark
                  ? "linear-gradient(135deg, #58a6ff 0%, #2dd4bf 100%)"
                  : "linear-gradient(135deg, #155eef 0%, #0ea5a4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Stack>
        </Stack>

        {/* Auth Form Card */}
        <Paper
          className="glass-panel"
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: isDark
              ? "0 25px 50px rgba(0, 0, 0, 0.4)"
              : "0 25px 50px rgba(6, 34, 79, 0.1)",
            backdropFilter: "blur(20px)",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(255, 255, 255, 0.6)",
            animation: "slideIn 0.5s ease-out",
            "@keyframes slideIn": {
              "0%": { opacity: 0, transform: "translateY(20px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
