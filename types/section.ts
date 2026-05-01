import { color } from "@/lib/constants/data-type";

export interface Section {
    id: number;
    name: string;
    is_active: boolean;
    color: color
}