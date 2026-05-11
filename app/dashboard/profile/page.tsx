"use client"

import { Alert } from "@/components/alert";
import { DataUser } from "@/components/data-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { roleBadgeColor } from "@/lib/constants/get-badge-color";
import axios from "axios";
import { IdCard, Key, Lock, User, UserLock } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilePage() {

  const [user, setUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    role: '',
    username: '',
    cdl: '',
    email: '',
    phone: ''
  })

  // console.log(user)

  const getProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setUser(response.data)
    } catch (error: any) {
      console.error(error.response?.data);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);


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
          <DataUser name={`${user.firstName} ${user.lastName}`} id={user.cdl} />
        </div>

        <div>
          <Label>Rango / Rol</Label>
          <Badge color={roleBadgeColor["admin"].color}>{user.role}</Badge>
        </div>
        <div>
          <Label>Correo electrónico</Label>
          <p className="font-semibold text-black-primary">
            {user.email}
          </p>
        </div>
        <div>
          <Label>Código de usuario</Label>
          <p className="font-semibold text-black-primary">
            {user.username}
          </p>
        </div>
        <div>
          <Label>Teléfono</Label>
          <p className="font-semibold text-black-primary">{user.phone}</p>
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


    </>
  );
}
