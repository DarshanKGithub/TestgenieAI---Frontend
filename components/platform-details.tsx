"use client";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import { Grid, Paper, Typography } from "@mui/material";

const details = [
  {
    title: "AI Workflow",
    description: "Generate suites from user flows, refine them with expected assertions, and execute with one-click orchestration.",
    icon: <AutoAwesomeRoundedIcon color="primary" />,
  },
  {
    title: "Live Insights",
    description: "Track pass/fail and duration trends in near real-time to identify unstable specs before they reach production.",
    icon: <InsightsRoundedIcon color="secondary" />,
  },
  {
    title: "Reliable Engine",
    description: "Playwright worker integration captures test-level outcomes and keeps ownership scoped per authenticated user.",
    icon: <MemoryRoundedIcon color="primary" />,
  },
];

export function PlatformDetails() {
  return (
    <Grid container spacing={2}>
      {details.map((item) => (
        <Grid key={item.title} size={{ xs: 12, md: 4 }}>
          <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 4, height: "100%" }}>
            {item.icon}
            <Typography mt={1.5} mb={0.8} fontWeight={700} variant="h6">
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
