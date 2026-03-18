import { useSearchParams, useRouter } from "next/navigation";

export function useUpdateUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  // Nueva función para borrar solo lo que pertenece a un grupo
  function clearPrefixFilters(prefix: string, fieldIds: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    
    // 1. Borrar el campo de búsqueda con prefijo
    const searchKey = prefix ? `${prefix}_search` : "search";
    params.delete(searchKey);

    // 2. Borrar cada campo dinámico con su prefijo
    fieldIds.forEach((id) => {
      const fieldKey = prefix ? `${prefix}_${id}` : id;
      params.delete(fieldKey);
    });

    router.push(`?${params.toString()}`, { scroll: false });
  }

  // Mantenemos esta por si quieres borrar TODO en algún botón global
  function clearAllFilters() {
    router.push(window.location.pathname, { scroll: false });
  }

  return { updateFilter, clearPrefixFilters, clearAllFilters };
}