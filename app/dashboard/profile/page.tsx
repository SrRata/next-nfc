import { Alert } from "@/components/alert";
import { DataUser } from "@/components/data-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IdCard, Key, Lock, User, UserLock } from "lucide-react";

export default function ProfilePage() {
  return (
    <>
      <div className="bg-white-primary rounded-primary p-6 col-span-full grid grid-cols-3 gap-8 ">
        <div className="flex items-center gap-4 col-span-full">
          <IdCard className="text-blue-primary size-9" />
          <p className="text-blue-primary font-bold text-xl">
            Información personal
          </p>
        </div>
        <div>
          <DataUser name="Luis Miguel Matailo Zuñiga" id="0150072668" />
        </div>

        <div>
          <p className="font-bold text-black-secondary text-sm mb-2">
            Rango / Rol
          </p>
          <Badge color="purple">Administrador</Badge>
        </div>
        <div>
          <p className="font-bold text-black-secondary text-sm mb-2">
            Correo electrónico
          </p>
          <p className="font-semibold text-black-primary">
            luis.matailo@uemfebrescordero.com
          </p>
        </div>
        <div>
          <p className="font-bold text-black-secondary text-sm mb-2">Genero</p>
          <Badge color="orange">Masculino</Badge>
        </div>
        <div>
          <p className="font-bold text-black-secondary text-sm mb-2">Titulo</p>
          <Badge>Ninguno</Badge>
        </div>
        <div>
          <p className="font-bold text-black-secondary text-sm mb-2">
            Teléfono
          </p>
          <p className="font-semibold text-black-primary">+593 98 417 6619</p>
        </div>
      </div>
      <div className="bg-white-primary rounded-primary p-6 flex flex-col gap-7 justify-between  ">
        <div className="flex items-center gap-4 col-span-full">
          <UserLock className="text-blue-primary size-9" />
          <p className="text-blue-primary font-bold text-xl">Seguridad</p>
        </div>
        <div>
          <p className="font-medium text-black-primary">
            Manten tu cuentra protegida cambiando tu contraseña periodicamente.
          </p>
        </div>
        <Button variant="outline">Cambiar contraseña</Button>
      </div>
      <div className="bg-white-primary rounded-primary p-6 flex flex-col gap-7 justify-between  ">
        <div className="flex items-center gap-4 col-span-full">
          <User className="text-blue-primary size-9" />
          <p className="text-blue-primary font-bold text-xl">Perfil</p>
        </div>
        <div>
          <p className="font-medium text-black-primary">
            Actualiza y modifica tus datos básicos y configuraciones para
            mantener tu cuenta actualizada según tus necesidades.
          </p>
        </div>
        <Button>Editar información</Button>
      </div>
      <Alert
        variant="info"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor aspernatur, odio aliquid voluptates aliquam placeat debitis rerum doloribus qui, dolorem ullam nam! Non porro molestiae asperiores, fugiat voluptatem voluptates incidunt?"
      />
    </>
  );
}
