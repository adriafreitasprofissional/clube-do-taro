"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Palestra = {
  id: string;
  title: string;
  subtitle: string | null;
  category: string | null;
  duration_minutes: number | null;
  visibility:
    | "public"
    | "patients"
    | "private";
  active: boolean;
};

type Indicacao = {
  id: string;
  lecture_id: string;
  client_id: string;
  appointment_id: string | null;
  session_date: string | null;
  therapist_note: string | null;
  featured: boolean;
  assigned_at: string;

  therapy_lectures:
    | {
        id: string;
        title: string;
        subtitle: string | null;
        description: string | null;
        category: string | null;
        video_url: string;
        cover_url: string | null;
        duration_minutes: number | null;
        visibility:
          | "public"
          | "patients"
          | "private";
        active: boolean;
      }
    | null;
};

type Props = {
  clientId: string;
  appointmentId?: string | null;
  sessionDate?: string | null;
};

function formatarData(valor?: string | null) {
  if (!valor) return "";

  const data = new Date(
    `${valor.slice(0, 10)}T12:00:00`
  );

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(data);
}

export default function MiniPalestrasSessao({
  clientId,
  appointmentId = null,
  sessionDate = null,
}: Props) {
  const [palestras, setPalestras] =
    useState<Palestra[]>([]);

  const [indicacoes, setIndicacoes] =
    useState<Indicacao[]>([]);

  const [lectureId, setLectureId] =
    useState("");

  const [observacao, setObservacao] =
    useState("");

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] =
    useState("");

  const [sucesso, setSucesso] =
    useState("");

  async function obterToken() {
    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error(
        "Sua sessão expirou. Entre novamente."
      );
    }

    return session.access_token;
  }

  async function carregarDados() {
    if (!clientId) return;

    try {
      setCarregando(true);
      setErro("");

      const token =
        await obterToken();

      const [
        respostaPalestras,
        respostaIndicacoes,
      ] = await Promise.all([
        fetch(
          "/api/admin/terapia/palestras",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: "no-store",
          }
        ),

        fetch(
          `/api/admin/terapia/palestras/indicacoes?client_id=${encodeURIComponent(
            clientId
          )}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: "no-store",
          }
        ),
      ]);

      const jsonPalestras =
        await respostaPalestras.json();

      const jsonIndicacoes =
        await respostaIndicacoes.json();

      if (!respostaPalestras.ok) {
        throw new Error(
          jsonPalestras.error ||
            "Erro ao carregar mini palestras."
        );
      }

      if (!respostaIndicacoes.ok) {
        throw new Error(
          jsonIndicacoes.error ||
            "Erro ao carregar indicações."
        );
      }

      setPalestras(
        (
          jsonPalestras.palestras || []
        ).filter(
          (item: Palestra) =>
            item.active
        )
      );

      setIndicacoes(
        jsonIndicacoes.indicacoes || []
      );
    } catch (error: unknown) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar conteúdos."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarDados();
  }, [clientId]);

  const indicacoesSessao =
    useMemo(() => {
      return indicacoes.filter(
        (item) => {
          if (
            appointmentId &&
            item.appointment_id
          ) {
            return (
              item.appointment_id ===
              appointmentId
            );
          }

          if (
            sessionDate &&
            item.session_date
          ) {
            return (
              item.session_date ===
              sessionDate
            );
          }

          return false;
        }
      );
    }, [
      indicacoes,
      appointmentId,
      sessionDate,
    ]);

  const historico =
    useMemo(() => {
      const idsSessao = new Set(
        indicacoesSessao.map(
          (item) => item.id
        )
      );

      return indicacoes.filter(
        (item) =>
          !idsSessao.has(item.id)
      );
    }, [
      indicacoes,
      indicacoesSessao,
    ]);

  const palestrasDisponiveis =
    useMemo(() => {
      const jaIndicadas = new Set(
        indicacoesSessao.map(
          (item) => item.lecture_id
        )
      );

      return palestras.filter(
        (item) =>
          !jaIndicadas.has(item.id)
      );
    }, [
      palestras,
      indicacoesSessao,
    ]);

  async function indicarPalestra() {
    if (!lectureId) {
      setErro(
        "Selecione uma mini palestra."
      );
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      setSucesso("");

      const token =
        await obterToken();

      const resposta = await fetch(
        "/api/admin/terapia/palestras/indicacoes",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            lecture_id: lectureId,
            client_id: clientId,
            appointment_id:
              appointmentId,
            session_date:
              sessionDate,
            therapist_note:
              observacao.trim(),
            featured: true,
          }),
        }
      );

      const json =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          json.error ||
            "Não foi possível indicar a palestra."
        );
      }

      setLectureId("");
      setObservacao("");

      setSucesso(
        "Mini palestra indicada ao paciente."
      );

      await carregarDados();
    } catch (error: unknown) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao indicar palestra."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function removerIndicacao(
    indicacao: Indicacao
  ) {
    const titulo =
      indicacao
        .therapy_lectures
        ?.title ||
      "esta mini palestra";

    const confirmar =
      window.confirm(
        `Remover a indicação de "${titulo}" desta sessão?`
      );

    if (!confirmar) return;

    try {
      setErro("");
      setSucesso("");

      const token =
        await obterToken();

      const resposta = await fetch(
        `/api/admin/terapia/palestras/indicacoes?id=${encodeURIComponent(
          indicacao.id
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const json =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          json.error ||
            "Não foi possível remover a indicação."
        );
      }

      setSucesso(
        "Indicação removida."
      );

      await carregarDados();
    } catch (error: unknown) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao remover indicação."
      );
    }
  }

  return (
    <section
      className="
        rounded-[26px]
        border
        border-[#dfe2d7]
        bg-[#fffef9]
        p-5
        shadow-sm
        md:p-6
      "
    >
      <div className="mb-5">
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[#78806c]
          "
        >
          Para entender melhor
        </p>

        <h2
          className="
            mt-1
            text-xl
            font-semibold
            text-[#37422f]
          "
        >
          Mini palestras desta sessão
        </h2>

        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            leading-6
            text-[#73796b]
          "
        >
          Indique conteúdos curtos
          para ajudar o paciente a
          compreender os assuntos
          trabalhados durante o
          atendimento.
        </p>
      </div>

      {erro && (
        <div
          className="
            mb-4
            rounded-2xl
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {erro}
        </div>
      )}

      {sucesso && (
        <div
          className="
            mb-4
            rounded-2xl
            bg-[#eef3e9]
            px-4
            py-3
            text-sm
            text-[#4c5d40]
          "
        >
          {sucesso}
        </div>
      )}

      {carregando ? (
        <p
          className="
            py-5
            text-sm
            text-[#7b8173]
          "
        >
          Carregando conteúdos...
        </p>
      ) : (
        <>
          <div
            className="
              rounded-2xl
              bg-[#f3f4ed]
              p-4
            "
          >
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-[#4c5842]
              "
            >
              Escolha uma mini palestra
            </label>

            <select
              value={lectureId}
              onChange={(event) =>
                setLectureId(
                  event.target.value
                )
              }
              className="
                w-full
                rounded-2xl
                border
                border-[#d8ddcf]
                bg-white
                px-4
                py-3
                text-sm
                text-[#36402f]
                outline-none
                focus:border-[#7b8968]
              "
            >
              <option value="">
                Selecione um conteúdo
              </option>

              {palestrasDisponiveis.map(
                (palestra) => (
                  <option
                    key={palestra.id}
                    value={palestra.id}
                  >
                    {palestra.title}
                    {palestra.duration_minutes
                      ? ` — ${palestra.duration_minutes} min`
                      : ""}
                  </option>
                )
              )}
            </select>

            {palestrasDisponiveis.length ===
              0 && (
              <p
                className="
                  mt-2
                  text-xs
                  text-[#858b7e]
                "
              >
                Todas as palestras
                disponíveis já foram
                indicadas nesta sessão.
              </p>
            )}

            <label
              className="
                mb-2
                mt-4
                block
                text-sm
                font-semibold
                text-[#4c5842]
              "
            >
              Recado para o paciente
              <span
                className="
                  ml-1
                  font-normal
                  text-[#8b9185]
                "
              >
                (opcional)
              </span>
            </label>

            <textarea
              value={observacao}
              onChange={(event) =>
                setObservacao(
                  event.target.value
                )
              }
              rows={3}
              placeholder="Ex.: Assista quando estiver tranquila. Este vídeo explica um pouco melhor o assunto que conversamos hoje."
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-[#d8ddcf]
                bg-white
                px-4
                py-3
                text-sm
                text-[#36402f]
                outline-none
                placeholder:text-[#a1a69c]
                focus:border-[#7b8968]
              "
            />

            <div
              className="
                mt-4
                flex
                justify-end
              "
            >
              <button
                type="button"
                onClick={
                  indicarPalestra
                }
                disabled={
                  salvando ||
                  !lectureId
                }
                className="
                  rounded-2xl
                  bg-[#596947]
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#465538]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {salvando
                  ? "Indicando..."
                  : "+ Indicar ao paciente"}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3
              className="
                text-sm
                font-semibold
                text-[#46523d]
              "
            >
              Indicadas nesta sessão
            </h3>

            {indicacoesSessao.length ===
            0 ? (
              <p
                className="
                  mt-2
                  rounded-2xl
                  border
                  border-dashed
                  border-[#d9ddd2]
                  px-4
                  py-4
                  text-sm
                  text-[#858b7e]
                "
              >
                Nenhuma mini palestra
                indicada nesta sessão.
              </p>
            ) : (
              <div
                className="
                  mt-3
                  space-y-3
                "
              >
                {indicacoesSessao.map(
                  (item) => {
                    const palestra =
                      item
                        .therapy_lectures;

                    return (
                      <div
                        key={item.id}
                        className="
                          rounded-2xl
                          border
                          border-[#dfe3d8]
                          bg-white
                          p-4
                        "
                      >
                        <div
                          className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-start
                            sm:justify-between
                          "
                        >
                          <div>
                            <p
                              className="
                                font-semibold
                                text-[#37422f]
                              "
                            >
                              {palestra?.title ||
                                "Mini palestra"}
                            </p>

                            <div
                              className="
                                mt-1
                                flex
                                flex-wrap
                                gap-2
                                text-xs
                                text-[#818778]
                              "
                            >
                              {palestra?.category && (
                                <span>
                                  {
                                    palestra.category
                                  }
                                </span>
                              )}

                              {palestra?.duration_minutes && (
                                <span>
                                  •{" "}
                                  {
                                    palestra.duration_minutes
                                  }{" "}
                                  min
                                </span>
                              )}
                            </div>

                            {item.therapist_note && (
                              <p
                                className="
                                  mt-3
                                  text-sm
                                  leading-6
                                  text-[#697060]
                                "
                              >
                                {
                                  item.therapist_note
                                }
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removerIndicacao(
                                item
                              )
                            }
                            className="
                              shrink-0
                              rounded-xl
                              border
                              border-[#e3d8d8]
                              px-3
                              py-2
                              text-xs
                              font-medium
                              text-[#8b5b5b]
                            "
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {historico.length > 0 && (
            <details
              className="
                mt-6
                rounded-2xl
                border
                border-[#e0e2da]
                bg-[#fafaf6]
              "
            >
              <summary
                className="
                  cursor-pointer
                  px-4
                  py-4
                  text-sm
                  font-semibold
                  text-[#59634f]
                "
              >
                Histórico de mini palestras
                do paciente (
                {historico.length})
              </summary>

              <div
                className="
                  space-y-3
                  border-t
                  border-[#e4e6de]
                  p-4
                "
              >
                {historico.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="
                        rounded-xl
                        bg-white
                        px-4
                        py-3
                      "
                    >
                      <p
                        className="
                          text-sm
                          font-semibold
                          text-[#46523d]
                        "
                      >
                        {item
                          .therapy_lectures
                          ?.title ||
                          "Mini palestra"}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-[#8a9083]
                        "
                      >
                        {item.session_date
                          ? `Sessão de ${formatarData(
                              item.session_date
                            )}`
                          : `Indicada em ${formatarData(
                              item.assigned_at
                            )}`}
                      </p>
                    </div>
                  )
                )}
              </div>
            </details>
          )}
        </>
      )}
    </section>
  );
}