import { useQuery } from '@tanstack/react-query';

export interface Parent {
  id: number;
  courseName: string;
}

export function useCourseList() {
    const fetchParents = async () => {
        const res = await fetch(`/api/system/courses`);
        if (!res.ok) {
            throw new Error('Error al cargar listado de cursos');
        }
        return res.json();
    };

    return useQuery<Parent[]>({
        queryKey: ["coursesList"],
        queryFn: fetchParents,
    });
}
