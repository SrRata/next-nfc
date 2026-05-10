import { IconShape } from "@/components/ui/icon-shape";
import { GraduationCap, Shield } from "lucide-react";
import { Metadata } from "next";
import { LoginForm } from "./login-form";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Login - WARDEN NFC",
};

export default function LoginPage() {
  return (
    <div className="h-screen w-screen grid place-content-center">
      <div className="m-6 min-w-125 max-w-full flex flex-col items-center">
        <div className="bg-white-primary rounded-full size-23 grid place-content-center mb-10">
          <IconShape
            icon={GraduationCap}
            color="blue"
            shape="circle"
            size="xl"
          />
        </div>

        <div className="flex flex-col w-full items-center mb-7">
          <h2 className="text-3xl font-bold text-black-primary">
            Acceso para usuarios
          </h2>
          <p className="font-medium text-black-secondary">
            Sistema de Asistencia Escolar NFC
          </p>
        </div>

        <div className="bg-white-primary rounded-primary flex items-center gap-4 p-4 w-full mb-7">
          <IconShape icon={Shield} color="blue" />
          <div>
            <p className="font-bold text-black-primary">Acceso restringido</p>
            <p className="font-medium text-black-secondary">
              Solo para usuarios del sistema
            </p>
          </div>
        </div>
        <LoginForm />
      </div>
      <Toaster
        richColors
        position="top-right"
        theme="light"
        duration={6000}
      />
    </div>
  );
}
