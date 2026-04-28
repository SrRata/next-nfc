"use client"

import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";


export default function ScanPage() {
    const [uid, setUid] = useState("")
    const [id, setId] = useState("")
    const [isEntry, setIsEntry] = useState(true)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            axios.post('/api/attendance/entry', {"student_id": id})
            toast.success(`El estudiante fue registrado con exito`)
        } catch (error) {
            console.error('Error create student', error)
            toast.error(`Error al registrar el estudiante`)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                value={id}
                onChange={(e) => setId(e.target.value)} 
                name="id"
                />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

