"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";

type Registro = {
  id: string;
  title: string;
  occurred_at: string;
  video_file_id: string | null;
  report_adria: string | null;
  report_estella: string | null;
  pdf_file_id: string | null;
  pdf_file_name: string | null;
  pdf_download_url: string | null;
};

type ArquivoAberto = {
  tipo: "video" | "pdf";
  titulo: string;
  fileId: string;
} | null;

function nomeDoMes(dataIso: string) {
  const data = new Date(dataIso);

  const nome = data.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

function previewDrive(fileId: string) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export default function MentoriasDaAssinantePage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "");

  const [nome, setNome] = useState("");
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [arquivoAberto, setArquivoAberto] =
    useState<ArquivoAberto>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          `/api/mentorias?slug=${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Não foi possível carregar suas mentorias."
          );
        }

        setNome(data.cliente?.nome || "");
        setRegistros(data.registros || []);
      } catch (error: unknown) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar mentorias."
        );
      } finally {
        setCarregando(false);
      }
    }

    if (slug) {
      carregar();
    }
  }, [router, slug]);

  const meses = useMemo(() => {
    const grupos = new Map<string, Registro[]>();

    registros.forEach((registro) => {
      const mes = nomeDoMes(registro.occurred_at);

      grupos.set(mes, [
        ...(grupos.get(mes) || []),
        registro,
      ]);
    });

    return Array.from(grupos.entries());
  }, [registros]);

  return (
    <main className="min-h-screen bg-[#08070f] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/cliente/${slug}`}
          className="inline-flex rounded-xl border border-yellow-400/30 bg-yellow-500/5 px-4 py-2 text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/10"
        >
          ← Voltar ao Portal
        </Link>

        <header className="mt-8 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#19172f] via-[#130e27] to-yellow-500/5 p-7 shadow-2xl md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-300">
            Seu espaço de acompanhamento
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-yellow-300 md:text-4xl">
            🎥 Minhas Mentorias Gravadas
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-purple-100">
            {nome ? `${nome}, aqui` : "Aqui"} você pode
            rever seus encontros, consultar os pareceres e
            acompanhar cada etapa da sua mentoria.
          </p>

          <p className="mt-4 rounded-2xl border border-yellow-400/15 bg-black/20 px-4 py-3 text-sm leading-6 text-purple-200">
            Este conteúdo é pessoal e confidencial. Os vídeos
            ficam disponíveis somente para a conta autorizada.
          </p>
        </header>

        {carregando ? (
          <div className="mt-8 rounded-2xl border border-purple-500/20 bg-[#19172f] p-8 text-center text-purple-200">
            Carregando suas mentorias...
          </div>
        ) : erro ? (
          <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-950/30 p-6 text-red-200">
            {erro}
          </div>
        ) : meses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-purple-500/20 bg-[#19172f] p-8 text-center">
            <p className="text-xl font-bold text-yellow-300">
              Seu espaço está preparado.
            </p>

            <p className="mt-3 text-purple-200">
              Assim que uma mentoria for publicada, ela
              aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {meses.map(([mes, itens]) => (
              <section key={mes}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xl text-yellow-300">
                    ✦
                  </span>

                  <h2 className="text-2xl font-extrabold text-yellow-300">
                    {mes}
                  </h2>
                </div>

                <div className="grid gap-5">
                  {itens.map((registro) => (
                    <article
                      key={registro.id}
                      className="rounded-3xl border border-purple-500/25 bg-[#19172f] p-6 shadow-xl md:p-8"
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                            Mentoria individual
                          </p>

                          <h3 className="mt-2 text-xl font-extrabold text-white md:text-2xl">
                            {registro.title}
                          </h3>

                          <p className="mt-2 text-sm text-purple-300">
                            {new Date(
                              registro.occurred_at
                            ).toLocaleString("pt-BR", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>

                        {registro.video_file_id && (
                          <button
                            type="button"
                            onClick={() =>
                              setArquivoAberto({
                                tipo: "video",
                                titulo: registro.title,
                                fileId:
                                  registro.video_file_id!,
                              })
                            }
                            className="shrink-0 rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-5 py-3 font-bold text-yellow-200 transition hover:bg-yellow-500/20"
                          >
                            ▶ Assistir à mentoria
                          </button>
                        )}
                      </div>

                      {(registro.report_adria ||
                        registro.report_estella) && (
                        <div className="mt-7 grid gap-4 md:grid-cols-2">
                          {registro.report_adria && (
                            <div className="rounded-2xl border border-purple-400/15 bg-black/20 p-5">
                              <h4 className="font-extrabold text-yellow-300">
                                🌹 Parecer da Ádria
                              </h4>

                              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-purple-100">
                                {registro.report_adria}
                              </p>
                            </div>
                          )}

                          {registro.report_estella && (
                            <div className="rounded-2xl border border-purple-400/15 bg-black/20 p-5">
                              <h4 className="font-extrabold text-yellow-300">
                                🔮 Parecer da Estella
                              </h4>

                              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-purple-100">
                                {registro.report_estella}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      {registro.pdf_download_url ? (
                        <a
                          href={
                            registro.pdf_download_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-5 py-3 text-sm font-bold text-yellow-200 transition hover:bg-yellow-500/20"
                        >
                          📄 Baixar relatório em PDF
                        </a>
                      ) : registro.pdf_file_id ? (
                        <button
                          type="button"
                          onClick={() =>
                            setArquivoAberto({
                              tipo: "pdf",

                              titulo:
                                `Relatório — ${registro.title}`,

                              fileId:
                                registro.pdf_file_id!,
                            })
                          }
                          className="mt-5 rounded-xl border border-purple-400/30 bg-purple-700/20 px-5 py-3 text-sm font-bold text-purple-100 transition hover:bg-purple-700/35"
                        >
                          📄 Visualizar relatório completo
                        </button>
                      ) : null}
                      
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {arquivoAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setArquivoAberto(null)}
        >
          <div
            className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-yellow-400/25 bg-[#100d24] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-purple-500/20 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                  Conteúdo privado
                </p>

                <h2 className="mt-1 font-extrabold text-yellow-300">
                  {arquivoAberto.titulo}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setArquivoAberto(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold text-white"
              >
                Fechar
              </button>
            </div>

            <div className="relative min-h-0 flex-1 bg-black">
              <iframe
                key={arquivoAberto.fileId}
                src={previewDrive(arquivoAberto.fileId)}
                title={arquivoAberto.titulo}
                allow="autoplay; fullscreen"
                allowFullScreen
                className={
                  arquivoAberto.tipo === "video"
                    ? "h-[72vh] w-full"
                    : "h-[78vh] w-full bg-white"
                }
              />

              {arquivoAberto.tipo === "video" && nome && (
                <div className="pointer-events-none absolute bottom-5 right-5 rounded-lg bg-black/55 px-3 py-2 text-xs font-bold text-white/70 backdrop-blur-sm">
                  Conteúdo exclusivo de {nome}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}