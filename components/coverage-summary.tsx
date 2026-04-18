"use client";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CompareRoundedIcon from "@mui/icons-material/CompareRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  applySubscriptionHook,
  compareVisualHash,
  fetchUsageQuota,
  fetchVisualHistory,
  resetUsageCycle,
  triggerCiCdRun,
  upsertVisualBaseline,
  type PlanTier,
  type SubscriptionStatus,
  type UsageQuota,
  type VisualComparisonResult,
} from "@/lib/api";


const PLAN_OPTIONS: PlanTier[] = ["FREE", "PRO", "SCALE"];
const STATUS_OPTIONS: SubscriptionStatus[] = ["TRIAL", "ACTIVE", "PAST_DUE", "CANCELED"];

export function CoverageSummary() {
  const [usage, setUsage] = useState<UsageQuota | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);

  const [billingEmail, setBillingEmail] = useState("demo@testgenie.ai");
  const [billingPlan, setBillingPlan] = useState<PlanTier>("PRO");
  const [billingStatus, setBillingStatus] = useState<SubscriptionStatus>("ACTIVE");
  const [billingQuota, setBillingQuota] = useState("250");
  const [billingMessage, setBillingMessage] = useState<string | null>(null);

  const [ciSecret, setCiSecret] = useState("testgenie-ci-secret");
  const [ciProject, setCiProject] = useState("testgenie-web");
  const [ciBranch, setCiBranch] = useState("main");
  const [ciCommitSha, setCiCommitSha] = useState("abc1234def");
  const [ciSuite, setCiSuite] = useState("CI Smoke Suite");
  const [ciTargetUrl, setCiTargetUrl] = useState("https://example.com");
  const [ciOwnerEmail, setCiOwnerEmail] = useState("demo@testgenie.ai");
  const [ciResult, setCiResult] = useState<string | null>(null);

  const [baselinePageKey, setBaselinePageKey] = useState("/checkout");
  const [baselineImage, setBaselineImage] = useState<string | null>(null);
  const [compareImage, setCompareImage] = useState<string | null>(null);
  const [compareThreshold, setCompareThreshold] = useState("5");
  const [compareResult, setCompareResult] = useState<string | null>(null);
  const [history, setHistory] = useState<VisualComparisonResult[]>([]);
  const baselineFileRef = useRef<HTMLInputElement | null>(null);
  const compareFileRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function loadUsageAndHistory() {
    try {
      setError(null);
      setUsageError(null);
      const [usageData, visualHistory] = await Promise.all([fetchUsageQuota(), fetchVisualHistory()]);
      setUsage(usageData);
      setHistory(visualHistory);
    } catch {
      setUsageError("Unable to load usage or visual regression history.");
    }
  }

  useEffect(() => {
    loadUsageAndHistory();
  }, []);

  async function handleResetUsageCycle() {
    try {
      const updated = await resetUsageCycle();
      setUsage(updated);
    } catch {
      setError("Could not reset billing cycle usage.");
    }
  }

  async function handleApplyBillingHook() {
    try {
      setError(null);
      setBillingMessage(null);
      const response = await applySubscriptionHook({
        email: billingEmail,
        planTier: billingPlan,
        subscriptionStatus: billingStatus,
        monthlyQuota: Number(billingQuota),
      });
      setBillingMessage(`${response.message} (${response.email}: ${response.planTier}, quota ${response.monthlyQuota})`);
      await loadUsageAndHistory();
    } catch {
      setError("Billing hook failed. Ensure you are logged in as ADMIN.");
    }
  }

  async function handleCiTrigger() {
    try {
      setError(null);
      setCiResult(null);
      const response = await triggerCiCdRun(
        {
          project: ciProject,
          branch: ciBranch,
          commitSha: ciCommitSha,
          suiteName: ciSuite,
          targetUrl: ciTargetUrl,
          ownerEmail: ciOwnerEmail,
          testCases: [
            { testName: "Homepage loads", path: "/", expectedText: "Example Domain" },
            { testName: "Docs link visible", path: "/", expectedText: "illustrative examples" },
          ],
        },
        ciSecret
      );
      setCiResult(`CI run accepted. Run ID: ${response.runId}`);
      await loadUsageAndHistory();
    } catch {
      setError("CI trigger failed. Verify CI secret and payload values.");
    }
  }

  async function handleUpsertBaseline() {
    try {
      setError(null);
      if (!baselineImage) {
        throw new Error("Missing baseline screenshot");
      }
      await upsertVisualBaseline({ pageKey: baselinePageKey, baselineImageBase64: baselineImage });
      setCompareResult("Baseline saved successfully.");
      await loadUsageAndHistory();
    } catch {
      setError("Failed to save visual baseline.");
    }
  }

  async function handleCompare() {
    try {
      setError(null);
      if (!compareImage) {
        throw new Error("Missing comparison screenshot");
      }
      const response = await compareVisualHash({
        pageKey: baselinePageKey,
        currentImageBase64: compareImage,
        thresholdPercent: Number(compareThreshold),
      });
      setCompareResult(`Comparison result: ${response.status} (${response.diffPercent.toFixed(2)}% diff)`);
      await loadUsageAndHistory();
    } catch {
      setError("Failed to compare visual hash.");
    }
  }

  return (
    <Stack spacing={2.2}>
      <Paper className="glass-panel" sx={{ p: 3, borderRadius: 4 }}>
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              SaaS Operations Control
            </Typography>
            <Typography variant="body1" color="text.secondary">
              End-to-end controls for usage quota tracking, billing hooks, CI/CD triggers, and visual regression diff pipeline.
            </Typography>
          </Box>
          {usageError && <Alert severity="warning">{usageError}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} flexWrap="wrap" useFlexGap>
            <Chip icon={<SpeedRoundedIcon />} label="Usage quota tracking" variant="outlined" />
            <Chip icon={<PaidRoundedIcon />} label="Billing/subscription hooks" variant="outlined" />
            <Chip icon={<GitHubIcon />} label="CI trigger endpoint" variant="outlined" />
            <Chip icon={<CompareRoundedIcon />} label="Visual baseline + diff" variant="outlined" />
            <Chip icon={<AutoAwesomeRoundedIcon />} label="Integrated with existing AI and runs" variant="outlined" />
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={2.2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper className="glass-panel" sx={{ p: 3, borderRadius: 4, height: "100%" }}>
            <Stack spacing={1.6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SpeedRoundedIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Usage quota tracking</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Every new run consumes quota. When quota is exceeded, run creation is blocked.
              </Typography>
              <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "action.hover" }}>
                <Typography variant="body2">Plan: {usage?.planTier ?? "-"}</Typography>
                <Typography variant="body2">Subscription: {usage?.subscriptionStatus ?? "-"}</Typography>
                <Typography variant="body2">Used: {usage?.usedQuota ?? 0} / {usage?.monthlyQuota ?? 0}</Typography>
                <Typography variant="body2" fontWeight={700}>Remaining: {usage?.remainingQuota ?? 0}</Typography>
              </Box>
              <Button startIcon={<AutorenewRoundedIcon />} variant="outlined" onClick={handleResetUsageCycle}>
                Reset usage cycle
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper className="glass-panel" sx={{ p: 3, borderRadius: 4, height: "100%" }}>
            <Stack spacing={1.6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PaidRoundedIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Billing/subscription hooks</Typography>
              </Stack>
              <TextField label="User email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} fullWidth />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                <TextField select label="Plan" value={billingPlan} onChange={(e) => setBillingPlan(e.target.value as PlanTier)} fullWidth>
                  {PLAN_OPTIONS.map((plan) => <MenuItem key={plan} value={plan}>{plan}</MenuItem>)}
                </TextField>
                <TextField select label="Status" value={billingStatus} onChange={(e) => setBillingStatus(e.target.value as SubscriptionStatus)} fullWidth>
                  {STATUS_OPTIONS.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </Stack>
              <TextField label="Monthly quota" value={billingQuota} onChange={(e) => setBillingQuota(e.target.value)} type="number" fullWidth />
              <Button variant="contained" onClick={handleApplyBillingHook}>Apply subscription hook</Button>
              {billingMessage && <Alert severity="success">{billingMessage}</Alert>}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper className="glass-panel" sx={{ p: 3, borderRadius: 4, height: "100%" }}>
            <Stack spacing={1.6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <GitHubIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>CI/CD trigger endpoint</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Fires a run via webhook-style endpoint with branch/commit metadata.
              </Typography>
              <TextField label="CI secret" value={ciSecret} onChange={(e) => setCiSecret(e.target.value)} fullWidth />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                <TextField label="Project" value={ciProject} onChange={(e) => setCiProject(e.target.value)} fullWidth />
                <TextField label="Branch" value={ciBranch} onChange={(e) => setCiBranch(e.target.value)} fullWidth />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                <TextField label="Commit SHA" value={ciCommitSha} onChange={(e) => setCiCommitSha(e.target.value)} fullWidth />
                <TextField label="Owner email" value={ciOwnerEmail} onChange={(e) => setCiOwnerEmail(e.target.value)} fullWidth />
              </Stack>
              <TextField label="Suite name" value={ciSuite} onChange={(e) => setCiSuite(e.target.value)} fullWidth />
              <TextField label="Target URL" value={ciTargetUrl} onChange={(e) => setCiTargetUrl(e.target.value)} fullWidth />
              <Button variant="contained" onClick={handleCiTrigger}>Trigger CI run</Button>
              {ciResult && <Alert severity="success">{ciResult}</Alert>}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper className="glass-panel" sx={{ p: 3, borderRadius: 4, height: "100%" }}>
            <Stack spacing={1.6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CompareRoundedIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Visual regression baseline and diff</Typography>
              </Stack>
              <TextField label="Page key" value={baselinePageKey} onChange={(e) => setBaselinePageKey(e.target.value)} fullWidth />
                  <input ref={baselineFileRef} type="file" accept="image/png,image/jpeg" hidden onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setBaselineImage(typeof reader.result === "string" ? reader.result : null);
                    reader.readAsDataURL(file);
                  }} />
                  <Button variant="outlined" onClick={() => baselineFileRef.current?.click()}>Choose baseline screenshot</Button>
                  <Typography variant="body2" color="text.secondary">{baselineImage ? "Baseline screenshot selected" : "No baseline screenshot selected"}</Typography>
              <Button variant="outlined" onClick={handleUpsertBaseline}>Save baseline</Button>
              <Divider />
                  <input ref={compareFileRef} type="file" accept="image/png,image/jpeg" hidden onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setCompareImage(typeof reader.result === "string" ? reader.result : null);
                    reader.readAsDataURL(file);
                  }} />
                  <Button variant="outlined" onClick={() => compareFileRef.current?.click()}>Choose current screenshot</Button>
                  <Typography variant="body2" color="text.secondary">{compareImage ? "Current screenshot selected" : "No current screenshot selected"}</Typography>
              <TextField label="Threshold %" type="number" value={compareThreshold} onChange={(e) => setCompareThreshold(e.target.value)} fullWidth />
              <Button variant="contained" onClick={handleCompare}>Compare against baseline</Button>
              {compareResult && <Alert severity="info">{compareResult}</Alert>}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper className="glass-panel" sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={1.2}>Visual comparison history</Typography>
        <Stack spacing={1}>
          {history.length === 0 && (
            <Typography variant="body2" color="text.secondary">No visual comparisons yet.</Typography>
          )}
          {history.map((item) => (
            <Box key={item.id} sx={{ p: 1.2, borderRadius: 2, bgcolor: "action.hover" }}>
              <Typography variant="body2" fontWeight={700}>{item.pageKey} • {item.status}</Typography>
              <Typography variant="caption" color="text.secondary">diff: {item.diffPercent.toFixed(2)}% • at {new Date(item.createdAt).toLocaleString()}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
