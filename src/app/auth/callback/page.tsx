"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/reset-password");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Validando acesso...</p>
    </div>
  );
}