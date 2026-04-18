"use client";

import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import { Box, Chip, Stack, Typography } from "@mui/material";

const chips = [
  { label: "AI Test Generation", icon: <PsychologyRoundedIcon fontSize="small" /> },
  { label: "Parallel Ready", icon: <BoltRoundedIcon fontSize="small" /> },
  { label: "CI-Friendly", icon: <VerifiedRoundedIcon fontSize="small" /> },
];

export function SaasHero() {
  return (
    <Box
      className="glass-panel"
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 5,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: -90,
          top: -70,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(21,94,239,0.35), rgba(14,165,164,0.02))",
          filter: "blur(2px)",
        }}
      />

      <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h3" color="primary.main">
          TestGenie AI
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 860 }}>
          A modern testing SaaS workspace with execution intelligence, AI-assisted debugging, and release confidence analytics.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {chips.map((chip) => (
            <Chip key={chip.label} icon={chip.icon} label={chip.label} variant="outlined" />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
