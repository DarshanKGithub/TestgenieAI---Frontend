"use client";

import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  LinearProgress,
  Stack,
  Chip,
} from "@mui/material";
import type { DashboardSummary } from "@/lib/api";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

interface ModernDashboardCardsProps {
  summary: DashboardSummary;
}

export function ModernDashboardCards({ summary }: ModernDashboardCardsProps) {
  const cards = [
    {
      title: "Total Runs",
      value: summary.totalRuns,
      icon: PlayArrowRoundedIcon,
      color: "linear-gradient(135deg, #155eef 0%, #0ea5a4 100%)",
      bgGradient: "linear-gradient(135deg, rgba(21,94,239,0.15), rgba(14,165,164,0.08))",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Successful",
      value: summary.successfulRuns,
      icon: CheckCircleRoundedIcon,
      color: "linear-gradient(135deg, #16b752 0%, #0ea5a4 100%)",
      bgGradient: "linear-gradient(135deg, rgba(22,183,82,0.15), rgba(14,165,164,0.08))",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Failed",
      value: summary.failedRuns,
      icon: CancelRoundedIcon,
      color: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
      bgGradient: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.08))",
      trend: "-3%",
      trendUp: false,
    },
    {
      title: "Pass Rate",
      value: `${summary.passRate.toFixed(1)}%`,
      icon: TrendingUpRoundedIcon,
      color: "linear-gradient(135deg, #3b82f6 0%, #0ea5a4 100%)",
      bgGradient: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(14,165,164,0.08))",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Avg Duration",
      value: `${summary.avgDurationMs}ms`,
      icon: AccessTimeRoundedIcon,
      color: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
      bgGradient: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.08))",
      trend: "-2%",
      trendUp: true,
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 2.4 }} sx={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s both` }}>
            <Card
              className="glass-panel"
              sx={{
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(6, 34, 79, 0.08)",
                backgroundImage: card.bgGradient,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                height: "100%",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 16px 40px rgba(6, 34, 79, 0.15)",
                },
                "@keyframes slideUp": {
                  "0%": { opacity: 0, transform: "translateY(20px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={2} height="100%">
                  {/* Header */}
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        background: card.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 8px 16px ${card.color.split(",")[0]}80`,
                      }}
                    >
                      <IconComponent sx={{ fontSize: 24, color: "white" }} />
                    </Box>
                    <Chip
                      icon={
                        card.trendUp ? (
                          <TrendingUpRoundedIcon sx={{ fontSize: 16 }} />
                        ) : (
                          <TrendingDownRoundedIcon sx={{ fontSize: 16 }} />
                        )
                      }
                      label={card.trend}
                      size="small"
                      sx={{
                        background: card.trendUp
                          ? "rgba(22, 183, 82, 0.2)"
                          : "rgba(239, 68, 68, 0.2)",
                        color: card.trendUp ? "#16b752" : "#ef4444",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Stack>

                  {/* Content */}
                  <Stack spacing={0.5} flex={1}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ fontSize: "0.875rem" }}>
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        background: card.color,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}

      {/* Bottom CTA Card */}
      <Grid size={{ xs: 12 }} sx={{ animation: "slideUp 0.5s ease-out 0.5s both" }}>
        <Card
          className="glass-panel"
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(6, 34, 79, 0.08)",
            background: "linear-gradient(135deg, rgba(21,94,239,0.12), rgba(14,165,164,0.08))",
            p: 3,
            textAlign: "center",
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 32px rgba(6, 34, 79, 0.12)",
            },
            "@keyframes slideUp": {
              "0%": { opacity: 0, transform: "translateY(20px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #155eef 0%, #0ea5a4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Ready to run more tests?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Navigate to the Runs section to create and execute new test runs with AI-powered automation
            </Typography>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
