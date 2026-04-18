"use client";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import { Alert, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchAiStatus, type AiStatus } from "@/lib/api";

export function AiStatusCard() {
  const [status, setStatus] = useState<AiStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadStatus() {
      try {
        const response = await fetchAiStatus();
        if (mounted) {
          setStatus(response);
        }
      } catch {
        if (mounted) {
          setError("Unable to load AI status right now.");
        }
      }
    }

    loadStatus();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 4 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            AI Status
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This shows whether the backend is using Groq-backed AI or fallback logic.
          </Typography>
        </Box>

        {error && <Alert severity="warning">{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} flexWrap="wrap" useFlexGap>
          <Chip
            icon={<AutoAwesomeRoundedIcon />}
            label={status?.configured ? "AI enabled" : "Fallback mode"}
            color={status?.configured ? "success" : "warning"}
            variant="outlined"
          />
          <Chip icon={<MemoryRoundedIcon />} label={status?.model ?? "Loading model..."} variant="outlined" />
          <Chip icon={<SettingsSuggestRoundedIcon />} label={status?.baseUrl ?? "Loading base URL..."} variant="outlined" />
        </Stack>
      </Stack>
    </Paper>
  );
}
