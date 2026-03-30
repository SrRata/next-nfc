import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

export interface Parent {
  id: number;
  firstName: string;
  lastName: string
}

export function useParents() {
    const fetchParents = async () => {
        const res = await fetch(`/api/parents`);
        if (!res.ok) {
            throw new Error('Error al cargar padres');
        }
        return res.json();
    };

    return useQuery<Parent[]>({
        queryKey: ["parents"],
        queryFn: fetchParents,
    });
}
