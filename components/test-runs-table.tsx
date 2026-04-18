"use client";

import {
  Chip,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import type { ExecutionStatus, TestRun } from "@/lib/api";

interface TestRunsTableProps {
  runs: TestRun[];
  page: number;
  size: number;
  totalItems: number;
  statusFilter: ExecutionStatus | "";
  suiteFilter: string;
  selectedRunId?: string | null;
  onPageChange: (nextPage: number) => void;
  onSizeChange: (nextSize: number) => void;
  onStatusFilterChange: (status: ExecutionStatus | "") => void;
  onSuiteFilterChange: (suiteName: string) => void;
  onSelectRun?: (run: TestRun) => void;
}

function statusColor(status: string): "success" | "error" | "warning" {
  if (status === "PASSED") {
    return "success";
  }
  if (status === "FAILED") {
    return "error";
  }
  return "warning";
}

export function TestRunsTable({
  runs,
  page,
  size,
  totalItems,
  statusFilter,
  suiteFilter,
  selectedRunId,
  onPageChange,
  onSizeChange,
  onStatusFilterChange,
  onSuiteFilterChange,
  onSelectRun,
}: TestRunsTableProps) {
  return (
    <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 4, boxShadow: "0 18px 32px rgba(6, 34, 79, 0.08)" }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }} spacing={2} mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Test Runs
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            size="small"
            label="Suite filter"
            value={suiteFilter}
            onChange={(event) => onSuiteFilterChange(event.target.value)}
          />
          <TextField
            size="small"
            select
            label="Status"
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as ExecutionStatus | "")}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PASSED">Passed</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
            <MenuItem value="RUNNING">Running</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
          </TextField>
        </Stack>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Suite</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Passed</TableCell>
              <TableCell>Failed</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Started At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {runs.map((run) => (
              <TableRow
                key={run.id}
                hover
                selected={selectedRunId === run.id}
                sx={{ cursor: onSelectRun ? "pointer" : "default" }}
                onClick={() => onSelectRun?.(run)}
              >
                <TableCell>{run.suiteName}</TableCell>
                <TableCell>
                  <Chip size="small" label={run.status} color={statusColor(run.status)} />
                </TableCell>
                <TableCell>{run.totalTests}</TableCell>
                <TableCell>{run.passedTests}</TableCell>
                <TableCell>{run.failedTests}</TableCell>
                <TableCell>{run.durationMs ?? 0} ms</TableCell>
                <TableCell>{new Date(run.startedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {runs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>No runs yet. Create your first test run.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        rowsPerPage={size}
        onPageChange={(_event, nextPage) => onPageChange(nextPage)}
        onRowsPerPageChange={(event) => {
          onSizeChange(Number(event.target.value));
        }}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Paper>
  );
}
