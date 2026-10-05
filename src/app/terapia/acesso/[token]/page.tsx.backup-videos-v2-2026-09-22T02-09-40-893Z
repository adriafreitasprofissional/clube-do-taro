"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { jsPDF } from "jspdf";
import { supabase } from "@/lib/supabase";

type ProximoAtendimento = {
  id: string;
  service_type: string;
  professional: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  meet_url: string | null;
};
type MiniPalestraConteudo = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  video_url: string;
  cover_url: string | null;
  duration_minutes: number | null;
  visibility: string;
  active: boolean;
};

type MiniPalestraIndicacao = {
  id: string;
  lecture_id: string;
  appointment_id: string | null;
  session_date: string | null;
  therapist_note: string | null;
  featured: boolean;
  assigned_at: string;

  therapy_lectures:
    | MiniPalestraConteudo
    | MiniPalestraConteudo[]
    | null;
};

function normalizarMiniPalestra(
  relacao:
    | MiniPalestraConteudo
    | MiniPalestraConteudo[]
    | null
) {
  if (Array.isArray(relacao)) {
    return relacao[0] || null;
  }

  return relacao || null;
}
type PortalData = {
  cliente: {
    id: string;
    nome: string;
    nome_completo: string;
    email: string;
    slug: string;
  };

  professional: string;

  proximo_atendimento:
    | ProximoAtendimento
    | null;

jornada: {
  id: string;
  service_type: string;
  scheduled_at: string;
  session_title: string | null;
  recording_url: string | null;
  client_report: string | null;
  client_activity: string | null;
  published_to_client: boolean;
  completed_at: string | null;
}[];
 
mini_palestras: MiniPalestraIndicacao[];

  anamnese: {
    preenchida: boolean;
    status: string | null;
    submitted_at: string | null;
  };
};

function formatarDataHora(
  iso?: string | null
) {
  if (!iso) return "";

  const data = new Date(iso);

  return data.toLocaleString(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}
function baixarRelatorioPDF(
  nomeCliente: string,
  titulo: string,
  dataSessao: string,
  relatorio: string
) {
  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();
  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const margin = 18;
  const contentWidth =
    pageWidth - margin * 2;

  const corPrincipal = [94, 115, 87];
  const corSecundaria = [138, 162, 122];
  const corFundoBox = [247, 241, 228];
  const corBorda = [220, 207, 184];
  const corTexto = [79, 94, 74];
  const corTextoClaro = [248, 244, 236];

  let y = 20;

  function desenharCabecalho(
    subtitulo = "Relatório de sessão"
  ) {
    pdf.setFillColor(
      corPrincipal[0],
      corPrincipal[1],
      corPrincipal[2]
    );
    pdf.roundedRect(
      margin,
      y,
      contentWidth,
      24,
      4,
      4,
      "F"
    );

    pdf.setTextColor(
      corTextoClaro[0],
      corTextoClaro[1],
      corTextoClaro[2]
    );
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Terapia em Dia", margin + 8, y + 9);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(
      "com Ádria Freitas",
      margin + 8,
      y + 15
    );

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(9);
    pdf.text(
      subtitulo,
      pageWidth - margin - 8,
      y + 15,
      { align: "right" }
    );

    y += 32;
  }

  function desenharBlocoInfo() {
    pdf.setFillColor(
      corFundoBox[0],
      corFundoBox[1],
      corFundoBox[2]
    );
    pdf.setDrawColor(
      corBorda[0],
      corBorda[1],
      corBorda[2]
    );
    pdf.roundedRect(
      margin,
      y,
      contentWidth,
      32,
      4,
      4,
      "FD"
    );

    pdf.setTextColor(
      corSecundaria[0],
      corSecundaria[1],
      corSecundaria[2]
    );
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);

    pdf.text("CLIENTE", margin + 8, y + 8);
    pdf.text("SESSÒO", margin + 8, y + 18);
    pdf.text("DATA", margin + 8, y + 28);

    pdf.setTextColor(
      corTexto[0],
      corTexto[1],
      corTexto[2]
    );
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text(
      nomeCliente || "-",
      margin + 34,
      y + 8
    );
    pdf.text(
      titulo || "-",
      margin + 34,
      y + 18
    );
    pdf.text(
      new Date(dataSessao).toLocaleDateString(
        "pt-BR"
      ),
      margin + 34,
      y + 28
    );

    y += 40;
  }

  function desenharTituloSecao(texto: string) {
    pdf.setTextColor(
      corPrincipal[0],
      corPrincipal[1],
      corPrincipal[2]
    );
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(texto, margin, y);
    y += 8;
  }

  function desenharRodape() {
    pdf.setDrawColor(
      corBorda[0],
      corBorda[1],
      corBorda[2]
    );
    pdf.line(
      margin,
      pageHeight - 18,
      pageWidth - margin,
      pageHeight - 18
    );

    pdf.setTextColor(
      corSecundaria[0],
      corSecundaria[1],
      corSecundaria[2]
    );
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(
      "Ádria Freitas ⬢ Terapia em Dia",
      margin,
      pageHeight - 12
    );

    pdf.text(
      `Página ${pdf.getNumberOfPages()}`,
      pageWidth - margin,
      pageHeight - 12,
      { align: "right" }
    );
  }

  desenharCabecalho();
  desenharBlocoInfo();
  desenharTituloSecao("Síntese da sessão");

  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(
    corBorda[0],
    corBorda[1],
    corBorda[2]
  );
  pdf.roundedRect(
    margin,
    y,
    contentWidth,
    0,
    4,
    4,
    "S"
  );

  const texto = pdf.splitTextToSize(
    relatorio || "Relatório não informado.",
    contentWidth - 12
  );

  pdf.setTextColor(
    corTexto[0],
    corTexto[1],
    corTexto[2]
  );
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  const lineHeight = 6.5;
  let boxTop = y;
  y += 8;

  for (const linha of texto) {
    if (y > pageHeight - 28) {
      pdf.roundedRect(
        margin,
        boxTop,
        contentWidth,
        y - boxTop,
        4,
        4,
        "S"
      );
      desenharRodape();

      pdf.addPage();
      y = 20;
      desenharCabecalho(
        "Continuação do relatório"
      );
      desenharTituloSecao(
        "Síntese da sessão"
      );

      boxTop = y;
      y += 8;
    }

    pdf.text(linha, margin + 6, y);
    y += lineHeight;
  }

  pdf.roundedRect(
    margin,
    boxTop,
    contentWidth,
    y - boxTop + 4,
    4,
    4,
    "S"
  );

  y += 12;

  if (y > pageHeight - 35) {
    desenharRodape();
    pdf.addPage();
    y = 20;
  }

  pdf.setTextColor(
    corPrincipal[0],
    corPrincipal[1],
    corPrincipal[2]
  );
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(
    "Acompanhamento terapêutico",
    margin,
    y
  );

  y += 8;

  pdf.setTextColor(
    corTexto[0],
    corTexto[1],
    corTexto[2]
  );
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(
    "Este relatório faz parte do processo terapêutico individual da cliente.",
    margin,
    y
  );

  desenharRodape();

  const nomeArquivo = `relatorio-${titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}.pdf`;

  pdf.save(nomeArquivo);
}

  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text("Terapia em Dia", 20, 20);

  
export default function TerapiaPortalPage() {
  const params = useParams();

  const token = String(
    params?.token || ""
  );

  const router = useRouter();

  const modoPreview =
    token.startsWith("preview-");

  const previewClientId =
    modoPreview
      ? token.replace(/^preview-/, "")
      : "";

async function sair() {
  if (modoPreview) {
    router.replace(
      "/terapia/admin/clientes"
    );
    return;
  }

  await supabase.auth.signOut();

  window.localStorage.removeItem(
    "terapia_em_dia_access_token"
  );

  router.replace("/terapia");
}
  const [dados, setDados] =
    useState<PortalData | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  const [mesJornadaAberto, setMesJornadaAberto] =
    useState<string | null>(null);

  const [jornadaAberta, setJornadaAberta] =
    useState(false);

  const [mostrarHorarios, setMostrarHorarios] =
    useState(false);

  const [horariosDisponiveis, setHorariosDisponiveis] =
    useState<string[]>([]);

  const [carregandoHorarios, setCarregandoHorarios] =
    useState(false);

  const [alterandoAgenda, setAlterandoAgenda] =
    useState(false);

  const [mensagemAgenda, setMensagemAgenda] =
    useState<string | null>(null);

  useEffect(() => {
  if (!token) return;

  if (!modoPreview) {
    window.localStorage.setItem(
      "terapia_em_dia_access_token",
      token
    );
  }

  async function carregar() {
    setCarregando(true);
    setErro(null);

    try {
      let response: Response;

      if (modoPreview) {
        if (!previewClientId) {
          throw new Error(
            "Paciente não informada."
          );
        }

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error(
            "Sua sessão administrativa expirou."
          );
        }

        response = await fetch(
          `/api/terapia/admin/client-preview?clientId=${encodeURIComponent(
            previewClientId
          )}`,
          {
            cache: "no-store",
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
          }
        );
      } else {
        response = await fetch(
          `/api/terapia/portal?token=${encodeURIComponent(
            token
          )}`,
          {
            cache: "no-store",
          }
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível abrir seu espaço."
        );
      }

      setDados(data);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível abrir seu espaço."
      );
    } finally {
      setCarregando(false);
    }
  }

  carregar();
}, [
  token,
  modoPreview,
  previewClientId,
]);

  async function carregarHorariosDisponiveis() {
    if (!dados?.proximo_atendimento || modoPreview) {
      return;
    }

    try {
      setCarregandoHorarios(true);
      setMensagemAgenda(null);

      const response = await fetch(
        `/api/terapia/agenda-cliente?token=${encodeURIComponent(
          token
        )}&appointmentId=${encodeURIComponent(
          dados.proximo_atendimento.id
        )}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível carregar os horários disponíveis."
        );
      }

      setHorariosDisponiveis(
        Array.isArray(data?.horarios)
          ? data.horarios
          : []
      );

      setMostrarHorarios(true);
    } catch (error) {
      setMensagemAgenda(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os horários."
      );
    } finally {
      setCarregandoHorarios(false);
    }
  }

  async function cancelarSessao() {
    if (!dados?.proximo_atendimento || modoPreview) {
      return;
    }

    const confirmou = window.confirm(
      "Deseja realmente cancelar esta sessão? O cancelamento ficará registrado no seu histórico."
    );

    if (!confirmou) {
      return;
    }

    try {
      setAlterandoAgenda(true);
      setMensagemAgenda(null);

      const response = await fetch(
        "/api/terapia/agenda-cliente",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            token,
            appointmentId:
              dados.proximo_atendimento.id,
            action: "cancel",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível cancelar a sessão."
        );
      }

      window.location.reload();
    } catch (error) {
      setMensagemAgenda(
        error instanceof Error
          ? error.message
          : "Não foi possível cancelar a sessão."
      );
    } finally {
      setAlterandoAgenda(false);
    }
  }

  async function remarcarSessao(
    horario: string
  ) {
    if (!dados?.proximo_atendimento || modoPreview) {
      return;
    }

    const confirmou = window.confirm(
      `Deseja mudar sua sessão para ${horario}?`
    );

    if (!confirmou) {
      return;
    }

    try {
      setAlterandoAgenda(true);
      setMensagemAgenda(null);

      const response = await fetch(
        "/api/terapia/agenda-cliente",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            token,
            appointmentId:
              dados.proximo_atendimento.id,
            action: "reschedule",
            time: horario,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível mudar o horário."
        );
      }

      window.location.reload();
    } catch (error) {
      setMensagemAgenda(
        error instanceof Error
          ? error.message
          : "Não foi possível mudar o horário."
      );
    } finally {
      setAlterandoAgenda(false);
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-8 text-center text-[#6C8465]">
        Preparando seu espaço...
      </main>
    );
  }

  if (erro || !dados) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-8">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-7 text-center text-red-700 shadow">
          {erro ||
            "Não foi possível abrir seu espaço."}
        </div>
      </main>
    );
  }

    const proximo =
    dados.proximo_atendimento;

  const miniPalestras =
    dados.mini_palestras || [];

  const palestraDestaque =
    miniPalestras.length > 0
      ? normalizarMiniPalestra(
          miniPalestras[0]
            .therapy_lectures
        )
      : null;

   const hrefAnamnese =
  modoPreview
    ? `/terapia/admin/anamneses/${dados.cliente.id}`
    : `/terapia/acesso/${token}/anamnese`;

  return (
  <main className="min-h-screen bg-[#F8F4EC] text-[#4F5E4A]">
    {modoPreview && (
      <div className="border-b border-[#DCCFB8] bg-[#5E7357] px-5 py-3 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em]">
              Visualização do ADM
            </p>

            <p className="mt-1 text-sm">
              Você está vendo o portal como{" "}
              <strong>
                {dados.cliente.nome}
              </strong>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.replace(
                "/terapia/admin/clientes"
              )
            }
            className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#5E7357]"
          >
            Voltar ao ADM
          </button>
        </div>
      </div>
    )}
    
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col md:flex-row">
        <aside className="border-b border-[#DCCFB8] bg-[#F7F1E4] p-6 md:w-72 md:border-b-0 md:border-r">
          <div className="md:sticky md:top-6">
            <div className="flex items-center gap-3">
              <img
                src="/terapia-icon-192-v2.png"
                alt="Terapia em Dia"
                className="h-12 w-12 rounded-full object-cover shadow"
              />

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8AA27A]">
                  Terapia em Dia
                </p>

                <p className="mt-1 text-sm font-semibold text-[#5E7357]">
                  com Ádria Freitas
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[#DCCFB8] bg-white p-5">
              <p className="text-xs uppercase tracking-wide text-[#6C8465]">
                Seu espaço
              </p>

              <p className="mt-2 text-xl font-bold">
                {dados.cliente.nome}
              </p>

              <p className="mt-2 text-xs leading-5 text-[#6C8465]">
                Acompanhamento individual
                e confidencial.
              </p>
            </div>

            <nav className="mt-6 grid gap-2">
              <Link
                href={`/terapia/acesso/${token}`}
                className="rounded-xl bg-[#8AA27A] px-4 py-3 text-sm font-bold text-white shadow"
              >
                Meu Portal
              </Link>

              <Link
                href={hrefAnamnese}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#5E7357] transition hover:bg-[#EFE5D3]"
              >
                Minha Anamnese
              </Link>

              <Link
                href={`/terapia/acesso/${token}/atividades`}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#5E7357] transition hover:bg-[#EFE5D3]"
              >
                Minhas Atividades
              </Link>
            </nav>
            <button
  type="button"
  onClick={sair}
  className="mt-10 w-full rounded-xl border border-[#DCCFB8] bg-white px-4 py-3 text-sm font-bold text-[#5E7357] transition hover:bg-[#EFE5D3]"
>
  Sair
</button>
          </div>
        </aside>

        <section className="flex-1 px-5 py-8 md:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold text-[#8AA27A]">
              Seu acompanhamento começa aqui
            </p>

            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Bem-vinda, {dados.cliente.nome}.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6C8465] md:text-base">
              Este é o seu espaço de acompanhamento
              com Ádria Freitas. Aqui você poderá
              organizar sua jornada, acessar suas
              sessões e acompanhar as próximas etapas.
            </p>

            {proximo && (
              <div className="mt-8 overflow-hidden rounded-3xl border border-[#DCCFB8] bg-gradient-to-br from-[#8AA27A] to-[#5E7357] p-6 text-white shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-100">
                  Próximo encontro
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                  {proximo.service_type}
                </h2>

                <p className="mt-2 capitalize text-sm leading-6 text-orange-50">
                  {formatarDataHora(
                    proximo.scheduled_at
                  )}
                </p>

                <p className="mt-1 text-xs text-orange-100">
                  {proximo.duration_minutes} minutos
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {proximo.meet_url ? (
                    <a
                      href={proximo.meet_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#5E7357] shadow transition hover:bg-orange-50"
                    >
                      Entrar na sessão
                    </a>
                  ) : (
                    <p className="inline-flex rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-xs font-semibold text-orange-50">
                      O acesso à sala será liberado
                      antes do encontro.
                    </p>
                  )}

                  {!modoPreview && (
                    <>
                      <button
                        type="button"
                        onClick={cancelarSessao}
                        disabled={alterandoAgenda}
                        className="inline-flex rounded-xl border border-white/50 bg-transparent px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancelar sessão
                      </button>

                      <button
                        type="button"
                        onClick={carregarHorariosDisponiveis}
                        disabled={
                          carregandoHorarios ||
                          alterandoAgenda
                        }
                        className="inline-flex rounded-xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {carregandoHorarios
                          ? "Buscando horários..."
                          : "Escolher outro horário"}
                      </button>
                    </>
                  )}
                </div>

                {mensagemAgenda && (
                  <div className="mt-4 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white">
                    {mensagemAgenda}
                  </div>
                )}

                {mostrarHorarios && !modoPreview && (
                  <div className="mt-5 rounded-2xl bg-white p-5 text-[#4F5E4A] shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-extrabold">
                          Horários disponíveis neste dia
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#6C8465]">
                          Escolha um horário livre para
                          mudar sua sessão.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setMostrarHorarios(false)
                        }
                        className="rounded-lg px-2 py-1 text-lg text-[#6C8465]"
                        aria-label="Fechar horários"
                      >
                        ×
                      </button>
                    </div>

                    {horariosDisponiveis.length === 0 ? (
                      <p className="mt-4 rounded-xl bg-[#F7F1E4] p-4 text-sm text-[#6C8465]">
                        Não há outro horário disponível
                        neste dia.
                      </p>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {horariosDisponiveis.map(
                          (horario) => (
                            <button
                              key={horario}
                              type="button"
                              onClick={() =>
                                remarcarSessao(
                                  horario
                                )
                              }
                              disabled={
                                alterandoAgenda
                              }
                              className="rounded-xl border border-[#8AA27A] bg-[#EEF3E9] px-5 py-3 text-sm font-extrabold text-[#5E7357] transition hover:bg-[#DDE8D6] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {horario}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {palestraDestaque && (
              <section className="mt-8 overflow-hidden rounded-3xl border border-[#CBD6C2] bg-white shadow-lg">
                <div className="bg-[#EAF0E4] px-6 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6C8465]">
                    Para entender melhor
                  </p>

                  <p className="mt-1 text-sm text-[#6C8465]">
                    Uma explicação preparada para
                    complementar o que conversamos
                    em sessão.
                  </p>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {palestraDestaque.category && (
                      <span className="rounded-full bg-[#F0F3EB] px-3 py-1 text-xs font-bold text-[#6C8465]">
                        {palestraDestaque.category}
                      </span>
                    )}

                    {palestraDestaque.duration_minutes && (
                      <span className="rounded-full bg-[#F7F1E4] px-3 py-1 text-xs font-bold text-[#7A826F]">
                        {
                          palestraDestaque.duration_minutes
                        }{" "}
                        min
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-2xl font-extrabold text-[#4F5E4A]">
                    {palestraDestaque.title}
                  </h2>

                  {palestraDestaque.subtitle && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6C8465]">
                      {
                        palestraDestaque.subtitle
                      }
                    </p>
                  )}

                  {miniPalestras[0]
                    ?.therapist_note && (
                    <div className="mt-5 rounded-2xl bg-[#F7F1E4] p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#8AA27A]">
                        Um recado para você
                      </p>

                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5E7357]">
                        {
                          miniPalestras[0]
                            .therapist_note
                        }
                      </p>
                    </div>
                  )}

                  <a
                    href={
                      palestraDestaque.video_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex rounded-xl bg-[#6C8465] px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-[#5E7357]"
                  >
                    ▶ Assistir mini palestra
                  </a>

                  <p className="mt-4 text-xs leading-5 text-[#8A9284]">
                    Assista no seu tempo. Você
                    poderá voltar a este conteúdo
                    sempre que quiser.
                  </p>
                </div>
              </section>
            )}

            {miniPalestras.length > 1 && (
              <section className="mt-6 rounded-3xl border border-[#DCCFB8] bg-white p-6 shadow-lg">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8AA27A]">
                    Seu aprendizado
                  </p>

                  <h2 className="mt-2 text-xl font-extrabold text-[#4F5E4A]">
                    Minhas mini palestras
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#6C8465]">
                    Aqui ficam os conteúdos que
                    foram indicados ao longo do
                    seu acompanhamento.
                  </p>
                </div>

                <div className="mt-5 grid gap-3">
                  {miniPalestras
                    .slice(1)
                    .map((indicacao) => {
                      const palestra =
                        normalizarMiniPalestra(
                          indicacao
                            .therapy_lectures
                        );

                      if (!palestra) {
                        return null;
                      }

                      return (
                        <div
                          key={indicacao.id}
                          className="rounded-2xl border border-[#DFE3D9] bg-[#FDFBF7] p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-bold text-[#4F5E4A]">
                                {palestra.title}
                              </p>

                              <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#818A7B]">
                                {palestra.category && (
                                  <span>
                                    {
                                      palestra.category
                                    }
                                  </span>
                                )}

                                {palestra.duration_minutes && (
                                  <span>
                                    ⬢{" "}
                                    {
                                      palestra.duration_minutes
                                    }{" "}
                                    min
                                  </span>
                                )}
                              </div>

                              {indicacao.session_date && (
                                <p className="mt-2 text-xs text-[#93998D]">
                                  Indicada na sessão de{" "}
                                  {new Date(
                                    `${indicacao.session_date}T12:00:00`
                                  ).toLocaleDateString(
                                    "pt-BR"
                                  )}
                                </p>
                              )}
                            </div>

                            <a
                              href={
                                palestra.video_url
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 rounded-xl border border-[#8AA27A] bg-white px-4 py-2 text-sm font-bold text-[#5E7357] transition hover:bg-[#F0F3EB]"
                            >
                              ▶ Assistir
                            </a>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            <div className="mt-8 grid gap-5 md:grid-cols-2"></div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Link
                href={hrefAnamnese}
                className={`rounded-3xl border p-6 shadow-lg transition hover:-translate-y-1 ${
                  dados.anamnese.preenchida
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-[#DCCFB8] bg-white hover:border-[#8AA27A]"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE5D3] text-xl">
                  📝
                </div>

                <h2 className="mt-4 text-xl font-extrabold">
                  Minha Anamnese
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6C8465]">
                  {dados.anamnese.preenchida
                    ? "Sua anamnese foi recebida pela Ádria."
                    : "Preencha suas informações antes do primeiro encontro."}
                </p>

                <p
                  className={`mt-5 text-sm font-bold ${
                    dados.anamnese.preenchida
                      ? "text-emerald-700"
                      : "text-[#8AA27A]"
                  }`}
                >
                  {dados.anamnese.preenchida
                    ? "✓ Anamnese preenchida"
                    : "Preencher agora →"}
                </p>
              </Link>
              <Link
                href={`/terapia/acesso/${token}/atividades`}
                className="rounded-3xl border border-[#DCCFB8] bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:border-[#8AA27A]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE5D3] text-xl">
                  🧩
                </div>

                <h2 className="mt-4 text-xl font-extrabold">
                  Minhas Atividades
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6C8465]">
                  Acesse as atividades e reflexões preparadas para acompanhar seu processo entre as sessões.
                </p>

                <p className="mt-5 text-sm font-bold text-[#8AA27A]">
                  Abrir atividades →
                </p>
              </Link>

            <div className="rounded-3xl border border-[#DCCFB8] bg-white p-6 shadow-lg md:col-span-2">
  <button
    type="button"
    onClick={() =>
      setJornadaAberta(
        (atual) => !atual
      )
    }
    aria-expanded={jornadaAberta}
    className="flex w-full items-center justify-between gap-4 text-left"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFE5D3] text-xl">
        🌿
      </div>

      <div>
        <h2 className="text-xl font-extrabold">
          Minha Jornada
        </h2>

        <p className="mt-1 text-sm leading-6 text-[#6C8465]">
          Aqui ficam organizadas suas sessões, gravações, relatórios e orientações.
        </p>
      </div>
    </div>

    <span
      className="shrink-0 text-3xl font-light leading-none text-[#8AA27A]"
      aria-hidden="true"
    >
      {jornadaAberta ? "⌄" : "›"}
    </span>
  </button>

  {jornadaAberta && (
    <>
      {dados.jornada.length === 0 ? (
        <div className="mt-5 rounded-2xl bg-[#F7F1E4] p-5 text-sm text-[#6C8465]">
          Sua jornada será registrada aqui durante o acompanhamento.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {(() => {
            const jornadaOrdenada = [...dados.jornada].sort(
              (a, b) =>
                new Date(b.scheduled_at).getTime() -
                new Date(a.scheduled_at).getTime()
            );

            const gruposPorMes = jornadaOrdenada.reduce<
              Record<string, typeof dados.jornada>
            >((grupos, sessao) => {
              const data = new Date(sessao.scheduled_at);

              const chaveMes = `${data.getFullYear()}-${String(
                data.getMonth() + 1
              ).padStart(2, "0")}`;

              if (!grupos[chaveMes]) {
                grupos[chaveMes] = [];
              }

              grupos[chaveMes].push(sessao);

              return grupos;
            }, {});

            const agora = new Date();

            const chaveMesAtual = `${agora.getFullYear()}-${String(
              agora.getMonth() + 1
            ).padStart(2, "0")}`;

            const chavesDosMeses = Object.keys(gruposPorMes);

            const mesInicial = gruposPorMes[chaveMesAtual]
              ? chaveMesAtual
              : chavesDosMeses[0];

            return chavesDosMeses.map((chaveMes) => {
              const sessoes = gruposPorMes[chaveMes];

              const [ano, mes] = chaveMes.split("-").map(Number);

              const nomeMes = new Date(
                ano,
                mes - 1,
                1
              ).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              });

              const aberto =
                mesJornadaAberto === null
                  ? chaveMes === mesInicial
                  : mesJornadaAberto === chaveMes;

              return (
                <div
                  key={chaveMes}
                  className="overflow-hidden rounded-2xl border border-[#DCCFB8] bg-[#FDFBF7]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setMesJornadaAberto(
                        aberto ? "" : chaveMes
                      )
                    }
                    aria-expanded={aberto}
                    className="flex w-full items-center justify-between gap-4 bg-[#F3EEE4] px-5 py-5 text-left transition hover:bg-[#EDE5D7]"
                  >
                    <span className="text-lg font-extrabold capitalize text-[#4F5E4A]">
                      {nomeMes}
                    </span>

                    <span
                      className="text-3xl font-light leading-none text-[#8AA27A]"
                      aria-hidden="true"
                    >
                      {aberto ? "⌄" : "›"}
                    </span>
                  </button>

                  {aberto && (
                    <div className="space-y-4 p-4">
                      {sessoes.map((sessao) => {
                        const titulo =
                          sessao.session_title ||
                          sessao.service_type ||
                          "Sessão";

                        return (
                          <div
                            key={sessao.id}
                            className="rounded-2xl border border-[#DCCFB8] bg-white p-5"
                          >
                            <p className="text-xs font-bold uppercase tracking-wide text-[#8AA27A]">
                              {new Date(
                                sessao.scheduled_at
                              ).toLocaleDateString("pt-BR")}
                            </p>

                            <h3 className="mt-2 text-lg font-extrabold text-[#4F5E4A]">
                              {titulo}
                            </h3>

                            <p className="mt-1 text-sm text-[#6C8465]">
                              {sessao.service_type}
                            </p>

                            {sessao.client_activity && (
                              <div className="mt-4 rounded-xl bg-[#F3EEE4] p-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-[#8AA27A]">
                                  Orientação
                                </p>

                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5E7357]">
                                  {sessao.client_activity}
                                </p>
                              </div>
                            )}

                            <div className="mt-5 flex flex-wrap gap-3">
                              {sessao.recording_url && (
                                <a
                                  href={sessao.recording_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex rounded-xl bg-[#8AA27A] px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-[#769566]"
                                >
                                  ▶ Assistir gravação
                                </a>
                              )}

                              {sessao.client_report && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    baixarRelatorioPDF(
                                      dados.cliente.nome,
                                      titulo,
                                      sessao.scheduled_at,
                                      sessao.client_report || ""
                                    )
                                  }
                                  className="inline-flex rounded-xl border border-[#8AA27A] bg-white px-4 py-3 text-sm font-bold text-[#5E7357] shadow transition hover:bg-[#F7F1E4]"
                                >
                                  📄 Baixar relatório
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      )}
    </>
  )}
</div>

              <div className="rounded-3xl border border-[#DCCFB8] bg-white p-6 shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE5D3] text-xl">
                  📅
                </div>

                <h2 className="mt-4 text-xl font-extrabold">
                  Minha Agenda
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6C8465]">
                  {proximo
                    ? `Seu próximo encontro está marcado para ${formatarDataHora(
                        proximo.scheduled_at
                      )}.`
                    : "Nenhum próximo encontro encontrado."}
                </p>
              </div>

              <div className="rounded-3xl border border-[#DCCFB8] bg-white p-6 shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE5D3] text-xl">
                  ✦
                </div>

                <h2 className="mt-4 text-xl font-extrabold">
                  Recados da Ádria
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6C8465]">
                  Este espaço receberá orientações
                  e recados relacionados ao seu
                  acompanhamento.
                </p>

                <p className="mt-5 text-xs font-bold uppercase tracking-wide text-[#6C8465]">
                  Em breve
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6">
              <p className="text-sm font-bold text-[#8AA27A]">
                Privacidade
              </p>

              <p className="mt-2 text-xs leading-6 text-[#6C8465]">
                Seu link de acesso é individual.
                Não encaminhe este endereço para
                outras pessoas.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
