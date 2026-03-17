import { useSearchParams, useRouter } from "next/navigation";

export function useUpdateUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`);
  }

  function clearFilters() {
    router.push(window.location.pathname); 
  }

  return { updateFilter, clearFilters };
}