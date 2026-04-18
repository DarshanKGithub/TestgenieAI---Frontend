"use client";

import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { analyzeFailure, type FailureAnalysisResponse } from "@/lib/api";

export function FailureAnalysisPanel() {
  const [suiteName, setSuiteName] = useState("Smoke Suite");
  const [testName, setTestName] = useState("Login flow");
  const [errorLog, setErrorLog] = useState("Timeout 30000ms exceeded while waiting for locator('button:has-text(\"Submit\")').");
  const [result, setResult] = useState<FailureAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!errorLog.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await analyzeFailure({
        suiteName: suiteName.trim() || undefined,
        testName: testName.trim() || undefined,
        errorLog: errorLog.trim(),
      });
      setResult(response);
    } catch {
      setError("Unable to analyze failure right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 4, boxShadow: "0 18px 32px rgba(6, 34, 79, 0.08)" }}>
      <Typography variant="h6" mb={2} fontWeight={700}>
        AI Failure Analysis
      </Typography>

      <Stack spacing={2}>
        <TextField label="Suite Name" value={suiteName} onChange={(e) => setSuiteName(e.target.value)} fullWidth />
        <TextField label="Test Name" value={testName} onChange={(e) => setTestName(e.target.value)} fullWidth />
        <TextField
          label="Failure Logs"
          value={errorLog}
          onChange={(e) => setErrorLog(e.target.value)}
          multiline
          minRows={6}
          fullWidth
        />
        <Button variant="contained" onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Failure"}
        </Button>

        {error && <Alert severity="error">{error}</Alert>}

        {result && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Summary
            </Typography>
            <Typography variant="body2" mb={2}>{result.summary}</Typography>

            <Typography variant="subtitle1" fontWeight={700}>
              Probable Causes
            </Typography>
            <ul>
              {result.probableCauses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <Typography variant="subtitle1" fontWeight={700}>
              Suggested Fixes
            </Typography>
            <ul>
              {result.suggestedFixes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}
