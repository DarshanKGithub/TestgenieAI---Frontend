"use client";

import { Alert, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { CreateRunForm } from "@/components/create-run-form";
import { RunDetailsPanel } from "@/components/run-details-panel";
import { TestRunsTable } from "@/components/test-runs-table";
import { createRun, fetchRun, fetchRuns, type ExecutionStatus, type TestRun } from "@/lib/api";

export default function RunsPage() {
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<TestRun | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ExecutionStatus | "">("");
  const [suiteFilter, setSuiteFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadData(nextPage = page, nextSize = size, nextStatus = statusFilter, nextSuite = suiteFilter) {
    try {
      setError(null);
      const runsData = await fetchRuns({ page: nextPage, size: nextSize, status: nextStatus, suiteName: nextSuite });
      setRuns(runsData.items);
      setTotalItems(runsData.totalItems);
      setPage(runsData.page);
      setSize(runsData.size);
      if (selectedRun) {
        const updatedSelected = runsData.items.find((item) => item.id === selectedRun.id);
        if (updatedSelected) {
          setSelectedRun(updatedSelected);
        }
      }
    } catch {
      setError("Unable to load test runs.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData(page, size, statusFilter, suiteFilter);
  }, [page, size, statusFilter, suiteFilter]);

  useEffect(() => {
    if (!selectedRun || (selectedRun.status !== "PENDING" && selectedRun.status !== "RUNNING")) {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const details = await fetchRun(selectedRun.id);
        setSelectedRun(details);

        if (details.status !== "PENDING" && details.status !== "RUNNING") {
          await loadData(page, size, statusFilter, suiteFilter);
        }
      } catch {
        // Keep polling until the worker settles or the user changes selection.
      }
    }, 2500);

    return () => window.clearInterval(timer);
  }, [selectedRun?.id, selectedRun?.status, page, size, statusFilter, suiteFilter]);

  async function handleCreate(payload: { suiteName: string; targetUrl: string; testCases: { testName: string; path: string; expectedText?: string | null }[] }) {
    try {
      setError(null);
      const createdRun = await createRun(payload);
      setSelectedRun(createdRun);
      await loadData(page, size, statusFilter, suiteFilter);
    } catch {
      setError("Test run creation failed. Verify Playwright worker and backend runner.");
    }
  }

  async function handleSelectRun(run: TestRun) {
    try {
      setError(null);
      const details = await fetchRun(run.id);
      setSelectedRun(details);
    } catch {
      setError("Unable to load run details.");
    }
  }

  return (
    <Stack spacing={2.2}>
      {error && <Alert severity="error">{error}</Alert>}
      <CreateRunForm onCreate={handleCreate} />
      <RunDetailsPanel run={selectedRun} />
      <TestRunsTable
        runs={runs}
        page={page}
        size={size}
        totalItems={totalItems}
        statusFilter={statusFilter}
        suiteFilter={suiteFilter}
        selectedRunId={selectedRun?.id}
        onPageChange={setPage}
        onSizeChange={(nextSize) => {
          setSize(nextSize);
          setPage(0);
        }}
        onStatusFilterChange={(status) => {
          setStatusFilter(status);
          setPage(0);
        }}
        onSuiteFilterChange={(suiteName) => {
          setSuiteFilter(suiteName);
          setPage(0);
        }}
        onSelectRun={handleSelectRun}
      />
    </Stack>
  );
}
