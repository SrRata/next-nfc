"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function InvitePage() {
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