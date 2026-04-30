import { useMutation, useQueryClient } from "@tanstack/react-query";


//CREAR ESTUDIANTE 

export const useCreateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (courseData: any) => {
            const response = await fetch('/api/crud/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al crear estudiante');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
};