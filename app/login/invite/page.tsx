"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 1. Este componente maneja la lógica y usa el hook
function InviteHandler() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      router.push("/error");
      return;
    }

    const validate = async () => {
      const res = await fetch(`/api/auth/invite?token=${token}`);

      if (res.ok) {
        router.push("/dashboard/profile");
      } else {
        router.push("/error");
      }
    };

    validate();
  }, [params, router]);

  return <p>Activando cuenta...</p>;
}

// 2. La página principal solo envuelve al manejador en Suspense
export default function InvitePage() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <InviteHandler />
    </Suspense>
  );
}
