"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Visibilidade =
  | "public"
  | "patients"
  | "private";

type Palestra = {
  id: string;
  professional_id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  video_url: string;
  cover_url: string | null;
  duration_minutes: number | null;
  visibility: Visibilidade;
  active: boolean;
  created_at: string;
  updated_at: string;
  therapy_professionals?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type FormPalestra = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  video_url: string;
  cover_url: string;
  duration_minutes: string;
  visibility: Visibilidade;
};

const FORM_INICIAL: FormPalestra = {
  id: "",
  title: "",
  subtitle: "",
  description: "",
  category: "",
  video_url: "",
  cover_url: "",
  duration_minutes: "",
  visibility: "patients",
};

const CATEGORIAS = [
  "Autoconhecimento",
  "TRG",
  "Emoções",
  "Infância",
  "Relacionamentos",
  "Ansiedade",
  "Padrões mentais",
  "Dependência emocional",
  "Regulação emocional",
  "Crenças",
  "Limites",
  "Família",
  "Outro",
];

function formatarData(valor: string) {
  if (!valor) return "";

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(new Date(valor));
}

function labelVisibilidade(
  valor: Visibilidade
) {
  if (valor === "public") {
    return "Pública";
  }

  if (valor === "private") {
    return "Privada";
  }

  return "Pacientes";
}

export default function MiniPalestrasPage() {
  const [palestras, setPalestras] =
    useState<Palestra[]>([]);

  const [form, setForm] =
    useState<FormPalestra>(
      FORM_INICIAL
    );

  const [mostrarForm, setMostrarForm] =
    useState(false);

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] =
    useState("");

  const [sucesso, setSucesso] =
    useState("");

  async function tokenAtual() {
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

  async function carregarPalestras() {
    try {
      setCarregando(true);
      setErro("");

      const token =
        await tokenAtual();

      const response = await fetch(
        "/api/admin/terapia/palestras",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const json =
        await response.json();

      if (!response.ok) {
        throw new Error(
          json.error ||
            "Não foi possível carregar as palestras."
        );
      }

      setPalestras(
        json.palestras || []
      );
    } catch (error: unknown) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar palestras."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarPalestras();
  }, []);

  function atualizarCampo(
    campo: keyof FormPalestra,
    valor: string
  ) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function novaPalestra() {
    setForm(FORM_INICIAL);
    setErro("");
    setSucesso("");
    setMostrarForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function editarPalestra(
    palestra: Palestra
  ) {
    setForm({
      id: palestra.id,
      title: palestra.title,
      subtitle:
        palestra.subtitle || "",
      description:
        palestra.description || "",
      category:
        palestra.category || "",
      video_url:
        palestra.video_url,
      cover_url:
        palestra.cover_url || "",
      duration_minutes:
        palestra.duration_minutes
          ? String(
              palestra.duration_minutes
            )
          : "",
      visibility:
        palestra.visibility,
    });

    setErro("");
    setSucesso("");
    setMostrarForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelarFormulario() {
    setForm(FORM_INICIAL);
    setMostrarForm(false);
    setErro("");
    setSucesso("");
  }

  async function salvarPalestra(
    event: FormEvent
  ) {
    event.preventDefault();

    if (!form.title.trim()) {
      setErro(
        "Informe o título da mini palestra."
      );
      return;
    }

    if (!form.video_url.trim()) {
      setErro(
        "Informe o link do vídeo."
      );
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      setSucesso("");

      const token =
        await tokenAtual();

      const editando =
        Boolean(form.id);

      const response = await fetch(
        "/api/admin/terapia/palestras",
        {
          method: editando
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...(editando
              ? { id: form.id }
              : {}),

            title:
              form.title.trim(),

            subtitle:
              form.subtitle.trim(),

            description:
              form.description.trim(),

            category:
              form.category.trim(),

            video_url:
              form.video_url.trim(),

            cover_url:
              form.cover_url.trim(),

            duration_minutes:
              form.duration_minutes
                ? Number(
                    form.duration_minutes
                  )
                : null,

            visibility:
              form.visibility,
          }),
        }
      );

      const json =
        await response.json();

      if (!response.ok) {
        throw new Error(
          json.error ||
            "Não foi possível salvar a palestra."
        );
      }

      setSucesso(
        editando
          ? "Mini palestra atualizada."
          : "Mini palestra criada."
      );

      setForm(FORM_INICIAL);
      setMostrarForm(false);

      await carregarPalestras();
    } catch (error: unknown) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao salvar palestra."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function desativarPalestra(
    palestra: Palestra
  ) {
    const confirmar =
      window.confirm(
        `Desativar "${palestra.title}"?\n\nO histórico será preservado.`
      );

    if (!confirmar) {
      return;
    }

    try {
      setErro("");
      setSucesso("");

      const token =
        await tokenAtual();

      const response = await fetch(
        `/api/admin/terapia/palestras?id=${encodeURIComponent(
          palestra.id
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
        await response.json();

      if (!response.ok) {
        throw new Error(
          json.error ||
            "Não foi possível desativar."
        );
      }

      setSucesso(
        "Mini palestra desativada. O histórico foi preservado."
      );

      await carregarPalestras();
    } catch (error: unknown) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao desativar palestra."
      );
    }
  }

  const ativas =
    palestras.filter(
      (item) => item.active
    ).length;

  const publicas =
    palestras.filter(
      (item) =>
        item.active &&
        item.visibility === "public"
    ).length;

  const paraPacientes =
    palestras.filter(
      (item) =>
        item.active &&
        item.visibility ===
          "patients"
    ).length;

  return (
    <main
      className="
        min-h-screen
        bg-[#f6f4ec]
        px-4
        py-8
        text-[#293025]
        md:px-8
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
        "
      >
        <header
          className="
            mb-8
            overflow-hidden
            rounded-[28px]
            bg-[#3f4c32]
            p-6
            text-white
            shadow-sm
            md:p-8
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div>
              <p
                className="
                  mb-2
                  text-sm
                  uppercase
                  tracking-[0.2em]
                  text-[#dce3d5]
                "
              >
                Terapia em Dia
              </p>

              <h1
                className="
                  text-3xl
                  font-semibold
                  md:text-4xl
                "
              >
                Mini Palestras
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-[#eef1e9]
                  md:text-base
                "
              >
                Conteúdos curtos para
                explicar de forma simples
                os temas trabalhados no
                processo terapêutico.
              </p>
            </div>

            <button
              type="button"
              onClick={novaPalestra}
              className="
                rounded-2xl
                bg-[#f6f4ec]
                px-5
                py-3
                font-semibold
                text-[#3f4c32]
                transition
                hover:bg-white
              "
            >
              + Nova mini palestra
            </button>
          </div>
        </header>

        <section
          className="
            mb-8
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <ResumoCard
            titulo="Total"
            valor={palestras.length}
            texto="conteúdos cadastrados"
          />

          <ResumoCard
            titulo="Ativas"
            valor={ativas}
            texto="disponíveis atualmente"
          />

          <ResumoCard
            titulo="Pacientes"
            valor={paraPacientes}
            texto="conteúdos internos"
          />

          <ResumoCard
            titulo="Públicas"
            valor={publicas}
            texto="podem ser compartilhadas"
          />
        </section>

        {erro && (
          <div
            className="
              mb-6
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
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
              mb-6
              rounded-2xl
              border
              border-[#cad4c0]
              bg-[#edf2e9]
              px-5
              py-4
              text-sm
              text-[#3f4c32]
            "
          >
            {sucesso}
          </div>
        )}

        {mostrarForm && (
          <section
            className="
              mb-8
              rounded-[28px]
              border
              border-[#dedfd5]
              bg-white
              p-5
              shadow-sm
              md:p-7
            "
          >
            <div
              className="
                mb-6
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-medium
                    text-[#707763]
                  "
                >
                  Biblioteca educativa
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-semibold
                    text-[#35402c]
                  "
                >
                  {form.id
                    ? "Editar mini palestra"
                    : "Nova mini palestra"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  cancelarFormulario
                }
                className="
                  rounded-xl
                  border
                  border-[#d9dccf]
                  px-4
                  py-2
                  text-sm
                  text-[#59604f]
                "
              >
                Fechar
              </button>
            </div>

            <form
              onSubmit={salvarPalestra}
              className="
                grid
                gap-5
                lg:grid-cols-2
              "
            >
              <Campo
                label="Título"
                obrigatorio
              >
                <input
                  value={form.title}
                  onChange={(event) =>
                    atualizarCampo(
                      "title",
                      event.target.value
                    )
                  }
                  placeholder="Ex.: O que são padrões mentais?"
                  className={inputClass}
                />
              </Campo>

              <Campo label="Subtítulo">
                <input
                  value={
                    form.subtitle
                  }
                  onChange={(event) =>
                    atualizarCampo(
                      "subtitle",
                      event.target.value
                    )
                  }
                  placeholder="Uma explicação simples para compreender melhor este tema."
                  className={inputClass}
                />
              </Campo>

              <Campo label="Categoria">
                <select
                  value={
                    form.category
                  }
                  onChange={(event) =>
                    atualizarCampo(
                      "category",
                      event.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Selecione
                  </option>

                  {CATEGORIAS.map(
                    (categoria) => (
                      <option
                        key={categoria}
                        value={categoria}
                      >
                        {categoria}
                      </option>
                    )
                  )}
                </select>
              </Campo>

              <Campo label="Duração aproximada">
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <input
                    type="number"
                    min="1"
                    value={
                      form.duration_minutes
                    }
                    onChange={(event) =>
                      atualizarCampo(
                        "duration_minutes",
                        event.target.value
                      )
                    }
                    placeholder="5"
                    className={inputClass}
                  />

                  <span
                    className="
                      whitespace-nowrap
                      text-sm
                      text-[#707763]
                    "
                  >
                    minutos
                  </span>
                </div>
              </Campo>

              <Campo
                label="Link do vídeo"
                obrigatorio
              >
                <input
                  value={
                    form.video_url
                  }
                  onChange={(event) =>
                    atualizarCampo(
                      "video_url",
                      event.target.value
                    )
                  }
                  placeholder="Cole aqui o link do vídeo"
                  className={inputClass}
                />
              </Campo>

              <Campo label="Imagem de capa">
                <input
                  value={
                    form.cover_url
                  }
                  onChange={(event) =>
                    atualizarCampo(
                      "cover_url",
                      event.target.value
                    )
                  }
                  placeholder="Link da imagem de capa, se houver"
                  className={inputClass}
                />
              </Campo>

              <div
                className="
                  lg:col-span-2
                "
              >
                <Campo label="Descrição">
                  <textarea
                    value={
                      form.description
                    }
                    onChange={(event) =>
                      atualizarCampo(
                        "description",
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="Explique em poucas palavras o que o paciente encontrará nesta mini palestra."
                    className={inputClass}
                  />
                </Campo>
              </div>

              <div
                className="
                  lg:col-span-2
                "
              >
                <Campo label="Quem poderá acessar?">
                  <div
                    className="
                      grid
                      gap-3
                      md:grid-cols-3
                    "
                  >
                    <OpcaoVisibilidade
                      ativa={
                        form.visibility ===
                        "patients"
                      }
                      titulo="Pacientes"
                      texto="Disponível dentro do portal para pacientes indicados."
                      onClick={() =>
                        atualizarCampo(
                          "visibility",
                          "patients"
                        )
                      }
                    />

                    <OpcaoVisibilidade
                      ativa={
                        form.visibility ===
                        "public"
                      }
                      titulo="Pública"
                      texto="Pode ser compartilhada fora do portal."
                      onClick={() =>
                        atualizarCampo(
                          "visibility",
                          "public"
                        )
                      }
                    />

                    <OpcaoVisibilidade
                      ativa={
                        form.visibility ===
                        "private"
                      }
                      titulo="Privada"
                      texto="Fica salva somente para uso interno."
                      onClick={() =>
                        atualizarCampo(
                          "visibility",
                          "private"
                        )
                      }
                    />
                  </div>
                </Campo>
              </div>

              <div
                className="
                  flex
                  flex-wrap
                  justify-end
                  gap-3
                  lg:col-span-2
                "
              >
                <button
                  type="button"
                  onClick={
                    cancelarFormulario
                  }
                  className="
                    rounded-2xl
                    border
                    border-[#d9dccf]
                    px-5
                    py-3
                    font-medium
                    text-[#59604f]
                  "
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  className="
                    rounded-2xl
                    bg-[#596947]
                    px-6
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#465538]
                    disabled:opacity-60
                  "
                >
                  {salvando
                    ? "Salvando..."
                    : form.id
                      ? "Salvar alterações"
                      : "Cadastrar palestra"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section>
          <div
            className="
              mb-5
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-[#35402c]
                "
              >
                Biblioteca
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-[#737969]
                "
              >
                Seus conteúdos educativos
                ficam organizados aqui.
              </p>
            </div>
          </div>

          {carregando ? (
            <div
              className="
                rounded-[26px]
                border
                border-[#dedfd5]
                bg-white
                p-8
                text-center
                text-[#747a6c]
              "
            >
              Carregando mini palestras...
            </div>
          ) : palestras.length === 0 ? (
            <div
              className="
                rounded-[26px]
                border
                border-dashed
                border-[#cdd2c5]
                bg-white
                p-10
                text-center
              "
            >
              <h3
                className="
                  text-lg
                  font-semibold
                  text-[#3f4c32]
                "
              >
                Sua biblioteca ainda está vazia
              </h3>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  leading-6
                  text-[#737969]
                "
              >
                Cadastre a primeira mini
                palestra e depois indique
                esse conteúdo nas sessões
                dos pacientes.
              </p>

              <button
                type="button"
                onClick={novaPalestra}
                className="
                  mt-5
                  rounded-2xl
                  bg-[#596947]
                  px-5
                  py-3
                  font-semibold
                  text-white
                "
              >
                Criar primeira palestra
              </button>
            </div>
          ) : (
            <div
              className="
                grid
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {palestras.map(
                (palestra) => (
                  <article
                    key={
                      palestra.id
                    }
                    className={`
                      overflow-hidden
                      rounded-[26px]
                      border
                      bg-white
                      shadow-sm
                      ${
                        palestra.active
                          ? "border-[#dedfd5]"
                          : "border-[#e4e4df] opacity-60"
                      }
                    `}
                  >
                    {palestra.cover_url ? (
                      <div
                        className="
                          h-44
                          overflow-hidden
                          bg-[#e9ecdf]
                        "
                      >
                        <img
                          src={
                            palestra.cover_url
                          }
                          alt=""
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      </div>
                    ) : (
                      <div
                        className="
                          flex
                          h-36
                          items-center
                          justify-center
                          bg-[#e6eadf]
                          px-6
                          text-center
                        "
                      >
                        <span
                          className="
                            text-sm
                            font-medium
                            uppercase
                            tracking-[0.15em]
                            text-[#647255]
                          "
                        >
                          Para entender melhor
                        </span>
                      </div>
                    )}

                    <div className="p-5">
                      <div
                        className="
                          mb-3
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        <Tag>
                          {labelVisibilidade(
                            palestra.visibility
                          )}
                        </Tag>

                        {palestra.category && (
                          <Tag>
                            {
                              palestra.category
                            }
                          </Tag>
                        )}

                        {!palestra.active && (
                          <Tag>
                            Desativada
                          </Tag>
                        )}
                      </div>

                      <h3
                        className="
                          text-xl
                          font-semibold
                          leading-7
                          text-[#35402c]
                        "
                      >
                        {palestra.title}
                      </h3>

                      {palestra.subtitle && (
                        <p
                          className="
                            mt-2
                            text-sm
                            leading-6
                            text-[#697060]
                          "
                        >
                          {
                            palestra.subtitle
                          }
                        </p>
                      )}

                      <div
                        className="
                          mt-4
                          flex
                          flex-wrap
                          gap-x-4
                          gap-y-1
                          text-xs
                          text-[#858a7d]
                        "
                      >
                        {palestra.duration_minutes && (
                          <span>
                            {
                              palestra.duration_minutes
                            }{" "}
                            min
                          </span>
                        )}

                        <span>
                          Criada em{" "}
                          {formatarData(
                            palestra.created_at
                          )}
                        </span>
                      </div>

                      <div
                        className="
                          mt-5
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        <a
                          href={
                            palestra.video_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="
                            rounded-xl
                            bg-[#eef1e9]
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-[#465538]
                          "
                        >
                          Assistir
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            editarPalestra(
                              palestra
                            )
                          }
                          className="
                            rounded-xl
                            border
                            border-[#d9dccf]
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-[#59604f]
                          "
                        >
                          Editar
                        </button>

                        {palestra.active && (
                          <button
                            type="button"
                            onClick={() =>
                              desativarPalestra(
                                palestra
                              )
                            }
                            className="
                              rounded-xl
                              border
                              border-[#eadada]
                              px-4
                              py-2
                              text-sm
                              font-medium
                              text-[#8b5757]
                            "
                          >
                            Desativar
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const inputClass = `
  w-full
  rounded-2xl
  border
  border-[#d9dccf]
  bg-[#fafaf6]
  px-4
  py-3
  text-[#35402c]
  outline-none
  transition
  placeholder:text-[#a3a69d]
  focus:border-[#7b8968]
  focus:bg-white
`;

function Campo({
  label,
  obrigatorio = false,
  children,
}: {
  label: string;
  obrigatorio?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="
          mb-2
          block
          text-sm
          font-semibold
          text-[#4d5842]
        "
      >
        {label}

        {obrigatorio && (
          <span className="ml-1 text-red-600">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function ResumoCard({
  titulo,
  valor,
  texto,
}: {
  titulo: string;
  valor: number;
  texto: string;
}) {
  return (
    <div
      className="
        rounded-[24px]
        border
        border-[#dedfd5]
        bg-white
        p-5
      "
    >
      <p
        className="
          text-sm
          font-medium
          text-[#737969]
        "
      >
        {titulo}
      </p>

      <p
        className="
          mt-1
          text-3xl
          font-semibold
          text-[#3f4c32]
        "
      >
        {valor}
      </p>

      <p
        className="
          mt-1
          text-xs
          text-[#909589]
        "
      >
        {texto}
      </p>
    </div>
  );
}

function Tag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      className="
        rounded-full
        bg-[#eef1e9]
        px-3
        py-1
        text-xs
        font-medium
        text-[#596947]
      "
    >
      {children}
    </span>
  );
}

function OpcaoVisibilidade({
  ativa,
  titulo,
  texto,
  onClick,
}: {
  ativa: boolean;
  titulo: string;
  texto: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-2xl
        border
        p-4
        text-left
        transition
        ${
          ativa
            ? "border-[#687858] bg-[#edf1e8]"
            : "border-[#dcded5] bg-white hover:bg-[#fafaf6]"
        }
      `}
    >
      <span
        className="
          block
          font-semibold
          text-[#3f4c32]
        "
      >
        {ativa ? "● " : "○ "}
        {titulo}
      </span>

      <span
        className="
          mt-1
          block
          text-xs
          leading-5
          text-[#737969]
        "
      >
        {texto}
      </span>
    </button>
  );
}