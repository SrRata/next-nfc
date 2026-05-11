"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { IdCard, Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FormData {
  first_name: string;
  last_name: string;
  username: string;
  cdl: string;
  email: string;
  phone_number: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  username?: string;
  cdl?: string;
  email?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.first_name || data.first_name.trim().length < 2)
    errors.first_name = "El nombre debe tener al menos 2 caracteres";
  if (!data.last_name || data.last_name.trim().length < 2)
    errors.last_name = "El apellido debe tener al menos 2 caracteres";
  if (!data.username || data.username.trim().length < 3)
    errors.username = "El usuario debe tener al menos 3 caracteres";
  if (!data.cdl || data.cdl.trim().length < 6)
    errors.cdl = "La cédula debe tener al menos 6 caracteres";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Ingresa un correo electrónico válido";
  return errors;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<FormData>({
    first_name: "",
    last_name: "",
    username: "",
    cdl: "",
    email: "",
    phone_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get("/api/profile");
        const id = profileRes.data.id;
        setUserId(id);

        const userRes = await axios.get(`/api/usersc/${id}`);
        const u = userRes.data.data;
        setForm({
          first_name: u.first_name ?? "",
          last_name: u.last_name ?? "",
          username: u.username ?? "",
          cdl: u.cdl ?? "",
          email: u.email ?? "",
          phone_number: u.phone_number ?? "",
        });
      } catch {
        toast.error("No se pudo cargar la información del perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Revisa los campos del formulario");
      return;
    }

    setSaving(true);
    try {
      await axios.put(`/api/usersc/${userId}`, form);
      toast.success("Perfil actualizado correctamente");
      router.push("/profile");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Error al actualizar el perfil"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white-primary rounded-primary p-6 col-span-full flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-primary size-8" />
      </div>
    );
  }

  return (
    <div className="bg-white-primary rounded-primary p-6 col-span-full flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <IdCard className="text-blue-primary size-9" />
        <p className="text-blue-primary font-bold text-xl">Editar información</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="first_name">Nombre</Label>
          <Input
            id="first_name"
            name="first_name"
            placeholder="Tu nombre"
            value={form.first_name}
            onChange={handleChange}
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm">{errors.first_name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="last_name">Apellido</Label>
          <Input
            id="last_name"
            name="last_name"
            placeholder="Tu apellido"
            value={form.last_name}
            onChange={handleChange}
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm">{errors.last_name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="username">Código de usuario</Label>
          <Input
            id="username"
            name="username"
            placeholder="usuario123"
            value={form.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cdl">Cédula (CDL)</Label>
          <Input
            id="cdl"
            name="cdl"
            placeholder="1234567890"
            value={form.cdl}
            onChange={handleChange}
          />
          {errors.cdl && (
            <p className="text-red-500 text-sm">{errors.cdl}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone_number">Teléfono (opcional)</Label>
          <Input
            id="phone_number"
            name="phone_number"
            placeholder="0991234567"
            value={form.phone_number}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-full flex items-center gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                Guardar cambios
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/profile")}
          >
            <X className="size-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}