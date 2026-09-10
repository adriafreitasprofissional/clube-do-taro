"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { AgendaAtendimento } from "../../components/agenda-types";

const campo =
  "w-full rounded-xl border border-purple-500/30 bg-[#1d0023] p-4 text-white placeholder:text-purple-300/60 outline-none focus:border-yellow-300/50";

export default function AtendimentoPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params?.id || "");

  const [item, setItem] =
    useState<AgendaAtendimento | null>(null);

  const [privateNotes, setPrivateNotes] =
    useState("");
  const [evolution, setEvolution] =
    useState("");
  const [activity, setActivity] =
    useState("");

    const [sessionTitle, setSessionTitle] =
  useState("");
type ContentLink = {
  title: string;
  url: string;
};

const [contentLinks, setContentLinks] =
  useState<ContentLink[]>([
    {
      title: "",
      url: "",
    },
  ]);
const [clientReport, setClientReport] =
  useState("");
const [publishedToClient, setPublishedToClient] =
  useState(false);
  const [carregando, setCarregando] =
    useState(true);
  const [salvando, setSalvando] =
    useState(false);
  const [erro, setErro] =
    useState<string | null>(null);

  async function token() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error(
        "Sessão administrativa expirada. Entre novamente."
      );
    }

    return session.access_token;
  }

  async function carregar() {
    setCarregando(true);
    setErro(null);

    try {
      const accessToken = await token();

      const response = await fetch(
        `/api/admin/agenda?id=${encodeURIComponent(
          id
        )}`,
        {
          cache: "no-store",
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Atendimento não encontrado."
        );
      }

      const atendimento =
        data.atendimento as AgendaAtendimento;

      setItem(atendimento);
      setPrivateNotes(
        atendimento.private_session_notes ||
          ""
      );
      setEvolution(
        atendimento.evolution_summary || ""
      );
      setActivity(
        atendimento.client_activity || ""
      );
     setSessionTitle(
  atendimento.session_title || ""
);
const linksSalvos =
  Array.isArray(atendimento.content_links)
    ? atendimento.content_links
    : [];

if (linksSalvos.length > 0) {
  setContentLinks(linksSalvos);
} else if (atendimento.recording_url) {
  setContentLinks([
    {
      title: "Conteúdo da sessão",
      url: atendimento.recording_url,
    },
  ]);
} else {
  setContentLinks([
    {
      title: "",
      url: "",
    },
  ]);
}
setClientReport(
  atendimento.client_report || ""
);
setPublishedToClient(
  atendimento.published_to_client === true
);

    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar o atendimento."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (id) {
      carregar();
    }
  }, [id]);

  async function salvar(
    finalizar = false
  ) {
    if (!item) return;

    setSalvando(true);
    setErro(null);

    try {
      const accessToken = await token();

      const response = await fetch(
        "/api/admin/agenda",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id: item.id,
            private_session_notes:
              privateNotes,
            evolution_summary: evolution,
            client_activity: activity,
            session_title: sessionTitle,
content_links: contentLinks
  .map((link) => ({
    title: link.title.trim(),
    url: link.url.trim(),
  }))
  .filter((link) => link.url),
client_report: clientReport,
published_to_client: publishedToClient,
            ...(finalizar
              ? {
                  status: "realizado",
                  completed_at:
                    new Date().toISOString(),
                }
              : {}),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível salvar a sessão."
        );
      }

      setItem(data.atendimento);

      if (finalizar) {
        router.push("/admin/agenda");
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a sessão."
      );
    } finally {
      setSalvando(false);
    }
  }
function adicionarLink() {
  setContentLinks((anterior) => [
    ...anterior,
    {
      title: "",
      url: "",
    },
  ]);
}

function atualizarLink(
  index: number,
  campo: "title" | "url",
  valor: string
) {
  setContentLinks((anterior) =>
    anterior.map((link, i) =>
      i === index
        ? {
            ...link,
            [campo]: valor,
          }
        : link
    )
  );
}

function removerLink(index: number) {
  setContentLinks((anterior) => {
    if (anterior.length === 1) {
      return [
        {
          title: "",
          url: "",
        },
      ];
    }

    return anterior.filter(
      (_, i) => i !== index
    );
  });
}
  if (carregando) {
    return (
      <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-6 text-purple-300">
        Carregando atendimento...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-200">
        {erro || "Atendimento não encontrado."}
      </div>
    );
  }

  const data = new Date(item.scheduled_at);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              router.push("/admin/agenda")
            }
            className="mb-3 text-sm font-medium text-yellow-300 hover:text-yellow-200"
          >
            ← Voltar para Agenda
          </button>

          <p className="text-sm text-yellow-300">
            Sessão em atendimento
          </p>

          <h1 className="mt-1 text-3xl font-semibold text-purple-100">
            {item.client_name}
          </h1>

          <p className="mt-2 text-sm text-purple-300">
            {item.service_type} ·{" "}
            {data.toLocaleDateString(
              "pt-BR"
            )}{" "}
            às{" "}
            {data.toLocaleTimeString(
              "pt-BR",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}{" "}
            · {item.duration_minutes} min
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {item.meet_url ? (
            <a
              href={item.meet_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
            >
              Entrar no Google Meet
            </a>
          ) : (
            <div className="rounded-xl border border-yellow-300/30 bg-yellow-300/5 px-4 py-3 text-sm text-yellow-200">
              Adicione o link do Meet em
              Editar atendimento.
            </div>
          )}
        </div>
      </div>

      {erro && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {erro}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
          <p className="text-xs uppercase tracking-wide text-purple-300">
            Cliente
          </p>
          <p className="mt-2 font-semibold text-white">
            {item.client_name}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
          <p className="text-xs uppercase tracking-wide text-purple-300">
            Profissional
          </p>
          <p className="mt-2 font-semibold text-white">
            {item.professional}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
          <p className="text-xs uppercase tracking-wide text-purple-300">
            Situação
          </p>
          <p className="mt-2 capitalize font-semibold text-white">
            {item.status}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
          <div>
            <h2 className="text-lg font-semibold text-yellow-300">
              Anotações privadas
            </h2>
            <p className="mt-1 text-xs text-purple-300">
              Visíveis somente para a terapeuta.
            </p>
          </div>

          <textarea
            value={privateNotes}
            onChange={(e) =>
              setPrivateNotes(e.target.value)
            }
            rows={10}
            placeholder="Registre observações privadas da sessão..."
            className={`${campo} mt-4`}
          />
        </section>

        <section className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
          <div>
            <h2 className="text-lg font-semibold text-yellow-300">
              Evolução da sessão
            </h2>
            <p className="mt-1 text-xs text-purple-300">
              Síntese profissional do encontro.
            </p>
          </div>

          <textarea
            value={evolution}
            onChange={(e) =>
              setEvolution(e.target.value)
            }
            rows={10}
            placeholder="Registre a evolução percebida..."
            className={`${campo} mt-4`}
          />
        </section>
      </div>
<section className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
  <h2 className="text-lg font-semibold text-yellow-300">
    Conteúdo para o portal da cliente
  </h2>

  <p className="mt-1 text-xs text-purple-300">
    Relatório, vídeos e materiais que poderão aparecer em Minha Jornada.
  </p>

  <div className="mt-5 space-y-5">
    {/* TÍTULO */}
    <div>
      <label className="mb-2 block text-sm text-purple-300">
        Título da sessão
      </label>

      <input
        value={sessionTitle}
        onChange={(e) =>
          setSessionTitle(e.target.value)
        }
        placeholder="Ex.: Memórias da infância"
        className={campo}
      />
    </div>

    {/* LINKS */}
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label className="block text-sm font-semibold text-purple-200">
            Links e conteúdos da sessão
          </label>

          <p className="mt-1 text-xs text-purple-300/60">
            Adicione gravações, mini palestras, vídeos ou outros materiais.
          </p>
        </div>

        <button
          type="button"
          onClick={adicionarLink}
          className="rounded-xl border border-[#aebe79]/40 bg-[#aebe79]/10 px-4 py-2 text-xs font-semibold text-[#cbd69d] transition hover:bg-[#aebe79]/20"
        >
          + Adicionar outro link
        </button>
      </div>

      <div className="space-y-3">
        {contentLinks.map((link, index) => (
          <div
            key={index}
            className="rounded-xl border border-purple-500/25 bg-[#1d0023] p-4"
          >
            <div className="grid gap-3 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
              <div>
                <label className="mb-2 block text-xs text-purple-300">
                  Nome do conteúdo
                </label>

                <input
                  value={link.title}
                  onChange={(e) =>
                    atualizarLink(
                      index,
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="Ex.: Memórias da infância"
                  className={campo}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-purple-300">
                  Link
                </label>

                <input
                  value={link.url}
                  onChange={(e) =>
                    atualizarLink(
                      index,
                      "url",
                      e.target.value
                    )
                  }
                  placeholder="https://drive.google.com/..."
                  className={campo}
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  removerLink(index)
                }
                className="rounded-xl border border-red-400/30 px-4 py-3 text-xs font-semibold text-red-300 transition hover:bg-red-400/10"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* RELATÓRIO */}
    <div>
      <label className="mb-2 block text-sm text-purple-300">
        Relatório para a cliente
      </label>

      <textarea
        value={clientReport}
        onChange={(e) =>
          setClientReport(e.target.value)
        }
        rows={10}
        placeholder="Escreva aqui o relatório que será disponibilizado para a cliente..."
        className={campo}
      />
    </div>

    {/* PUBLICAÇÃO */}
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-purple-500/30 bg-[#1d0023] p-4">
      <input
        type="checkbox"
        checked={publishedToClient}
        onChange={(e) =>
          setPublishedToClient(
            e.target.checked
          )
        }
        className="h-4 w-4"
      />

      <div>
        <p className="text-sm font-semibold text-white">
          Publicar no portal da cliente
        </p>

        <p className="mt-1 text-xs text-purple-300">
          Quando marcado, este conteúdo poderá aparecer em Minha Jornada.
        </p>
      </div>
    </label>
  </div>
</section>

<section className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
  <h2 className="text-lg font-semibold text-yellow-300">
    Orientação / atividade para a cliente
  </h2>

  <p className="mt-1 text-xs text-purple-300">
    Recado, exercício ou orientação para realizar até o próximo encontro.
  </p>

  <textarea
    value={activity}
    onChange={(e) =>
      setActivity(e.target.value)
    }
    rows={5}
    placeholder="Escreva uma orientação, atividade ou recado para a cliente..."
    className={`${campo} mt-4`}
  />
</section>
      
          
      <div className="flex flex-col gap-3 border-t border-purple-500/20 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => salvar(false)}
          disabled={salvando}
          className="rounded-xl border border-purple-500/40 px-5 py-3 text-sm font-semibold text-purple-100 transition hover:bg-white/5 disabled:opacity-50"
        >
          {salvando
            ? "Salvando..."
            : "Salvar sessão"}
        </button>

        <button
          type="button"
          onClick={() => salvar(true)}
          disabled={salvando}
          className="rounded-xl bg-yellow-300 px-5 py-3 text-sm font-semibold text-purple-950 transition hover:bg-yellow-200 disabled:opacity-60"
        >
          Finalizar sessão
        </button>
      </div>
    </div>
  );
}
