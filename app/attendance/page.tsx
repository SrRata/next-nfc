"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IconCurrencyShekel } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";

export default function AttendancePage() {

    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('Listo para escanear');
    const [description, setDescription] = useState('Acerca la tarjeta NFC al lector o ingresa el ID manualmente')
    const [isEntry, setIsEntry] = useState(true);
    const [manualId, setManualId] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [uid, setUid] = useState("");

    const handleRegistration = async (id: string) => {
        try {
            const endpoint = isEntry ? '/api/attendance/entry' : '/api/attendance/exit';
            const response = await axios.post(endpoint, { nfc_uid: id });

            if (response.data.success) {
                setStatus('success');
                setMessage(response.data.message);
                setDescription("Registro completado con éxito.");
            } else {
                setStatus('error');
                setMessage("Atención");
                setDescription(response.data.message);
            }
        } catch (error: any) {
            setStatus('error');
            setMessage("Error de conexión");
            setDescription(error.response?.data?.message || "No se pudo conectar con el servidor.");
        }
    };

    const startScan = async () => {
        if (!('NDEFReader' in window)) {
            setMessage("Tu navegador no soporta lectura NFC. Prueba con otro dispositivo.");
            setStatus('error');
            return;
        }

        try {
            setStatus('scanning');
            setMessage("Escaneando...");
            setDescription("Mantén el tag cerca del lector NFC.");

            // @ts-ignore - Web NFC aún es experimental en TS
            const reader = new NDEFReader();
            setUid(reader.serialNumber)
            await reader.scan();

            reader.addEventListener("reading", async ({ serialNumber }: any) => {
                setMessage("Tag detectado");
                setDescription(`Procesando ID: ${serialNumber}`);
                await handleRegistration(serialNumber);
            });
        } catch (error) {
            setStatus('error');
            setMessage("Error de hardware");
            setDescription("No se pudo iniciar el escáner NFC: " + error);
        }
    }

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue) return;
        setStatus('scanning');
        setMessage("Registrando...");
        await handleRegistration(inputValue);
        setInputValue("");
    };

    return (
        <>

            <div className="max-w-7xl mx-auto p-4 w-screen h-screen space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-black-primary text-3xl">09:02:23</p>
                        <p className="font-medium text-black-primary">martes, 28 de abril de 2026</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" size="sm" onClick={() => setIsEntry(true)} className={`border-gray-300 border hover:bg-gray-200 ${isEntry && 'bg-gray-300'}`}>Entrada</Button>
                        <Button variant="secondary" size="sm" onClick={() => setIsEntry(false)} className={`border-gray-300 border hover:bg-gray-200 ${!isEntry && 'bg-gray-300'}`}>Salida</Button>
                    </div>
                </div>

                <div className="bg-white-primary border border-gray-200 rounded-primary w-full p-20 grid place-items-center space-y-6">
                    <div className="size-60 border border-gray-300 rounded-full grid place-items-center">
                        <div className="size-45 bg-blue-secondary rounded-full grid place-items-center">
                            <IconCurrencyShekel className="text-blue-primary size-20" />
                        </div>
                    </div>
                    <div>
                        <p className="text-center text-black-primary font-bold text-3xl max-w-200">{message}</p>
                        <p className="text-center text-black-primary font-medium">{description}</p>
                        <p className="text-center">{uid}</p>
                    </div>
                </div>

                <div className="grid grid-cols-6 gap-3">
                    <Button variant="outline" className="col-span-4" onClick={startScan}>Escanear tarjeta MFC</Button>
                    <Button variant="outline" className="col-span-2" onClick={() => setManualId(!manualId)}>ID manual</Button>
                </div>

                <form
                    onSubmit={handleManualSubmit}
                    className={`bg-white-primary border border-y-gray-200 rounded-primary w-full p-5 space-y-2 ${!manualId && 'hidden'}`}
                >
                    <p className="text-black-secondary font-medium">Ingresa el UID de la tarjeta o el ID del estudiante</p>
                    <div className="flex items-center gap-3">
                        <Input
                            type="text"
                            required
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ej: NFC-AA-001 o 17xxxxxxxx"
                        />
                        <Button variant="outline" type="submit" disabled={status === 'scanning'}>Registrar</Button>
                    </div>
                </form>
            </div>

        </>
    )
}