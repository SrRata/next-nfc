"use client"

/**
 * FLUJO:
 * Step 1 → usuario ingresa contraseña actual + nueva + confirmar
 *          elige canal (email y/o WhatsApp)
 *          POST /api/auth/change-password/request
 * Step 2 → usuario ingresa código de 6 dígitos
 *          POST /api/auth/change-password/verify
 */

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import {
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Mail,
    MessageSquare,
    ShieldCheck,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ---------- Tipos ----------
interface PasswordForm {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

interface PasswordErrors {
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
}

// ---------- Validaciones ----------
function validatePasswords(data: PasswordForm): PasswordErrors {
    const errors: PasswordErrors = {};
    if (!data.current_password)
        errors.current_password = "Ingresa tu contraseña actual";
    if (!data.new_password || data.new_password.length < 8)
        errors.new_password = "La nueva contraseña debe tener al menos 8 caracteres";
    else if (!/[A-Z]/.test(data.new_password))
        errors.new_password = "Debe contener al menos una letra mayúscula";
    else if (!/[0-9]/.test(data.new_password))
        errors.new_password = "Debe contener al menos un número";
    if (!data.confirm_password)
        errors.confirm_password = "Confirma tu nueva contraseña";
    else if (data.new_password !== data.confirm_password)
        errors.confirm_password = "Las contraseñas no coinciden";
    return errors;
}

// ---------- Sub-componente: campo de contraseña con ojo ----------
function PasswordField({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    error,
}: {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="flex flex-col gap-1.5">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    name={name}
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}

// ---------- Sub-componente: indicador de fortaleza ----------
function PasswordStrength({ password }: { password: string }) {
    if (!password) return null;

    const checks = [
        { label: "8+ caracteres", ok: password.length >= 8 },
        { label: "Mayúscula", ok: /[A-Z]/.test(password) },
        { label: "Número", ok: /[0-9]/.test(password) },
        { label: "Símbolo", ok: /[^a-zA-Z0-9]/.test(password) },
    ];
    const score = checks.filter((c) => c.ok).length;
    const barColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
    const strengthLabel = ["Débil", "Regular", "Buena", "Fuerte"];
    const strengthText = ["text-red-500", "text-orange-500", "text-yellow-600", "text-green-600"];

    return (
        <div className="flex flex-col gap-2 mt-1">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${i < score ? barColors[score - 1] : "bg-gray-200"
                            }`}
                    />
                ))}
            </div>
            <div className="flex gap-3 flex-wrap">
                {checks.map((c) => (
                    <span
                        key={c.label}
                        className={`text-xs ${c.ok ? "text-green-600" : "text-muted-foreground"}`}
                    >
                        {c.ok ? "✓" : "○"} {c.label}
                    </span>
                ))}
            </div>
            {score > 0 && (
                <p className={`text-xs font-medium ${strengthText[score - 1]}`}>
                    Contraseña {strengthLabel[score - 1]}
                </p>
            )}
        </div>
    );
}

// ---------- Página principal ----------
export default function ChangePasswordPage() {
    const router = useRouter();

    const [step, setStep] = useState<"form" | "verify">("form");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [apiError, setApiError] = useState("");

    // Datos del perfil para mostrar email/teléfono
    const [profile, setProfile] = useState<{ email: string; phone?: string } | null>(null);

    // Canales de envío seleccionados
    const [sendVia, setSendVia] = useState({ email: true, whatsapp: false });

    // Formulario step 1
    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

    // Guardamos la nueva contraseña para enviarla en el step 2
    const [pendingNewPassword, setPendingNewPassword] = useState("");

    // Formulario step 2
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");

    // Cargar perfil
    useEffect(() => {
        axios
            .get("/api/dashboard/profile")
            .then(({ data }) => setProfile({ email: data.email, phone: data.phone }))
            .catch(() => { });
    }, []);

    // Countdown para reenviar
    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
        if (passwordErrors[name as keyof PasswordErrors]) {
            setPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    // STEP 1: Solicitar código
    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError("");

        if (!sendVia.email && !sendVia.whatsapp) {
            setApiError("Selecciona al menos un método de verificación");
            return;
        }

        const validationErrors = validatePasswords(passwordForm);
        if (Object.keys(validationErrors).length > 0) {
            setPasswordErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            await axios.post("/api/auth/change-password/request", {
                current_password: passwordForm.current_password,
                send_email: sendVia.email,
                send_whatsapp: sendVia.whatsapp,
            });
            setPendingNewPassword(passwordForm.new_password);
            setStep("verify");
            setCountdown(60);
        } catch (error: any) {
            setApiError(
                error.response?.data?.message ?? "Error al enviar el código. Verifica tu contraseña actual."
            );
        } finally {
            setLoading(false);
        }
    };

    // Reenviar código
    const handleResend = async () => {
        setResending(true);
        setApiError("");
        try {
            await axios.post("/api/auth/change-password/request", {
                current_password: passwordForm.current_password,
                send_email: sendVia.email,
                send_whatsapp: sendVia.whatsapp,
            });
            setCountdown(60);
        } catch {
            setApiError("No se pudo reenviar el código. Intenta de nuevo.");
        } finally {
            setResending(false);
        }
    };

    // STEP 2: Verificar código
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError("");
        setCodeError("");

        if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
            setCodeError("El código debe ser exactamente 6 dígitos numéricos");
            return;
        }

        setLoading(true);
        try {
            await axios.post("/api/auth/change-password/verify", {
                code,
                new_password: pendingNewPassword,
            });
            router.push("/dashboard/profile?passwordChanged=1");
        } catch (error: any) {
            setApiError(
                error.response?.data?.message ?? "Código incorrecto o expirado. Intenta de nuevo."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-span-full max-w-300 mx-auto">



            <div className="bg-white-primary rounded-primary p-6 col-span-full w-full flex flex-col gap-8">
                {/* Encabezado */}
                <div className="flex items-center gap-4">
                    <KeyRound className="text-blue-primary size-9" />
                    <div>
                        <p className="text-blue-primary font-bold text-xl">Cambiar contraseña</p>
                        <p className="text-sm text-muted-foreground">
                            {step === "form"
                                ? "Ingresa tu contraseña actual y la nueva"
                                : "Ingresa el código de verificación enviado"}
                        </p>
                    </div>
                </div>

                {/* Error global */}
                {apiError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                        {apiError}
                    </div>
                )}

                {/* ========== STEP 1: Formulario ========== */}
                {step === "form" && (
                    <form onSubmit={handleRequestCode} className="flex flex-col gap-6">
                        <PasswordField
                            id="current_password"
                            name="current_password"
                            label="Contraseña actual"
                            placeholder="••••••••"
                            value={passwordForm.current_password}
                            onChange={handlePasswordChange}
                            error={passwordErrors.current_password}
                        />

                        <div className="flex flex-col gap-1.5">
                            <PasswordField
                                id="new_password"
                                name="new_password"
                                label="Nueva contraseña"
                                placeholder="••••••••"
                                value={passwordForm.new_password}
                                onChange={handlePasswordChange}
                                error={passwordErrors.new_password}
                            />
                            <PasswordStrength password={passwordForm.new_password} />
                        </div>

                        <PasswordField
                            id="confirm_password"
                            name="confirm_password"
                            label="Confirmar nueva contraseña"
                            placeholder="••••••••"
                            value={passwordForm.confirm_password}
                            onChange={handlePasswordChange}
                            error={passwordErrors.confirm_password}
                        />

                        {/* Selección de canal */}
                        <div className="flex flex-col gap-3">
                            <Label>Enviar código de verificación por</Label>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <Checkbox
                                        checked={sendVia.email}
                                        onCheckedChange={(v) =>
                                            setSendVia((s) => ({ ...s, email: !!v }))
                                        }
                                    />
                                    <Mail className="size-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Correo electrónico
                                        {profile?.email && (
                                            <span className="text-muted-foreground ml-1">
                                                ({profile.email})
                                            </span>
                                        )}
                                    </span>
                                </label>

                                {/* WhatsApp solo se muestra si el usuario tiene teléfono */}
                                {profile?.phone && (
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <Checkbox
                                            checked={sendVia.whatsapp}
                                            onCheckedChange={(v) =>
                                                setSendVia((s) => ({ ...s, whatsapp: !!v }))
                                            }
                                        />
                                        <MessageSquare className="size-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            WhatsApp
                                            <span className="text-muted-foreground ml-1">
                                                ({profile.phone})
                                            </span>
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin mr-2" />
                                        Enviando...
                                    </>
                                ) : (
                                    "Enviar código"
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/dashboard/profile")}
                            >
                                <X className="size-4 mr-2" />
                                Cancelar
                            </Button>
                        </div>
                    </form>
                )}

                {/* ========== STEP 2: Código de verificación ========== */}
                {step === "verify" && (
                    <form onSubmit={handleVerifyCode} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-5 text-blue-primary" />
                                <p className="text-sm font-medium text-blue-primary">Código enviado</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Enviamos un código de 6 dígitos a{" "}
                                {sendVia.email && <strong>{profile?.email}</strong>}
                                {sendVia.email && sendVia.whatsapp && " y a "}
                                {sendVia.whatsapp && (
                                    <strong>WhatsApp ({profile?.phone})</strong>
                                )}
                                . Expira en 10 minutos.
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="code">Código de verificación</Label>
                            <Input
                                id="code"
                                name="code"
                                placeholder="000000"
                                maxLength={6}
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value.replace(/\D/g, ""));
                                    setCodeError("");
                                }}
                                className="tracking-widest text-center text-2xl font-mono"
                            />
                            {codeError && (
                                <p className="text-red-500 text-sm">{codeError}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin mr-2" />
                                            Verificando...
                                        </>
                                    ) : (
                                        "Verificar y cambiar contraseña"
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setStep("form");
                                        setCode("");
                                        setCodeError("");
                                        setApiError("");
                                    }}
                                >
                                    Volver
                                </Button>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={countdown > 0 || resending}
                                onClick={handleResend}
                                className="self-start text-sm text-muted-foreground"
                            >
                                {resending ? (
                                    <>
                                        <Loader2 className="size-3 animate-spin mr-1" />
                                        Reenviando...
                                    </>
                                ) : countdown > 0 ? (
                                    `Reenviar código en ${countdown}s`
                                ) : (
                                    "¿No recibiste el código? Reenviar"
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}