"use client";

import { Alert, Stack, Box, Typography, Container, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { ModernDashboardCards } from "@/components/modern-dashboard-cards";
import { ModernDashboardTrends } from "@/components/modern-dashboard-trends";
import { fetchSummary, fetchTrends, type DashboardSummary, type DashboardTrends as DashboardTrendsData } from "@/lib/api";

const initialSummary: DashboardSummary = {
  totalRuns: 0,
  successfulRuns: 0,
  failedRuns: 0,
  passRate: 0,
  avgDurationMs: 0,
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(initialSummary);
  const [trends, setTrends] = useState<DashboardTrendsData>({ passFailTrend: [], durationTrend: [] });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        setLoading(true);
        const [summaryData, trendsData] = await Promise.all([fetchSummary(), fetchTrends(14)]);
        setSummary(summaryData);
        setTrends(trendsData);
      } catch {
        setError("Unable to load dashboard analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <Container maxWidth="xl" disableGutters>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ animation: "slideDown 0.5s ease-out" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 0.5,
              background: "linear-gradient(135deg, #155eef 0%, #0ea5a4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of your test automation metrics and performance trends
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              animation: "slideDown 0.3s ease-out",
              "@keyframes slideDown": {
                "0%": { opacity: 0, transform: "translateY(-10px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 2,
            }}
          >
            <CircularProgress size={48} />
            <Typography color="text.secondary">Loading your dashboard...</Typography>
          </Box>
        ) : (
          <>
            {/* Summary Cards */}
            <ModernDashboardCards summary={summary} />

            {/* Trends Charts */}
            <ModernDashboardTrends trends={trends} />
          </>
        )}
      </Stack>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Container>
  );
}
