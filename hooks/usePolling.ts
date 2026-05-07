// hooks/usePolling.ts
import { useEffect, useState, useCallback } from "react";

export function usePolling<T>(url: string, intervalMs = 5000) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    const res  = await fetch(url);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [url]);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, intervalMs);
    return () => clearInterval(id);
  }, [fetch_, intervalMs]);

  return { data, loading };
}