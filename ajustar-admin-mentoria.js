const fs = require("fs");

const arquivo = "src/app/admin/agenda/mentorias/page.tsx";
const texto = fs.readFileSync(arquivo, "utf8");
const linhas = texto.split(/\r?\n/);

if (!linhas[1050]?.includes("convidadosIncluidos.length > 0")) {
  throw new Error("A linha inicial esperada não foi encontrada. Nada foi alterado.");
}

if (!linhas[1249]?.includes("})()}")) {
  throw new Error("A linha final esperada não foi encontrada. Nada foi alterado.");
}

const novoBloco = `
                        <div className="mt-3 rounded-2xl border border-blue-400/20 bg-blue-400/[0.03] p-4">
                          <p className="text-sm font-bold text-blue-100">
                            Convidados especiais ({convidadosIncluidos.length})
                          </p>
                          <p className="mt-1 text-xs text-blue-200/70">
                            Estes assinantes receberam acesso especial somente para esta mentoria.
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                {evento.event_type === "group" &&
                  (() => {
                    const clientesPorId = new Map(
                      (dados?.active_clients || []).map((cliente: any) => [
                        cliente.id,
                        cliente,
                      ])
                    );

                    const itensParticipantes = participantes.map(
                      (participante: any) => {
                        const cliente =
                          clientesPorId.get(participante.client_id) || {
                            id: participante.client_id,
                            nome: participante.client_name,
                            nome_referencia: participante.client_name,
                            plano: participante.client_plan,
                          };

                        return {
                          cliente,
                          participante,
                        };
                      }
                    );

                    const idsComParticipacao = new Set(
                      participantes.map((item: any) => item.client_id)
                    );

                    const diamantesSemResposta = (dados?.diamond_clients || [])
                      .filter(
                        (cliente: any) =>
                          !idsComParticipacao.has(cliente.id)
                      )
                      .map((cliente: any) => ({
                        cliente,
                        participante: undefined,
                      }));

                    const todos = [
                      ...itensParticipantes,
                      ...diamantesSemResposta,
                    ];

                    const aguardando = todos.filter(
                      (item: any) =>
                        item.participante?.response !== "confirmed" &&
                        item.participante?.response !== "declined"
                    );

                    const confirmados = todos.filter(
                      (item: any) =>
                        item.participante?.response === "confirmed"
                    );

                    const recusados = todos.filter(
                      (item: any) =>
                        item.participante?.response === "declined"
                    );

                    const chaveAguardando = \`\${evento.id}-aguardando\`;
                    const chaveConfirmados = \`\${evento.id}-confirmados\`;
                    const chaveRecusados = \`\${evento.id}-recusados\`;

                    return (
                      <div className="mt-5 border-t border-purple-500/20 pt-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-base font-bold uppercase tracking-wide text-yellow-300">
                              Participantes da Mentoria
                            </p>
                            <p className="mt-1 text-sm text-purple-200/70">
                              Mentorados Diamante e convidados especiais desta mentoria.
                            </p>
                          </div>

                          <div className="rounded-xl border border-green-400/20 bg-green-400/[0.05] px-4 py-2">
                            <span className="text-sm font-bold text-green-200">
                              {confirmados.length} confirmados
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3">
                          <div className="overflow-hidden rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04]">
                            <button
                              type="button"
                              onClick={() =>
                                alternarSecao(chaveAguardando, true)
                              }
                              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                            >
                              <span className="text-base font-bold text-yellow-200">
                                Aguardando resposta ({aguardando.length})
                              </span>
                              <span className="text-xl text-yellow-300">
                                {secaoEstaAberta(chaveAguardando, true)
                                  ? "▾"
                                  : "›"}
                              </span>
                            </button>

                            {secaoEstaAberta(chaveAguardando, true) && (
                              <div className="grid gap-2 border-t border-yellow-400/10 p-3">
                                {aguardando.length === 0 ? (
                                  <p className="rounded-xl bg-black/20 p-4 text-sm text-purple-300/70">
                                    Ninguém aguardando resposta.
                                  </p>
                                ) : (
                                  aguardando.map((item: any) =>
                                    linhaParticipante(
                                      evento,
                                      item,
                                      "pending"
                                    )
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          <div className="overflow-hidden rounded-2xl border border-green-400/20 bg-green-400/[0.04]">
                            <button
                              type="button"
                              onClick={() =>
                                alternarSecao(chaveConfirmados)
                              }
                              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                            >
                              <span className="text-base font-bold text-green-200">
                                Confirmados ({confirmados.length})
                              </span>
                              <span className="text-xl text-green-300">
                                {secaoEstaAberta(chaveConfirmados)
                                  ? "▾"
                                  : "›"}
                              </span>
                            </button>

                            {secaoEstaAberta(chaveConfirmados) && (
                              <div className="grid gap-2 border-t border-green-400/10 p-3">
                                {confirmados.length === 0 ? (
                                  <p className="rounded-xl bg-black/20 p-4 text-sm text-purple-300/70">
                                    Ainda não há confirmações.
                                  </p>
                                ) : (
                                  confirmados.map((item: any) =>
                                    linhaParticipante(
                                      evento,
                                      item,
                                      "confirmed"
                                    )
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          <div className="overflow-hidden rounded-2xl border border-red-400/20 bg-red-400/[0.03]">
                            <button
                              type="button"
                              onClick={() =>
                                alternarSecao(chaveRecusados)
                              }
                              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                            >
                              <span className="text-base font-bold text-red-200">
                                Não participarão ({recusados.length})
                              </span>
                              <span className="text-xl text-red-300">
                                {secaoEstaAberta(chaveRecusados)
                                  ? "▾"
                                  : "›"}
                              </span>
                            </button>

                            {secaoEstaAberta(chaveRecusados) && (
                              <div className="grid gap-2 border-t border-red-400/10 p-3">
                                {recusados.length === 0 ? (
                                  <p className="rounded-xl bg-black/20 p-4 text-sm text-purple-300/70">
                                    Ninguém recusou esta mentoria.
                                  </p>
                                ) : (
                                  recusados.map((item: any) =>
                                    linhaParticipante(
                                      evento,
                                      item,
                                      "declined"
                                    )
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
`.trim().split("\n");

const final = [
  ...linhas.slice(0, 1050),
  ...novoBloco,
  ...linhas.slice(1250),
];

fs.writeFileSync(arquivo, final.join("\n"), "utf8");

console.log("OK - painel unificado gravado em UTF-8.");
