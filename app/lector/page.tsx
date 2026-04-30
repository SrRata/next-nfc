'use client';
import { useState } from 'react';

export default function NFCScanner() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('Acerca un tag NFC al teléfono');

  const startScan = async () => {
    if (!('NDEFReader' in window)) {
      setMessage("Tu navegador no soporta lectura NFC. Prueba con Chrome en Android.");
      setStatus('error');
      return;
    }

    try {
      setStatus('scanning');
      setMessage("Escaneando... mantén el tag cerca.");

      // @ts-ignore - Web NFC aún es experimental en TS
      const reader = new NDEFReader();
      await reader.scan();

      reader.addEventListener("reading", async ({ serialNumber }: any) => {
        setMessage(`ID detectado: ${serialNumber}. Registrando...`);

        // Enviamos el serialNumber (UID) a tu API
        try {
          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nfc_uid: serialNumber })
          });

          const data = await res.json();

          if (res.ok) {
            setStatus('success');
            setMessage(data.message);
          } else {
            setStatus('error');
            setMessage(data.error || data.message);
          }
        } catch (err) {
          setStatus('error');
          setMessage("Error de conexión con el servidor");
        }
      });

    } catch (error) {
      setStatus('error');
      setMessage("Error al iniciar el escáner: " + error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-6">Registro de Asistencia NFC</h1>

      <div className={`w-64 h-64 rounded-full flex items-center justify-center border-4 mb-8 transition-colors ${status === 'idle' ? 'border-gray-300' :
          status === 'scanning' ? 'border-blue-500 animate-pulse' :
            status === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
        }`}>
        <span className="text-5xl">
          {status === 'idle' && '📳'}
          {status === 'scanning' && '📡'}
          {status === 'success' && '✅'}
          {status === 'error' && '❌'}
        </span>
      </div>

      <p className={`text-lg mb-8 ${status === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
        {message}
      </p>

      {status !== 'scanning' && (
        <button
          onClick={startScan}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg active:scale-95 transition-transform"
        >
          {status === 'idle' ? 'Empezar a Escanear' : 'Reintentar'}
        </button>
      )}
    </div>
  );
}
