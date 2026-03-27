import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

export interface Professor {
  id: number;
  firstName: string;
  lastName: string
}

export function useProfessors() {
    const fetchProfessors = async () => {
        const res = await fetch(`/api/professors`);
        if (!res.ok) {
            throw new Error('Error al cargar profesores');
        }
        return res.json();
    };

    return useQuery<Professor[]>({
        queryKey: ["professors"],
        queryFn: fetchProfessors,
    });
}
