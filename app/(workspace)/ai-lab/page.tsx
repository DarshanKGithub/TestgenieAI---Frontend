"use client";

import { Paper, Stack, Typography } from "@mui/material";
import { AiStatusCard } from "@/components/ai-status-card";
import { FailureAnalysisPanel } from "@/components/failure-analysis-panel";

export default function AiLabPage() {
  return (
    <Stack spacing={2.2}>
      <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={1}>
          AI Lab
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use this workspace to inspect failure logs, get root-cause hints, and iterate on fixes before rerunning pipelines.
        </Typography>
      </Paper>
      <AiStatusCard />
      <FailureAnalysisPanel />
    </Stack>
  );
}
