"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  nome: string | null;
  nome_referencia: string | null;
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

export default function JornadaDosGuardioesPage() {
  const params = useParams();
  const slug = String(params.slug || "");

  const [cliente, setCliente] =
    useState<Cliente | null>(null);

  const [eventos, setEventos] =
    useState<EstrelaEvento[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [historicoAberto, setHistoricoAberto] =
    useState(false);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);

      const { data: clienteData, error: clienteError } =
        await supabase
          .from("club_clients")
          .select(
            "id, nome, nome_referencia, slug"
          )
          .eq("slug", slug)
          .maybeSingle();

      if (clienteError || !clienteData) {
        console.error(
          "Erro ao carregar Guardião:",
          clienteError
        );

        setCarregando(false);
        return;
      }

      setCliente(clienteData);

      const { data: estrelasData, error: estrelasError } =
        await supabase
          .from("guardian_star_events")
          .select(
            "id, title, description, stars, event_type, created_at"
          )
          .eq("client_id", clienteData.id)
          .eq("visible_to_client", true)
          .order("created_at", {
            ascending: false,
          });

      if (estrelasError) {
        console.error(
          "Erro ao carregar estrelas:",
          estrelasError
        );
      }

      setEventos(
        (estrelasData || []) as EstrelaEvento[]
      );

      setCarregando(false);
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

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#08070f] p-10 text-center text-white">
        Preparando sua Jornada...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08070f] text-white">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-purple-700/20 blur-[110px]" />

      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-yellow-500/10 blur-[130px]" />

      <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
        <Link
          href={`/cliente/${slug}`}
          className="inline-flex rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm font-bold text-yellow-300"
        >
          ← Voltar ao meu Portal
        </Link>

        <section className="mt-8 overflow-hidden rounded-[32px] border border-yellow-500/20 bg-gradient-to-br from-[#20102f] via-[#100d24] to-[#08070f] p-6 shadow-[0_0_70px_rgba(126,34,206,0.15)] md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-purple-300">
            Clube do Tarô
          </p>

          <h1 className="mt-3 text-3xl font-black text-yellow-300 md:text-5xl">
            ✦ Jornada dos Guardiões ✦
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-purple-100">
            {nome}, sua jornada dentro do Clube
            começou. Cada conquista abre novos
            caminhos, experiências e recompensas.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-yellow-500/20 bg-black/20 p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-yellow-200/70">
                Minhas Estrelas
              </p>

              <div className="mt-3 text-5xl font-black text-yellow-300">
                ⭐ {totalEstrelas}
              </div>

              <p className="mt-3 text-sm leading-6 text-purple-200">
                Você conquista estrelas ao indicar
                pessoas e participar das experiências,
                produtos e serviços de Ádria Freitas.
              </p>
            </div>

            <div className="rounded-3xl border border-purple-400/20 bg-purple-950/20 p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-purple-300">
                Próxima conquista
              </p>

              <div className="mt-3 text-2xl font-black text-white">
                🌙 Medalha da Lua
              </div>

              {faltamLua > 0 ? (
                <p className="mt-2 text-sm text-purple-200">
                  Faltam {faltamLua} estrelas para
                  desbloquear sua primeira medalha.
                </p>
              ) : (
                <p className="mt-2 font-bold text-yellow-300">
                  Medalha conquistada!
                </p>
              )}

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-yellow-300 transition-all duration-700"
                  style={{
                    width: `${progresso}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-right text-xs text-purple-300">
                {totalEstrelas}/{metaLua}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-purple-500/20 bg-black/20 p-5">
            <button
              type="button"
              onClick={() =>
                setHistoricoAberto(
                  !historicoAberto
                )
              }
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <div>
                <p className="font-bold text-yellow-300">
                  ⭐ Meu histórico de estrelas
                </p>

                <p className="mt-1 text-sm text-purple-200">
                  Veja como você conquistou suas
                  estrelas.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-yellow-500/20 px-3 py-2 text-xs font-bold text-yellow-300">
                {historicoAberto
                  ? "▲ Fechar"
                  : "▼ Abrir"}
              </span>
            </button>

            {historicoAberto && (
              <div className="mt-5 space-y-3">
                {eventos.length === 0 ? (
                  <div className="rounded-2xl bg-white/5 p-4 text-sm text-purple-200">
                    Sua primeira estrela ainda está
                    esperando por você.
                  </div>
                ) : (
                  eventos.map((evento) => (
                    <div
                      key={evento.id}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {evento.title}
                        </p>

                        {evento.description && (
                          <p className="mt-1 text-sm text-purple-200">
                            {evento.description}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-white/40">
                          {new Date(
                            evento.created_at
                          ).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-full bg-yellow-500/10 px-3 py-2 font-black text-yellow-300">
                        +{evento.stars} ⭐
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-3xl">🏆</div>
              <p className="mt-3 font-bold">
                Ranking
              </p>
              <p className="mt-1 text-sm text-white/40">
                Em breve
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-3xl">🎁</div>
              <p className="mt-3 font-bold">
                Prêmios
              </p>
              <p className="mt-1 text-sm text-white/40">
                Em breve
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-3xl">🔑</div>
              <p className="mt-3 font-bold">
                Liberações
              </p>
              <p className="mt-1 text-sm text-white/40">
                Sua jornada abrirá novos caminhos.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}