"use client";

import { Paper, Stack, Typography, Box, Grid } from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  ComposedChart,
} from "recharts";
import type { DashboardTrends } from "@/lib/api";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

interface ModernDashboardTrendsProps {
  trends: DashboardTrends;
}

const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    return (
      <Paper
        sx={{
          p: 1.5,
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(6, 34, 79, 0.15)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography variant="caption" fontWeight={600}>
          {payload[0].payload.date}
        </Typography>
        {payload.map((entry: any) => (
          <Typography key={entry.name} variant="caption" display="block" sx={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

export function ModernDashboardTrends({ trends }: ModernDashboardTrendsProps) {
  const hasData = trends.passFailTrend.length > 0 || trends.durationTrend.length > 0;

  return (
    <Stack spacing={3}>
      {/* Pass/Fail Trend */}
      <Paper
        className="glass-panel"
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(6, 34, 79, 0.08)",
          animation: "slideUp 0.5s ease-out 0.3s both",
          "@keyframes slideUp": {
            "0%": { opacity: 0, transform: "translateY(20px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Stack spacing={2.5}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #155eef 0%, #0ea5a4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TimelineRoundedIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Stack spacing={0}>
                <Typography variant="h6" fontWeight={700}>
                  Pass/Fail Trend
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last 14 days performance
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Chart */}
          {trends.passFailTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trends.passFailTrend}>
                <defs>
                  <linearGradient id="passGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16b752" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#16b752" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="failGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.1)" />
                <XAxis dataKey="date" stroke="rgba(100, 100, 100, 0.5)" />
                <YAxis stroke="rgba(100, 100, 100, 0.5)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="passedRuns" fill="url(#passGradient)" name="Passed" radius={[8, 8, 0, 0]} />
                <Bar dataKey="failedRuns" fill="url(#failGradient)" name="Failed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box
              sx={{
                height: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <Typography>No test runs yet</Typography>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Duration Trend */}
      <Paper
        className="glass-panel"
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(6, 34, 79, 0.08)",
          animation: "slideUp 0.5s ease-out 0.4s both",
          "@keyframes slideUp": {
            "0%": { opacity: 0, transform: "translateY(20px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Stack spacing={2.5}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingDownRoundedIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Stack spacing={0}>
                <Typography variant="h6" fontWeight={700}>
                  Duration Trend
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average test execution time
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Chart */}
          {trends.durationTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trends.durationTrend}>
                <defs>
                  <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.1)" />
                <XAxis dataKey="date" stroke="rgba(100, 100, 100, 0.5)" />
                <YAxis stroke="rgba(100, 100, 100, 0.5)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="averageDurationMs"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={false}
                  name="Average Duration (ms)"
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box
              sx={{
                height: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <Typography>No test runs yet</Typography>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Summary Stats */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ animation: "slideUp 0.5s ease-out 0.5s both" }}>
          <Paper
            className="glass-panel"
            sx={{
              p: 2.5,
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(6, 34, 79, 0.08)",
              background: "linear-gradient(135deg, rgba(22,183,82,0.12), rgba(14,165,164,0.08))",
              "@keyframes slideUp": {
                "0%": { opacity: 0, transform: "translateY(20px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                💡 Tip
              </Typography>
              <Typography variant="body2">
                Higher pass rates indicate better test stability and fewer regressions in your codebase.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ animation: "slideUp 0.5s ease-out 0.6s both" }}>
          <Paper
            className="glass-panel"
            sx={{
              p: 2.5,
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(6, 34, 79, 0.08)",
              background: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(99,102,241,0.08))",
              "@keyframes slideUp": {
                "0%": { opacity: 0, transform: "translateY(20px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                ⚡ Performance
              </Typography>
              <Typography variant="body2">
                Monitor duration trends to optimize your tests and reduce execution time.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
