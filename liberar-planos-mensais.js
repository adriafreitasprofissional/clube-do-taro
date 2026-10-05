const fs = require("fs");

const p = "src/app/components/sections/PlanosMensais.tsx";
const linhas = fs.readFileSync(p, "utf8").split(/\r?\n/);

// Confere o arquivo antes de alterar
if (!linhas[149]?.includes("Vagas esgotadas")) {
  throw new Error("Linha esperada do botão não encontrada. Nada foi alterado.");
}

if (!linhas[169]?.includes("As vagas para novas assinaturas mensais estão esgotadas.")) {
  throw new Error("Texto esperado não encontrado. Nada foi alterado.");
}

// Substitui linhas 145 a 151
linhas.splice(
  144,
  7,
  '        {planoSelecionado.nome === "Bronze" ? (',
  '          <button',
  '            type="button"',
  '            disabled',
  '            className="mt-2 flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-center text-sm font-semibold text-white/55"',
  '          >',
  '            Disponível somente no plano anual',
  '          </button>',
  '        ) : (',
  '          <button',
  '            type="button"',
  '            onClick={() => comprar(planoSelecionado)}',
  '            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-700 via-fuchsia-600 to-purple-600 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02]"',
  '          >',
  '            Ir para pagamento',
  '          </button>',
  '        )}'
);

// Como acrescentamos 10 linhas acima, o texto original mudou de posição.
// Procuramos pelo conteúdo para não depender da nova numeração.
const indiceTexto = linhas.findIndex(
  (linha) => linha.includes("As vagas para novas assinaturas mensais estão esgotadas.")
);

if (indiceTexto === -1) {
  throw new Error("Texto das assinaturas não encontrado após alteração.");
}

linhas[indiceTexto] =
  "            Prata, Ouro e Diamante estão disponíveis também na assinatura mensal.";
linhas[indiceTexto + 1] =
  "            O plano Bronze está disponível exclusivamente na modalidade anual.";

fs.writeFileSync(p, linhas.join("\n"), "utf8");

console.log("OK - mensal liberado para Prata, Ouro e Diamante; Bronze permanece somente anual.");
