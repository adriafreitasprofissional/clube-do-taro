"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

const CHAVE_ADIAR = "clube_taro_instalar_depois";
const UM_DIA = 24 * 60 * 60 * 1000;

export default function InstallAppPrompt() {
  const [mostrar, setMostrar] = useState(false);
  const [ehIOS, setEhIOS] = useState(false);
  const [eventoInstalacao, setEventoInstalacao] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Mostrar somente na página principal www.magiaoriente.com.br
    if (window.location.pathname !== "/") {
      return;
    }

    const instalado =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone === true;

    if (instalado) {
      return;
    }

    const userAgent =
      window.navigator.userAgent.toLowerCase();

    const ios =
      /iphone|ipad|ipod/.test(userAgent);

    setEhIOS(ios);

    const adiadoAte = Number(
      localStorage.getItem(CHAVE_ADIAR) || "0"
    );

    if (adiadoAte > Date.now()) {
      return;
    }

    const abrirAviso = window.setTimeout(() => {
      setMostrar(true);
    }, 900);

    function aoPedirInstalacao(event: Event) {
      event.preventDefault();

      setEventoInstalacao(
        event as BeforeInstallPromptEvent
      );

      setMostrar(true);
    }

    window.addEventListener(
      "beforeinstallprompt",
      aoPedirInstalacao
    );

    return () => {
      window.clearTimeout(abrirAviso);

      window.removeEventListener(
        "beforeinstallprompt",
        aoPedirInstalacao
      );
    };
  }, []);

  async function instalarAndroid() {
    if (!eventoInstalacao) {
      return;
    }

    await eventoInstalacao.prompt();

    const escolha =
      await eventoInstalacao.userChoice;

    if (escolha.outcome === "accepted") {
      setMostrar(false);
    }

    setEventoInstalacao(null);
  }

  function agoraNao() {
    localStorage.setItem(
      CHAVE_ADIAR,
      String(Date.now() + UM_DIA)
    );

    setMostrar(false);
  }

  if (!mostrar) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-[30px] border border-[#d7b85c]/25 bg-[linear-gradient(160deg,#1b0d28_0%,#0f0918_58%,#09070f_100%)] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.6)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#e8cb73]/25 bg-[#e8cb73]/10 text-3xl shadow-[0_0_35px_rgba(232,203,115,.12)]">
          ✦
        </div>

        <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-[0.28em] text-[#cdb8ec]">
          Clube do Tarô
        </p>

        <h2 className="mt-2 text-center font-serif text-3xl text-[#f1d88a]">
          Instale o Clube no seu celular
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-[#ded3eb]">
          Tenha acesso rápido ao seu portal,
          direcionamentos e novidades como um aplicativo.
        </p>

        {ehIOS ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="font-bold text-[#f1d88a]">
              No iPhone:
            </p>

            <div className="mt-3 space-y-3 text-sm leading-6 text-[#e4daef]">
              <p>
                <span className="font-bold text-white">1.</span>{" "}
                Abra esta página no Safari.
              </p>

              <p>
                <span className="font-bold text-white">2.</span>{" "}
                Toque no botão Compartilhar
                <span className="ml-1 text-lg">⬆️</span>.
              </p>

              <p>
                <span className="font-bold text-white">3.</span>{" "}
                Escolha <strong>Adicionar à Tela de Início</strong>.
              </p>

              <p>
                <span className="font-bold text-white">4.</span>{" "}
                Toque em <strong>Adicionar</strong>.
              </p>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#aa9ab9]">
              Se abriu pelo WhatsApp, Instagram ou outro aplicativo,
              primeiro escolha “Abrir no Safari”.
            </p>
          </div>
        ) : eventoInstalacao ? (
          <button
            type="button"
            onClick={instalarAndroid}
            className="mt-6 w-full rounded-full bg-[#d8b650] px-5 py-4 text-sm font-extrabold text-[#1b1021] transition hover:brightness-110"
          >
            INSTALAR CLUBE DO TARÔ
          </button>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-[#e4daef]">
            Abra o menu do navegador e escolha
            <strong> “Adicionar à tela inicial” </strong>
            ou
            <strong> “Instalar aplicativo”</strong>.
          </div>
        )}

        <button
          type="button"
          onClick={agoraNao}
          className="mt-4 w-full rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-[#c8b9d8] transition hover:bg-white/5"
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
