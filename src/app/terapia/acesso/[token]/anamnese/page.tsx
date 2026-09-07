"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import AnamneseTRGWizard from "../../../components/AnamneseTRGWizard";

type DadosAcesso = {
  cliente: {
    id: string;
    nome: string;
    nome_completo: string;
    email: string;
  };

  professional: string;
  ja_preenchida: boolean;
  submitted_at: string | null;
};

export default function AnamnesePage() {
  const params = useParams();

  const token = String(
    params?.token || ""
  );

  const [dados, setDados] =
    useState<DadosAcesso | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    window.localStorage.setItem(
      "terapia_em_dia_access_token",
      token
    );

    async function carregar() {
      try {
        const response = await fetch(
          `/api/terapia/anamnese?token=${encodeURIComponent(
            token
          )}`,
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Não foi possível abrir a anamnese."
          );
        }

        setDados(data);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível abrir a anamnese."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [token]);

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-8 text-center text-[#6C8465]">
        Preparando sua anamnese...
      </main>
    );
  }

  if (erro || !dados) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-8">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-7 text-center text-red-700">
          {erro ||
            "Não foi possível abrir a anamnese."}
        </div>
      </main>
    );
  }

  if (dados.ja_preenchida) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] px-5 py-12 text-[#5E7357]">
        <div className="mx-auto max-w-xl">
          <div className="rounded-[32px] border border-emerald-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
              ✓
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Recebida com sucesso
            </p>

            <h1 className="mt-3 text-3xl font-extrabold">
              Obrigada, {dados.cliente.nome}.
            </h1>

            <p className="mt-4 text-sm leading-7 text-[#6C8465]">
              Sua anamnese já foi recebida pela
              Ádria e ficará vinculada ao seu
              acompanhamento.
            </p>

            <Link
              href={`/terapia/acesso/${token}`}
              className="mt-7 inline-flex rounded-xl bg-[#8AA27A] px-6 py-3 text-sm font-bold text-white shadow"
            >
              Voltar ao meu portal
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-4 py-8 text-[#5E7357] md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/terapia/acesso/${token}`}
          className="mb-6 inline-flex text-sm font-bold text-[#8AA27A]"
        >
          ← Voltar ao meu portal
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#8AA27A] font-black text-white shadow-lg">
            TE
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#8AA27A]">
            Terapia em Dia
          </p>

          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
            Anamnese Inicial
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6C8465]">
            Este formulário vai ajudar Ádria a
            compreender melhor seu momento atual,
            sua história e os objetivos que deseja
            trabalhar no acompanhamento.
          </p>
        </div>

        <AnamneseTRGWizard
          token={token}
          nomeCliente={
            dados.cliente.nome
          }
          emailCliente={
            dados.cliente.email
          }
        />
      </div>
    </main>
  );
}
