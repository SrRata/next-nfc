"use client";

import { useState, useEffect, useCallback } from "react";
import { AttendanceResponse } from "../types/attendance";

interface UseAttendanceSummaryOptions {
  dateFrom?: string;
  dateTo?: string;
}

interface UseAttendanceSummaryResult {
  data: AttendanceResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAttendanceSummary(
  options: UseAttendanceSummaryOptions = {}
): UseAttendanceSummaryResult {
  const [data, setData] = useState<AttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.dateFrom) params.set("dateFrom", options.dateFrom);
      if (options.dateTo) params.set("dateTo", options.dateTo);

      const url = `/api/reports/attendance-summary${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? `Error ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [options.dateFrom, options.dateTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}