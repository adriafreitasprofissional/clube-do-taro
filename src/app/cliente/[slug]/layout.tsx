"use client";

import { useEffect, useRef } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

const TEMPO_FORA_PARA_VOLTAR_AO_PORTAL =
  30 * 60 * 1000;

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const slug = String(params.slug || "");
  const ficouOcultoEm = useRef<number | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const portalPrincipal = `/cliente/${slug}`;
    const chave = `clube_portal_visto_${slug}`;

    if (pathname === portalPrincipal) {
      sessionStorage.setItem(chave, "sim");
      return;
    }

    const jaPassouPeloPortal =
      sessionStorage.getItem(chave) === "sim";

    if (!jaPassouPeloPortal) {
      router.replace(portalPrincipal);
    }
  }, [pathname, router, slug]);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const portalPrincipal = `/cliente/${slug}`;

    function aoMudarVisibilidade() {
      if (document.visibilityState === "hidden") {
        ficouOcultoEm.current = Date.now();
        return;
      }

      if (
        document.visibilityState === "visible" &&
        ficouOcultoEm.current
      ) {
        const tempoFora =
          Date.now() - ficouOcultoEm.current;

        ficouOcultoEm.current = null;

        if (
          tempoFora >=
            TEMPO_FORA_PARA_VOLTAR_AO_PORTAL &&
          window.location.pathname !==
            portalPrincipal
        ) {
          router.replace(portalPrincipal);
        }
      }
    }

    document.addEventListener(
      "visibilitychange",
      aoMudarVisibilidade
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        aoMudarVisibilidade
      );
    };
  }, [router, slug]);

  return children;
}
