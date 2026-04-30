export interface student {
    id: number;
    first_name: string;
    last_name: string;
    cdl: string;
    email: string;
    phone_number: string | null;
    nfc_uid: string | null;
    is_active: boolean;
    course_id: number | null;
    course_name: string | null;
    educational_level_name: string | null;
    section_name: string | null;
    total_attendances: number;
    total_absences: number;
    parent_id: number | null;
    parent_name: string | null;
    parent_phone: string | null;
    parent: parent | null;
}

export interface parent {
    first_name: string;
    last_name: string;
    cdl: string;
    email: string;
    username: string;
    password: string;
    phone_number: string;
}

export interface user {
    id: number,
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    role: string,
    is_active: boolean,
    phone_number: string;
    cdl: string
}