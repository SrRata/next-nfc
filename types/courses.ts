import { color } from "@/lib/constants/data-type";

export interface course {
    id: number;
    course_name: string;
    is_active: boolean;
    educational_level_id: number;
    educational_level_name: string;
    section_id: number,
    section_name: string;
    professor_id: number | null;
    porfessor_name: string | null;
    total_students: number;
    educational_level_color: color;
    section_color: color;
}


