"use client";

import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { generateTestCases } from "@/lib/api";

interface CreateRunFormProps {
  onCreate: (payload: { suiteName: string; targetUrl: string; testCases: { testName: string; path: string; expectedText?: string | null }[] }) => Promise<void>;
}

export function CreateRunForm({ onCreate }: CreateRunFormProps) {
  const [suiteName, setSuiteName] = useState("Smoke Suite");
  const [targetUrl, setTargetUrl] = useState("https://example.com");
  const [testsRaw, setTestsRaw] = useState("Home page|/|Example Domain\nDocs page|/docs|");
  const [flowRaw, setFlowRaw] = useState("Login\nCheckout\nProfile");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  function parseTestCases(raw: string) {
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, path, expectedText] = line.split("|").map((part) => part.trim());
        return {
          testName: name,
          path: path || "/",
          expectedText: expectedText || null,
        };
      })
      .filter((test) => test.testName.length > 0 && test.path.length > 0);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const testCases = parseTestCases(testsRaw);

    if (!suiteName.trim() || !targetUrl.trim() || testCases.length === 0) {
      return;
    }

    setLoading(true);
    try {
      await onCreate({ suiteName: suiteName.trim(), targetUrl: targetUrl.trim(), testCases });
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    if (!targetUrl.trim() || !flowRaw.trim()) {
      return;
    }

    setGenerating(true);
    try {
      const generated = await generateTestCases({
        targetUrl: targetUrl.trim(),
        userFlow: flowRaw,
      });

      setSuiteName(generated.suiteName);
      const lines = generated.testCases.map((test) => `${test.testName}|${test.path}|${test.expectedText ?? ""}`);
      setTestsRaw(lines.join("\n"));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2.5, borderRadius: 4, boxShadow: "0 18px 32px rgba(6, 34, 79, 0.08)" }}>
      <Typography variant="h6" mb={2} fontWeight={700}>
        Run Test Suite
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Target URL"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Suite Name"
          value={suiteName}
          onChange={(e) => setSuiteName(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="User Flow (for generation, one step per line)"
          value={flowRaw}
          onChange={(e) => setFlowRaw(e.target.value)}
          fullWidth
          multiline
          minRows={4}
        />
        <Button variant="outlined" onClick={handleGenerate} disabled={generating}>
          {generating ? "Generating..." : "Generate Test Cases"}
        </Button>
        <TextField
          label="Test Cases (format: name|path|expectedText)"
          value={testsRaw}
          onChange={(e) => setTestsRaw(e.target.value)}
          fullWidth
          multiline
          minRows={5}
          required
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Executing..." : "Execute Tests"}
        </Button>
      </Stack>
    </Paper>
  );
}
