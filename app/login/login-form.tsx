"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InternalLink } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IconAlertCircle } from "@tabler/icons-react";
import { toast } from "sonner";

export function LoginForm() {

  const [credentials, setCredentials] = useState(
    {
      user: "",
      password: ""
    }
  )

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false)
    setCredentials(
      {
        ...credentials,
        [e.target.name]: e.target.value
      }
    )

  };

  const [error, setError] = useState(false)

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log(credentials);
  //   const response = await axios.post('/api/auth/login', credentials);

  //   if (response.status === 200) {
  //     router.push('/dashboard')
  //   } else {
  //     setError(true)
  //   }

  //   console.log(response);
  // }



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', credentials);

      if (response.status === 200) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Credenciales incorrectas`)
      setError(true);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="bg-white-primary rounded-primary w-full p-8 flex flex-col gap-8">

      {/* {
        error && (
          <div className="bg-red-secondary border border-red-primary/60 flex items-center gap-3 px-4 py-2 rounded-primary">
            <IconAlertCircle className="text-red-primary" />
            <p className="text-red-primary font-medium">Campos incorrectos</p>
          </div>

        )
      } */}

      <div className="flex flex-col w-full gap-5">
        <div className="flex flex-col gap-4">
          <Label htmlFor="user">Usuario o Correo</Label>
          <Input
            id="user"
            type="text"
            name="user"
            onChange={handleChange}
            placeholder="Ej: usuario@uemfebrescordero.com"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Inserte su contraseña"
          />
        </div>
      </div>
      <div className="flex flex-col w-full gap-5 items-center">
        <Button className="w-full">
          Ingresar
          <ChevronRight />
        </Button>
        <InternalLink href="/">¿Olvidó su contraseña?</InternalLink>
      </div>
    </form>
  );
}
