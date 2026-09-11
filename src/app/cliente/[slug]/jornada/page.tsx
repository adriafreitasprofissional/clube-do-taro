"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  nome: string | null;
  nome_referencia: string | null;
  genero: string | null;
  slug: string;
};

type EstrelaEvento = {
  id: string;
  title: string;
  description: string | null;
  stars: number;
  event_type: string;
  created_at: string;
};

type JornadaResponse = {
  cliente: Cliente;
  eventos: EstrelaEvento[];
};

export default function JornadaDosGuardioesPage() {
  const params = useParams();
  const slug = String(params.slug || "");

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [eventos, setEventos] = useState<EstrelaEvento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [historicoAberto, setHistoricoAberto] = useState(false);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error(
            "Sua sessão expirou. Entre novamente no Clube."
          );
        }

        const resposta = await fetch(
          `/api/jornada?slug=${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const data = (await resposta.json()) as
          | JornadaResponse
          | { error?: string };

        if (!resposta.ok) {
          throw new Error(
            "error" in data && data.error
              ? data.error
              : "Não foi possível carregar sua Jornada."
          );
        }

        const jornada = data as JornadaResponse;

        setCliente(jornada.cliente);
        setEventos(
          Array.isArray(jornada.eventos)
            ? jornada.eventos
            : []
        );
      } catch (err: unknown) {
        setErro(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar sua Jornada."
        );
      } finally {
        setCarregando(false);
      }
    }

    if (slug) {
      carregar();
    }
  }, [slug]);

  const totalEstrelas = useMemo(
    () =>
      eventos.reduce(
        (total, evento) =>
          total + Number(evento.stars || 0),
        0
      ),
    [eventos]
  );

  const metaLua = 10;

  const progresso = Math.min(
    100,
    (totalEstrelas / metaLua) * 100
  );

  const faltamLua = Math.max(
    0,
    metaLua - totalEstrelas
  );

  const nome =
    cliente?.nome_referencia ||
    cliente?.nome?.split(" ")[0] ||
    "Guardião";

  const genero = String(cliente?.genero || "")
    .trim()
    .toLowerCase();

  const ehHomem =
    genero === "homem" ||
    genero === "masculino" ||
    genero === "male";

  const tituloGuardiao = ehHomem
    ? "Guardião"
    : "Guardiã";

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#08070f] p-10 text-center text-[#efe8ff]">
        Preparando sua Jornada...
      </main>
    );
  }

  if (erro || !cliente) {
    return (
      <main className="min-h-screen bg-[#08070f] px-5 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-[28px] border border-rose-300/20 bg-rose-950/10 p-6 text-center">
          <p className="text-lg font-bold text-rose-200">
            Não foi possível abrir sua Jornada.
          </p>

          <p className="mt-2 text-sm leading-6 text-rose-100/70">
            {erro || "Assinante não encontrada."}
          </p>

          <Link
            href={`/cliente/${slug}`}
            className="mt-5 inline-flex rounded-full border border-[#f2d47a]/30 bg-[#f2d47a]/10 px-5 py-3 text-sm font-bold text-[#f2d47a]"
          >
            ← Voltar ao meu Portal
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08070f] text-white">
      <div className="pointer-events-none absolute left-[-140px] top-14 h-[360px] w-[360px] rounded-full bg-[#6c3aa8]/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-120px] top-[28%] h-[420px] w-[420px] rounded-full bg-[#cfae58]/10 blur-[150px]" />
      <div className="pointer-events-none absolute left-[28%] top-[10%] h-40 w-40 rounded-full bg-[#eadbff]/5 blur-[90px]" />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:px-10 md:py-10">
        <Link
          href={`/cliente/${slug}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#d8b45b]/25 bg-[#d8b45b]/5 px-4 py-2.5 text-sm font-bold text-[#f0d688] transition hover:border-[#f0d688]/45 hover:bg-[#f0d688]/10"
        >
          ← Voltar ao meu Portal
        </Link>

        <section className="relative mt-7 overflow-hidden rounded-[34px] border border-[#8b67b2]/28 bg-[radial-gradient(circle_at_top,_rgba(241,218,157,0.08),_transparent_30%),linear-gradient(145deg,#160d23_0%,#100a1d_48%,#0a0812_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-7 md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(186,140,255,0.08),transparent_28%)]" />

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#c9aef1]">
              Clube do Tarô
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-2xl text-[#f2d47a] drop-shadow-[0_0_14px_rgba(242,212,122,0.25)]">
                ✦
              </span>

              <h1 className="text-3xl font-semibold tracking-[0.01em] text-[#ecd79a] sm:text-4xl md:text-[3.2rem]">
  Jornada dos Guardiões
</h1>
             <span className="text-xl text-[#dcbf74] opacity-90">
  ✦
</span>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#ded1ee] sm:text-base">
              {nome}, sua jornada como {tituloGuardiao} começou.
              Cada conquista ilumina novos caminhos,
              experiências e recompensas dentro do
              Clube do Tarô.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-[28px] border border-[#d6b45b]/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d7c0f3]">
                  Minhas Estrelas
                </p>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#f2d47a]/20 bg-[radial-gradient(circle,rgba(242,212,122,0.22),rgba(242,212,122,0.04))] text-3xl shadow-[0_0_28px_rgba(242,212,122,0.10)]">
                    ⭐
                  </div>

                  <div>
                    <div className="text-5xl font-black leading-none text-[#f2d47a]">
                      {totalEstrelas}
                    </div>

                    <p className="mt-2 text-sm text-[#d9cce9]">
                      Sua energia na Jornada está
                      começando a crescer.
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-[#cdbfdd]">
                  Você conquista estrelas ao indicar
                  pessoas e participar das experiências,
                  produtos e serviços de Ádria Freitas.
                </p>
              </div>

              <div className="rounded-[28px] border border-[#8f68b9]/24 bg-[linear-gradient(180deg,rgba(103,63,149,0.16),rgba(255,255,255,0.018))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d9c1f6]">
                  Próxima conquista
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#b893db]/18 bg-[#281638]/65 text-2xl shadow-[0_0_20px_rgba(171,127,220,0.10)]">
                    🌙
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#aa8fc8]">
                      Primeira medalha
                    </p>

                    <h2 className="mt-1 text-2xl font-extrabold text-[#fff1c8]">
                      Medalha da Lua
                    </h2>
                  </div>
                </div>

                {faltamLua > 0 ? (
                  <p className="mt-4 text-sm leading-6 text-[#d9cce9]">
                    Faltam{" "}
                    <span className="font-bold text-[#f2d47a]">
                      {faltamLua} estrelas
                    </span>{" "}
                    para desbloquear sua primeira
                    conquista mística.
                  </p>
                ) : (
                  <p className="mt-4 text-sm font-bold text-[#f2d47a]">
                    Sua Medalha da Lua foi conquistada.
                  </p>
                )}

                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#9a62cf_0%,#d9b96b_100%)] shadow-[0_0_14px_rgba(217,185,107,0.28)] transition-all duration-700"
                    style={{
                      width: `${progresso}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-[#9f8cb5]">
                    Sua evolução
                  </span>

                  <span className="font-bold text-[#d7c0f3]">
                    {totalEstrelas}/{metaLua}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[26px] border border-[#8b67b2]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] p-5">
              <button
                type="button"
                onClick={() =>
                  setHistoricoAberto(!historicoAberto)
                }
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <div className="min-w-0">
                  <p className="font-bold text-[#f2d47a]">
                    ✦ Meu histórico de estrelas
                  </p>

                  <p className="mt-1 text-sm text-[#cdbfdd]">
                    Veja como você conquistou suas
                    estrelas.
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-[#d8b45b]/18 bg-[#d8b45b]/5 px-3 py-2 text-xs font-bold text-[#ead08a]">
                  {historicoAberto
                    ? "▲ Fechar"
                    : "▼ Abrir"}
                </span>
              </button>

              {historicoAberto && (
                <div className="mt-5 space-y-3">
                  {eventos.length === 0 ? (
                    <div className="rounded-2xl border border-white/6 bg-white/[0.025] p-4 text-sm text-[#cdbfdd]">
                      Sua primeira estrela ainda está
                      esperando por você.
                    </div>
                  ) : (
                    eventos.map((evento) => (
                      <div
                        key={evento.id}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-white/7 bg-white/[0.025] p-4"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-[#f6efff]">
                            {evento.title}
                          </p>

                          {evento.description && (
                            <p className="mt-1 text-sm leading-6 text-[#cdbfdd]">
                              {evento.description}
                            </p>
                          )}

                          <p className="mt-2 text-xs text-[#8f819f]">
                            {new Date(
                              evento.created_at
                            ).toLocaleDateString("pt-BR")}
                          </p>
                        </div>

                        <div className="shrink-0 rounded-full border border-[#d8b45b]/15 bg-[#d8b45b]/7 px-3 py-2 font-black text-[#f2d47a]">
                          +{evento.stars} ⭐
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-[#8b67b2]/16 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-[#a982d0]/30">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b993d7]/16 bg-[#a576cf]/8 text-2xl">
                  🏆
                </div>

                <p className="mt-4 font-bold text-[#f6efff]">
                  Ranking
                </p>

                <p className="mt-2 text-sm leading-6 text-[#a998ba]">
                  Veja sua posição entre os Guardiões.
                </p>
              </div>

              <div className="rounded-[24px] border border-[#8b67b2]/16 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-[#a982d0]/30">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8b45b]/14 bg-[#d8b45b]/6 text-2xl">
                  🎁
                </div>

                <p className="mt-4 font-bold text-[#f6efff]">
                  Prêmios
                </p>

                <p className="mt-2 text-sm leading-6 text-[#a998ba]">
                  Conquistas especiais esperam por você.
                </p>
              </div>

              <div className="rounded-[24px] border border-[#8b67b2]/16 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-[#a982d0]/30">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8b45b]/14 bg-[#d8b45b]/6 text-2xl">
                  🔑
                </div>

                <p className="mt-4 font-bold text-[#f6efff]">
                  Liberações
                </p>

                <p className="mt-2 text-sm leading-6 text-[#a998ba]">
                  Sua Jornada abrirá conteúdos e
                  experiências especiais.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#d8b45b]/14 bg-[#d8b45b]/[0.035] px-5 py-4">
              <p className="text-sm leading-6 text-[#cdbfdd]">
                ✦ A Jornada dos Guardiões está apenas
                começando. Novas medalhas, personagens,
                prêmios e liberações serão revelados ao
                longo do caminho.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
