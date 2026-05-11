"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AbsenceHeatmapResponse,
  ByCourseResponse,
  DailyTrendResponse,
  StudentReportResponse,
  StudentRankingResponse,
} from "../types/reports";
import { AttendanceResponse } from "@/types/attendance";

// ── Generic fetcher ────────────────────────────────────────────────────────
function useReportFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? `Error ${res.status}`);
      }
      setData(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ── Helpers ────────────────────────────────────────────────────────────────
export function currentMonthRange() {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return {
    from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
    to:   fmt(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

function qs(dateFrom?: string, dateTo?: string, extra?: Record<string, string | number>) {
  const p = new URLSearchParams();
  if (dateFrom) p.set("dateFrom", dateFrom);
  if (dateTo)   p.set("dateTo", dateTo);
  if (extra) Object.entries(extra).forEach(([k, v]) => p.set(k, String(v)));
  return p.toString() ? `?${p.toString()}` : "";
}

// ── Hooks ──────────────────────────────────────────────────────────────────
export function useAttendanceSummary(opts: { dateFrom?: string; dateTo?: string } = {}) {
  return useReportFetch<AttendanceResponse>(
    `/api/reports/attendance-summary${qs(opts.dateFrom, opts.dateTo)}`
  );
}

export function useAbsenceHeatmap(dateFrom?: string, dateTo?: string) {
  return useReportFetch<AbsenceHeatmapResponse>(
    `/api/reports/absence-heatmap${qs(dateFrom, dateTo)}`
  );
}

export function useByCourse(dateFrom?: string, dateTo?: string) {
  return useReportFetch<ByCourseResponse>(
    `/api/reports/by-course${qs(dateFrom, dateTo)}`
  );
}

export function useDailyTrend(dateFrom?: string, dateTo?: string) {
  return useReportFetch<DailyTrendResponse>(
    `/api/reports/daily-trend${qs(dateFrom, dateTo)}`
  );
}

export function useStudentReport(studentId: number, dateFrom?: string, dateTo?: string) {
  return useReportFetch<StudentReportResponse>(
    `/api/reports/student/${studentId}${qs(dateFrom, dateTo)}`
  );
}

export function useStudentRanking(opts: {
  courseId?: number;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
} = {}) {
  const extra: Record<string, string | number> = {};
  if (opts.courseId !== undefined) extra.courseId = opts.courseId;
  if (opts.order)    extra.order  = opts.order;
  if (opts.limit)    extra.limit  = opts.limit;
  if (opts.offset !== undefined) extra.offset = opts.offset;
  return useReportFetch<StudentRankingResponse>(
    `/api/reports/student-ranking${qs(undefined, undefined, extra)}`
  );
}