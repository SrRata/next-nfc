import { db } from "@/lib/hooks/db";
import { NextResponse } from "next/server";

// ACTUALIZAR ESTUDIANTE O CAMBIAR ESTADO

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await request.json();
        
        const { firstName, lastName, nfc, isActive, courseId } = body;

        let updates = [];
        let values = [];

        if (firstName) { updates.push("first_name = ?"); values.push(firstName); }
        if (lastName) { updates.push("last_name = ?"); values.push(lastName); }
        if (nfc !== undefined) { updates.push("nfc_uid = ?"); values.push(nfc); }
        if (isActive !== undefined) { updates.push("is_active = ?"); values.push(isActive ? 1 : 0); }
        if (courseId) { updates.push("course_id = ?"); values.push(courseId); }

        if (updates.length === 0) return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });

        values.push(id);
        const sql = `UPDATE students SET ${updates.join(", ")} WHERE id = ?`;

        await db.query(sql, values);
        return NextResponse.json({ message: "Estudiante actualizado con éxito" });

    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') return NextResponse.json({ error: "El NFC ya está en uso" }, { status: 400 });
        return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
    }
}



export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    console.log("Intentando borrar ID:", params.id); // Revisa esto en tu terminal
    
    if (!params.id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    try {
        await db.query("DELETE FROM students WHERE id = ?", [params.id]);
        return NextResponse.json({ message: "Estudiante eliminado" });
    } catch (error) {
        return NextResponse.json({ error: "Error de DB" }, { status: 500 });
    }
}
