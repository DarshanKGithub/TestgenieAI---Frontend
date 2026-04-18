"use client";

import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { TestRun } from "@/lib/api";

interface RunDetailsPanelProps {
  run: TestRun | null;
}

function chipColor(status: string): "success" | "error" | "warning" {
  if (status === "PASSED") {
    return "success";
  }
  if (status === "FAILED") {
    return "error";
  }
  return "warning";
}

export function RunDetailsPanel({ run }: RunDetailsPanelProps) {
  if (!run) {
    return (
      <Paper className="glass-panel" sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={1}>
          Run Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Execute a test suite or select a row to inspect the full run payload.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className="glass-panel" sx={{ p: 3, borderRadius: 4 }}>
      <Stack spacing={2.2}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.5}>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              {run.suiteName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {run.targetUrl}
            </Typography>
          </Box>
          <Chip label={run.status} color={chipColor(run.status)} />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} flexWrap="wrap" useFlexGap>
          <Chip icon={<DoneRoundedIcon />} label={`Passed ${run.passedTests}`} variant="outlined" />
          <Chip icon={<ErrorRoundedIcon />} label={`Failed ${run.failedTests}`} variant="outlined" />
          <Chip icon={<AccessTimeRoundedIcon />} label={`Duration ${run.durationMs ?? 0} ms`} variant="outlined" />
          <Chip label={`Total ${run.totalTests}`} variant="outlined" />
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Started At
            </Typography>
            <Typography variant="body2">{new Date(run.startedAt).toLocaleString()}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Finished At
            </Typography>
            <Typography variant="body2">
              {run.finishedAt ? new Date(run.finishedAt).toLocaleString() : "Running"}
            </Typography>
          </Paper>
        </Stack>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
            Test Case Results
          </Typography>
          <Stack spacing={1.2}>
            {run.testCases.map((testCase) => (
              <Box key={testCase.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
                  <Box>
                    <Typography variant="body1" fontWeight={700}>
                      {testCase.testName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(testCase.executedAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip size="small" label={testCase.status} color={chipColor(testCase.status)} />
                </Stack>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Duration: {testCase.durationMs} ms
                </Typography>
                {testCase.errorMessage && (
                  <Typography variant="body2" color="error.main" mt={0.5}>
                    {testCase.errorMessage}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
}
