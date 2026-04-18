"use client";

import { Paper, Stack, Typography } from "@mui/material";
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
} from "recharts";
import type { DashboardTrends } from "@/lib/api";

interface DashboardTrendsProps {
  trends: DashboardTrends;
}

export function DashboardTrends({ trends }: DashboardTrendsProps) {
  return (
    <Stack spacing={2}>
      <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 4, boxShadow: "0 18px 32px rgba(6, 34, 79, 0.08)" }}>
        <Typography variant="h6" mb={2} fontWeight={700}>
          Pass/Fail Trend
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={trends.passFailTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="passedRuns" fill="#00a388" name="Passed" />
            <Bar dataKey="failedRuns" fill="#d32f2f" name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 4, boxShadow: "0 18px 32px rgba(6, 34, 79, 0.08)" }}>
        <Typography variant="h6" mb={2} fontWeight={700}>
          Duration Trend (ms)
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trends.durationTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="averageDurationMs" stroke="#0f4c81" strokeWidth={2.5} dot={false} name="Average Duration" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Stack>
  );
}
