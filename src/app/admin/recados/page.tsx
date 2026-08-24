"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  nome: string | null;
  email: string | null;
  status: string | null;
};

type Recado = {
  id: string;
  client_id: string | null;
  titulo: string;
  mensagem: string;
  tipo_destino: string | null;
  publicado: boolean;
  created_at: string;
};

type Leitura = {
  message_id: string;
  client_id: string;
  lido_em: string;
};

export default function Page() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [recados, setRecados] = useState<Recado[]>([]);
  const [leituras, setLeituras] = useState<Leitura[]>([]);

  const [destino, setDestino] = useState<"todos" | "cliente">("todos");
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [titulo, setTitulo] = useState("Você tem um recado da Ádria");
  const [mensagem, setMensagem] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [recadoAberto, setRecadoAberto] = useState<string | null>(null);

  async function carregarDados() {
    setCarregando(true);

    const [
      { data: clientesData, error: clientesError },
      { data: recadosData, error: recadosError },
      { data: leiturasData, error: leiturasError },
    ] = await Promise.all([
      supabase
        .from("club_clients")
        .select("id, nome, email, status")
        .eq("status", "ativo")
        .order("nome", { ascending: true }),

      supabase
        .from("client_messages")
        .select(
          "id, client_id, titulo, mensagem, tipo_destino, publicado, created_at"
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("client_message_reads")
        .select("message_id, client_id, lido_em"),
    ]);

    if (clientesError) {
      console.error("Erro ao carregar clientes:", clientesError);
    }

    if (recadosError) {
      console.error("Erro ao carregar recados:", recadosError);
    }

    if (leiturasError) {
      console.error("Erro ao carregar leituras:", leiturasError);
    }

    setClientes(clientesData || []);
    setRecados(recadosData || []);
    setLeituras(leiturasData || []);

    setCarregando(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function publicarRecado() {
    if (!mensagem.trim()) {
      alert("Digite a mensagem do recado.");
      return;
    }

    if (destino === "cliente" && !clienteSelecionado) {
      alert("Selecione o assinante.");
      return;
    }

    setPublicando(true);

    const { error } = await supabase
      .from("client_messages")
      .insert({
        client_id:
          destino === "cliente"
            ? clienteSelecionado
            : null,
        titulo: titulo.trim() || "Você tem um recado da Ádria",
        mensagem: mensagem.trim(),
        tipo_destino: destino === "todos" ? "todos" : "cliente",
        publicado: true,
      });

    if (error) {
      console.error("Erro ao publicar recado:", error);
      alert("Erro ao publicar o recado.");
      setPublicando(false);
      return;
    }

    alert("Recado publicado com sucesso.");

    setMensagem("");
    setTitulo("Você tem um recado da Ádria");
    setDestino("todos");
    setClienteSelecionado("");

    await carregarDados();

    setPublicando(false);
  }

  function quantidadeDestinatarios(recado: Recado) {
    if (recado.client_id) {
      return 1;
    }

    return clientes.length;
  }

  function quantidadeLeituras(recado: Recado) {
    return leituras.filter(
      (leitura) => leitura.message_id === recado.id
    ).length;
  }

  function clientesQueLeram(recado: Recado) {
    const ids = leituras
      .filter((leitura) => leitura.message_id === recado.id)
      .map((leitura) => leitura.client_id);

    return clientes.filter((cliente) => ids.includes(cliente.id));
  }

  function clientesQueNaoLeram(recado: Recado) {
    if (recado.client_id) {
      const cliente = clientes.find(
        (item) => item.id === recado.client_id
      );

      if (!cliente) return [];

      const leu = leituras.some(
        (leitura) =>
          leitura.message_id === recado.id &&
          leitura.client_id === cliente.id
      );

      return leu ? [] : [cliente];
    }

    const idsQueLeram = leituras
      .filter((leitura) => leitura.message_id === recado.id)
      .map((leitura) => leitura.client_id);

    return clientes.filter(
      (cliente) => !idsQueLeram.includes(cliente.id)
    );
  }

  return (
    <main className="min-h-screen bg-[#08020d] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* CABEÇALHO */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
            Relacionamento
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-yellow-400">
            ✦ Recados da Ádria
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-purple-200">
            Um espaço para enviar mensagens especiais aos assinantes
            e acompanhar quem já recebeu e quem já leu.
          </p>
        </div>

        {/* NOVO RECADO */}
        <section className="rounded-3xl border border-purple-500/20 bg-[#120b20] p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-yellow-300">
              ✦ Novo Recado
            </h2>

            <p className="mt-1 text-sm text-purple-300">
              Escolha quem receberá a mensagem.
            </p>
          </div>

          {/* DESTINO */}
          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setDestino("todos");
                setClienteSelecionado("");
              }}
              className={`rounded-2xl border p-4 text-left transition ${
                destino === "todos"
                  ? "border-yellow-400/60 bg-yellow-500/10"
                  : "border-purple-500/20 bg-[#19172f] hover:border-purple-400/40"
              }`}
            >
              <p className="font-bold text-yellow-300">
                ✦ Todos os assinantes ativos
              </p>

              <p className="mt-1 text-xs text-purple-300">
                Envia para todos os clientes ativos.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDestino("cliente")}
              className={`rounded-2xl border p-4 text-left transition ${
                destino === "cliente"
                  ? "border-yellow-400/60 bg-yellow-500/10"
                  : "border-purple-500/20 bg-[#19172f] hover:border-purple-400/40"
              }`}
            >
              <p className="font-bold text-yellow-300">
                👤 Um assinante específico
              </p>

              <p className="mt-1 text-xs text-purple-300">
                Envia somente para uma pessoa.
              </p>
            </button>
          </div>

          {/* CLIENTE */}
          {destino === "cliente" && (
            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-purple-200">
                Escolha o assinante
              </label>

              <select
                value={clienteSelecionado}
                onChange={(e) =>
                  setClienteSelecionado(e.target.value)
                }
                className="w-full rounded-xl border border-purple-500/30 bg-[#19172f] px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
              >
                <option value="">
                  Selecione um assinante...
                </option>

                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome || "Sem nome"} —{" "}
                    {cliente.email || "sem e-mail"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* TÍTULO */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-purple-200">
              Título
            </label>

            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-xl border border-purple-500/30 bg-[#19172f] px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
            />
          </div>

          {/* MENSAGEM */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-purple-200">
              Mensagem
            </label>

            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={6}
              placeholder="Escreva aqui o seu recado..."
              className="w-full resize-none rounded-xl border border-purple-500/30 bg-[#19172f] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-purple-500 focus:border-yellow-400"
            />
          </div>

          {/* PUBLICAR */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={publicarRecado}
              disabled={publicando}
              className="rounded-xl border border-yellow-400/50 bg-yellow-500/10 px-6 py-3 text-sm font-extrabold text-yellow-300 transition hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {publicando
                ? "Publicando..."
                : "✦ Publicar Recado"}
            </button>
          </div>
        </section>

        {/* HISTÓRICO */}
        <section className="mt-8 rounded-3xl border border-purple-500/20 bg-[#120b20] p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-yellow-300">
              ✦ Histórico de Recados
            </h2>

            <p className="mt-1 text-sm text-purple-300">
              Acompanhe os recados publicados e as leituras individuais.
            </p>
          </div>

          {carregando ? (
            <p className="text-sm text-purple-300">
              Carregando histórico...
            </p>
          ) : recados.length === 0 ? (
            <div className="rounded-2xl border border-purple-500/20 bg-[#19172f] p-6 text-center">
              <p className="text-sm text-purple-300">
                Nenhum recado publicado ainda.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recados.map((recado) => {
                const total = quantidadeDestinatarios(recado);
                const lidos = quantidadeLeituras(recado);
                const pendentes = Math.max(total - lidos, 0);
                const aberto = recadoAberto === recado.id;

                const clienteDestino = recado.client_id
                  ? clientes.find(
                      (cliente) =>
                        cliente.id === recado.client_id
                    )
                  : null;

                return (
                  <div
                    key={recado.id}
                    className="rounded-2xl border border-purple-500/20 bg-[#19172f] p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xl text-yellow-300">
                            ✦
                          </span>

                          <h3 className="font-bold text-white">
                            {recado.titulo}
                          </h3>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-purple-200">
                          {recado.mensagem}
                        </p>

                        <p className="mt-3 text-xs text-purple-400">
                          {new Date(
                            recado.created_at
                          ).toLocaleString("pt-BR")}
                        </p>

                        <p className="mt-1 text-xs text-purple-400">
                          {clienteDestino
                            ? `Para: ${
                                clienteDestino.nome ||
                                "Assinante"
                              }`
                            : "Para: Todos os assinantes ativos"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setRecadoAberto(
                            aberto ? null : recado.id
                          )
                        }
                        className="shrink-0 rounded-xl border border-yellow-400/30 bg-yellow-500/5 px-4 py-2 text-xs font-bold text-yellow-300 transition hover:bg-yellow-500/10"
                      >
                        {aberto
                          ? "Fechar detalhes"
                          : "Ver leituras"}
                      </button>
                    </div>

                    {/* INDICADORES */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-purple-500/20 bg-[#100b1b] p-4">
                        <p className="text-xs text-purple-400">
                          Receberam
                        </p>

                        <p className="mt-1 text-xl font-extrabold text-white">
                          {total}
                        </p>
                      </div>

                      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                        <p className="text-xs text-green-300">
                          Leram
                        </p>

                        <p className="mt-1 text-xl font-extrabold text-green-200">
                          {lidos}
                        </p>
                      </div>

                      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                        <p className="text-xs text-yellow-300">
                          Ainda não leram
                        </p>

                        <p className="mt-1 text-xl font-extrabold text-yellow-200">
                          {pendentes}
                        </p>
                      </div>
                    </div>

                    {/* DETALHES */}
                    {aberto && (
                      <div className="mt-5 grid gap-5 border-t border-purple-500/20 pt-5 md:grid-cols-2">
                        <div>
                          <h4 className="mb-3 text-sm font-extrabold text-green-300">
                            ✓ Quem leu
                          </h4>

                          {clientesQueLeram(recado).length ===
                          0 ? (
                            <p className="text-xs text-purple-400">
                              Ninguém leu ainda.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {clientesQueLeram(recado).map(
                                (cliente) => {
                                  const leitura =
                                    leituras.find(
                                      (item) =>
                                        item.message_id ===
                                          recado.id &&
                                        item.client_id ===
                                          cliente.id
                                    );

                                  return (
                                    <div
                                      key={cliente.id}
                                      className="rounded-xl bg-green-500/5 px-3 py-2"
                                    >
                                      <p className="text-sm text-white">
                                        {cliente.nome ||
                                          "Sem nome"}
                                      </p>

                                      <p className="text-xs text-green-300">
                                        {leitura?.lido_em
                                          ? new Date(
                                              leitura.lido_em
                                            ).toLocaleString(
                                              "pt-BR"
                                            )
                                          : "Lido"}
                                      </p>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="mb-3 text-sm font-extrabold text-yellow-300">
                            ○ Ainda não leram
                          </h4>

                          {clientesQueNaoLeram(recado)
                            .length === 0 ? (
                            <p className="text-xs text-green-300">
                              Todos já leram.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {clientesQueNaoLeram(recado).map(
                                (cliente) => (
                                  <div
                                    key={cliente.id}
                                    className="rounded-xl bg-yellow-500/5 px-3 py-2"
                                  >
                                    <p className="text-sm text-white">
                                      {cliente.nome ||
                                        "Sem nome"}
                                    </p>

                                    <p className="text-xs text-yellow-300">
                                      Aguardando leitura
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}