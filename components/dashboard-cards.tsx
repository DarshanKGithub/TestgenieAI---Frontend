"use client";

import { Card, CardContent, Grid, Typography } from "@mui/material";
import type { DashboardSummary } from "@/lib/api";

interface DashboardCardsProps {
  summary: DashboardSummary;
}

export function DashboardCards({ summary }: DashboardCardsProps) {
  const cards = [
    { title: "Total Runs", value: summary.totalRuns.toString(), accent: "linear-gradient(135deg, rgba(21,94,239,0.30), rgba(14,165,164,0.08))" },
    { title: "Successful", value: summary.successfulRuns.toString(), accent: "linear-gradient(135deg, rgba(16,185,129,0.30), rgba(13,148,136,0.08))" },
    { title: "Failed", value: summary.failedRuns.toString(), accent: "linear-gradient(135deg, rgba(239,68,68,0.28), rgba(251,146,60,0.08))" },
    { title: "Pass Rate", value: `${summary.passRate.toFixed(1)}%`, accent: "linear-gradient(135deg, rgba(59,130,246,0.26), rgba(125,211,252,0.06))" },
    { title: "Avg Duration", value: `${summary.avgDurationMs} ms`, accent: "linear-gradient(135deg, rgba(168,85,247,0.24), rgba(99,102,241,0.08))" },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card
            className="glass-panel"
            sx={{
              borderRadius: 4,
              boxShadow: "0 22px 40px rgba(8, 26, 65, 0.10)",
              backgroundImage: card.accent,
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                {card.title}
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
