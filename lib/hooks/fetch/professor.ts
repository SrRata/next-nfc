import { useState, useEffect, useCallback } from 'react';

interface Professor {
  id: number;
  fullName: string;
}

export function useProfessors() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProfessors = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/professors');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfessors(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  return { professors, loading, error, refresh: fetchProfessors };
}
