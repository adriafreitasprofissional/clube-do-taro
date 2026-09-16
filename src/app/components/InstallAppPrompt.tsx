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

const UM_DIA = 24 * 60 * 60 * 1000;

export default function InstallAppPrompt() {
  const [mostrar, setMostrar] = useState(false);
  const [ehIOS, setEhIOS] = useState(false);
  const [eventoInstalacao, setEventoInstalacao] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [marca, setMarca] =
    useState<"clube" | "terapia" | null>(null);

  useEffect(() => {
    const host = window.location.hostname.toLowerCase();
    const path = window.location.pathname;

    const dominioClube =
      host === "magiaoriente.com.br" ||
      host === "www.magiaoriente.com.br";

    const dominioTerapia =
      host === "adriafreitasterapeuta.com.br" ||
      host === "www.adriafreitasterapeuta.com.br";

    const paginaClube =
      dominioClube && path === "/";

    const paginaTerapia =
      dominioTerapia &&
      (path === "/" || path === "/terapia");

    if (!paginaClube && !paginaTerapia) {
      return;
    }

    const marcaAtual =
      paginaTerapia ? "terapia" : "clube";

    setMarca(marcaAtual);

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

    const chaveAdiar =
      marcaAtual === "terapia"
        ? "terapia_em_dia_instalar_depois"
        : "clube_taro_instalar_depois";

    const adiadoAte = Number(
      localStorage.getItem(chaveAdiar) || "0"
    );

    if (adiadoAte > Date.now()) {
      return;
    }

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

    // No iPhone não existe beforeinstallprompt.
    // Só nele mostramos a orientação manual.
    let timerIOS: number | undefined;

    if (ios) {
      timerIOS = window.setTimeout(() => {
        setMostrar(true);
      }, 900);
    }

    return () => {
      if (timerIOS) {
        window.clearTimeout(timerIOS);
      }

      window.removeEventListener(
        "beforeinstallprompt",
        aoPedirInstalacao
      );
    };
  }, []);

  async function instalar() {
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
    if (!marca) {
      setMostrar(false);
      return;
    }

    const chaveAdiar =
      marca === "terapia"
        ? "terapia_em_dia_instalar_depois"
        : "clube_taro_instalar_depois";

    localStorage.setItem(
      chaveAdiar,
      String(Date.now() + UM_DIA)
    );

    setMostrar(false);
  }

  if (!mostrar || !marca) {
    return null;
  }

  const terapia =
    marca === "terapia";

  if (terapia) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm sm:items-center">
        <div className="w-full max-w-md overflow-hidden rounded-[30px] border border-[#C9D5C1] bg-[#F7F1E4] p-6 text-[#4F5E4A] shadow-[0_30px_100px_rgba(0,0,0,.35)]">
          <img
            src="/terapia-icon-192-v2.png"
            alt="Terapia em Dia"
            className="mx-auto h-20 w-20 rounded-full"
          />

          <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-[#8AA27A]">
            Terapia em Dia
          </p>

          <h2 className="mt-2 text-center text-2xl font-extrabold text-[#5E7357]">
            Quer instalar o aplicativo?
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-[#6C8465]">
            Assim você acessa seu espaço terapêutico direto pela tela do celular.
          </p>

          {ehIOS ? (
            <div className="mt-6 rounded-2xl border border-[#DCCFB8] bg-white p-4 text-sm leading-6 text-[#6C8465]">
              No iPhone, toque em
              <strong> Compartilhar </strong>
              e depois em
              <strong> “Adicionar à Tela de Início”</strong>.
            </div>
          ) : (
            <button
              type="button"
              onClick={instalar}
              className="mt-6 w-full rounded-xl bg-[#5E7357] px-5 py-4 text-sm font-extrabold text-white shadow transition hover:bg-[#4F6548]"
            >
              INSTALAR APLICATIVO
            </button>
          )}

          <button
            type="button"
            onClick={agoraNao}
            className="mt-4 w-full rounded-xl border border-[#C8B8A8] px-5 py-3 text-sm font-semibold text-[#6C8465] transition hover:bg-[#E9E4D7]"
          >
            Agora não
          </button>
        </div>
      </div>
    );
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
          Tenha acesso rápido ao seu portal, direcionamentos e novidades como um aplicativo.
        </p>

        {ehIOS ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="font-bold text-[#f1d88a]">
              No iPhone:
            </p>

            <div className="mt-3 space-y-3 text-sm leading-6 text-[#e4daef]">
              <p>1. Abra esta página no Safari.</p>
              <p>2. Toque no botão Compartilhar.</p>
              <p>3. Escolha “Adicionar à Tela de Início”.</p>
              <p>4. Toque em “Adicionar”.</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={instalar}
            className="mt-6 w-full rounded-full bg-[#d8b650] px-5 py-4 text-sm font-extrabold text-[#1b1021] transition hover:brightness-110"
          >
            INSTALAR CLUBE DO TARÔ
          </button>
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
