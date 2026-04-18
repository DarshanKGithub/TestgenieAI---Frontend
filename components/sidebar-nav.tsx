"use client";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import PsychologyAltRoundedIcon from "@mui/icons-material/PsychologyAltRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <DashboardRoundedIcon fontSize="small" /> },
  { href: "/runs", label: "Test Runs", icon: <FactCheckRoundedIcon fontSize="small" /> },
  { href: "/coverage", label: "Coverage & AI", icon: <InsightsRoundedIcon fontSize="small" /> },
  { href: "/ai-lab", label: "AI Lab", icon: <PsychologyAltRoundedIcon fontSize="small" /> },
  { href: "/admin", label: "Admin", icon: <ManageAccountsRoundedIcon fontSize="small" /> },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Stack spacing={1.2}>
      <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>
        Workspace
      </Typography>
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <ButtonBase
            key={item.href}
            component={Link}
            href={item.href}
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              borderRadius: 2.5,
              px: 1.2,
              py: 1,
              textAlign: "left",
              border: "1px solid",
              borderColor: active ? "primary.main" : "divider",
              bgcolor: active ? "rgba(21,94,239,0.12)" : "transparent",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              {item.icon}
              <Typography variant="body2" fontWeight={active ? 700 : 500}>
                {item.label}
              </Typography>
            </Box>
          </ButtonBase>
        );
      })}
    </Stack>
  );
}
