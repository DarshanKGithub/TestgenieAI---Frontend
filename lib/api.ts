export type ExecutionStatus = "PENDING" | "RUNNING" | "PASSED" | "FAILED";

const AUTH_TOKEN_KEY = "testgenie_token";

export interface TestCaseResult {
  id: string;
  testName: string;
  status: ExecutionStatus;
  errorMessage: string | null;
  durationMs: number;
  executedAt: string;
}

export interface TestRun {
  id: string;
  suiteName: string;
  targetUrl: string;
  status: ExecutionStatus;
  startedAt: string;
  finishedAt: string | null;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  durationMs: number | null;
  testCases: TestCaseResult[];
}

export interface DashboardSummary {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  passRate: number;
  avgDurationMs: number;
}

export interface PassFailTrendPoint {
  date: string;
  passedRuns: number;
  failedRuns: number;
}

export interface DurationTrendPoint {
  date: string;
  averageDurationMs: number;
}

export interface DashboardTrends {
  passFailTrend: PassFailTrendPoint[];
  durationTrend: DurationTrendPoint[];
}

export interface TestCaseInput {
  testName: string;
  path: string;
  expectedText?: string | null;
}

export interface GeneratedTestCases {
  suiteName: string;
  targetUrl: string;
  testCases: TestCaseInput[];
}

export interface FailureAnalysisResponse {
  summary: string;
  probableCauses: string[];
  suggestedFixes: string[];
}

export interface AiStatus {
  configured: boolean;
  model: string;
  baseUrl: string;
  mode: string;
}

export interface AuthResponse {
  token: string;
  email: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: "MEMBER" | "ADMIN";
  plan: string;
}

export type UserRole = "MEMBER" | "ADMIN";

export interface UserListItem {
  id: string;
  email: string;
  role: UserRole;
  plan: string;
}

export type PlanTier = "FREE" | "PRO" | "SCALE";
export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELED";

export interface UsageQuota {
  planTier: PlanTier;
  subscriptionStatus: SubscriptionStatus;
  monthlyQuota: number;
  usedQuota: number;
  remainingQuota: number;
  billingCycleStart: string;
  billingCycleEnd: string;
}

export interface SubscriptionHookPayload {
  email: string;
  planTier: PlanTier;
  subscriptionStatus: SubscriptionStatus;
  monthlyQuota: number;
  stripeCustomerId?: string;
}

export interface SubscriptionHookResult {
  email: string;
  planTier: PlanTier;
  subscriptionStatus: SubscriptionStatus;
  monthlyQuota: number;
  message: string;
}

export interface CiCdTriggerPayload {
  project: string;
  branch: string;
  commitSha: string;
  suiteName: string;
  targetUrl: string;
  ownerEmail?: string;
  testCases: TestCaseInput[];
}

export interface CiCdTriggerResult {
  runId: string;
  status: string;
  project: string;
  branch: string;
  commitSha: string;
}

export type VisualDiffStatus = "MATCH" | "DIFF" | "NO_BASELINE";

export interface VisualBaselinePayload {
  pageKey: string;
  baselineImageBase64: string;
}

export interface VisualBaselineResult {
  pageKey: string;
  baselineImagePath: string;
  updatedAt: string;
}

export interface VisualComparePayload {
  runId?: string;
  pageKey: string;
  currentImageBase64: string;
  thresholdPercent?: number;
}

export interface VisualComparisonResult {
  id: string;
  pageKey: string;
  baselineImagePath: string | null;
  currentImagePath: string;
  diffImagePath: string | null;
  diffPercent: number;
  status: VisualDiffStatus;
  createdAt: string;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function hasToken(): boolean {
  return !!getToken();
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function fetchSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>("/dashboard/summary");
}

export async function fetchTrends(days = 14): Promise<DashboardTrends> {
  return request<DashboardTrends>(`/dashboard/trends?days=${days}`);
}

export async function fetchRuns(params?: {
  page?: number;
  size?: number;
  status?: ExecutionStatus | "";
  suiteName?: string;
}): Promise<PagedResponse<TestRun>> {
  const query = new URLSearchParams();
  query.set("page", String(params?.page ?? 0));
  query.set("size", String(params?.size ?? 10));

  if (params?.status) {
    query.set("status", params.status);
  }
  if (params?.suiteName && params.suiteName.trim().length > 0) {
    query.set("suiteName", params.suiteName.trim());
  }

  return request<PagedResponse<TestRun>>(`/test-runs?${query.toString()}`);
}

export async function fetchRun(runId: string): Promise<TestRun> {
  return request<TestRun>(`/test-runs/${runId}`);
}

export async function createRun(payload: { suiteName: string; targetUrl: string; testCases: TestCaseInput[] }): Promise<TestRun> {
  return request<TestRun>("/test-runs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function generateTestCases(payload: { targetUrl: string; userFlow: string }): Promise<GeneratedTestCases> {
  return request<GeneratedTestCases>("/test-cases/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function analyzeFailure(payload: {
  suiteName?: string;
  testName?: string;
  errorLog: string;
}): Promise<FailureAnalysisResponse> {
  return request<FailureAnalysisResponse>("/ai/failure-analysis", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchAiStatus(): Promise<AiStatus> {
  return request<AiStatus>('/ai/status');
}

export async function registerWithRole(payload: { email: string; password: string; role: UserRole }): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload: { email: string; password: string }): Promise<AuthResponse> {
  return registerWithRole({ ...payload, role: "MEMBER" });
}

export async function login(payload: { email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchMe(): Promise<UserProfile> {
  return request<UserProfile>('/users/me');
}

export async function fetchUsers(): Promise<UserListItem[]> {
  return request<UserListItem[]>('/users');
}

export async function fetchUsageQuota(): Promise<UsageQuota> {
  return request<UsageQuota>("/usage/me");
}

export async function resetUsageCycle(): Promise<UsageQuota> {
  return request<UsageQuota>("/usage/me/reset-cycle", { method: "POST" });
}

export async function applySubscriptionHook(payload: SubscriptionHookPayload): Promise<SubscriptionHookResult> {
  return request<SubscriptionHookResult>("/billing/hooks/subscription", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function triggerCiCdRun(payload: CiCdTriggerPayload, ciSecret: string): Promise<CiCdTriggerResult> {
  return request<CiCdTriggerResult>("/cicd/trigger", {
    method: "POST",
    headers: {
      "X-TestGenie-CI-Secret": ciSecret,
    },
    body: JSON.stringify(payload),
  });
}

export async function upsertVisualBaseline(payload: VisualBaselinePayload): Promise<VisualBaselineResult> {
  return request<VisualBaselineResult>("/visual-regression/baseline", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function compareVisualHash(payload: VisualComparePayload): Promise<VisualComparisonResult> {
  return request<VisualComparisonResult>("/visual-regression/compare", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchVisualHistory(pageKey?: string): Promise<VisualComparisonResult[]> {
  const query = pageKey ? `?pageKey=${encodeURIComponent(pageKey)}` : "";
  return request<VisualComparisonResult[]>(`/visual-regression/history${query}`);
}
