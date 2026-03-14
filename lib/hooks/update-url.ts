"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useUpdateUrl() {

  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {

    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  }

  return updateFilter;
}