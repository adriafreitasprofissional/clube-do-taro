"use client";

import Container from "../ui/Container";
const planos = [

  {
    nome: "Bronze",
    valor: 29.30,
    produtoId: "bronze",
    cor: "#B87333",
    glow: "rgba(184,115,51,.18)",
    badge: "",
    beneficios: [
      "Direcionamentos Semanais",
      "Biblioteca Digital",
      "Conteúdos Exclusivos",
    ],
  },

  {
    nome: "Prata",
    valor: 49.91,
    produtoId: "prata",
    cor: "#D9D9E6",
    glow: "rgba(217,217,230,.16)",
    badge: "",
    beneficios: [
      "Tudo do Bronze",
      "Cursos Exclusivos",
      "Meditações Guiadas",
    ],
  },

  {
    nome: "Ouro",
    valor: 74.00,
    produtoId: "ouro",
    cor: "#E9C46A",
    glow: "rgba(233,196,106,.25)",
    badge: "Mais Escolhido",
    beneficios: [
      "Tudo do Prata",
      "Conteúdos Premium",
      "Prioridade nas Novidades",
    ],
  },

  {
    nome: "Diamante",
    valor: 164.00,
    produtoId: "diamante",
    cor: "#8ED8FF",
    glow: "rgba(142,216,255,.22)",
    badge: "Experiência Completa",
    beneficios: [
      "Acesso Completo",
      "Todos os Cursos",
      "Todos os Benefícios",
    ],
  },
];

export default function PlanosMensais() {
async function comprar(plano: (typeof planos)[number]) {
  try {
    const resposta = await fetch(
      "https://www.magiaoriente.com.br/api/pagamentos/mercadopago/criar-preferencia",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plano: plano.produtoId,
          valor: plano.valor,
        }),
      }
    );

    const dados = await resposta.json();

    console.log("STATUS:", resposta.status);
    console.log("RESPOSTA:", dados);

    if (!resposta.ok || !dados.ok) {
      alert(JSON.stringify(dados, null, 2));
      return;
    }

    window.location.href = dados.initPoint;
  } catch (erro) {
    console.error(erro);
    alert("Erro ao iniciar o pagamento.");
  }
 }
  return (
    <section
      id="planos-mensais"
      className="bg-[#0B0616] py-28 text-white"
    >
      <Container>

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-yellow-400">
            Assinaturas Mensais
          </span>

          <h2 className="mt-6 text-5xl font-bold">
            Escolha seu Plano
          </h2>

          <p className="mt-6 text-lg text-gray-300">
            Comece hoje e tenha acesso imediato ao Clube do Tarô.
          </p>

        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-4">

          {planos.map((plano) => (
            
<div
  key={plano.nome}
  className="group relative overflow-hidden rounded-[34px] border bg-[#1B1029] p-10 transition-all duration-500 hover:-translate-y-2"
  style={{
    borderColor: `${plano.cor}55`,
    boxShadow: `0 10px 35px ${plano.glow}`,
  }}
>
 <div className="text-center">

  {plano.badge && (
    <span
      className="mb-6 inline-flex rounded-full px-4 py-1 text-[11px] tracking-[.25em] uppercase"
      style={{
        color: plano.cor,
        border: `1px solid ${plano.cor}55`,
        background: `${plano.cor}15`,
      }}
    >
      {plano.badge}
    </span>
  )}

  <div
    className="mb-3 text-sm tracking-[0.45em] uppercase"
    style={{ color: plano.cor }}
  >
    ✦ ✦ ✦
  </div>

  <h3
    className="font-title text-[42px] font-medium"
    style={{ color: plano.cor }}
  >
    {plano.nome}
  </h3>

  <div
  className="mt-5 font-title text-[30px] leading-none font-normal"
  style={{ color: plano.cor }}
>
  {plano.valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
</div>

  <p className="mt-3 text-[11px] uppercase tracking-[0.45em] text-white/45">
    assinatura mensal
  </p>

</div>             

<ul className="mt-12 space-y-7">

  {plano.beneficios.map((item) => (
    <li
      key={item}
      className="flex items-start gap-3 text-[15px] leading-8 text-white/90"
    >
      <span

  className="mt-2 inline-block h-1.5 w-1.5 rounded-full"
  style={{
    background: plano.cor,
    boxShadow: `0 0 10px ${plano.glow}`,
  }}
/>

      <span>{item}</span>
    </li>
  ))}

</ul>

<button
  onClick={() => comprar(plano)}
  className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-700 via-fuchsia-600 to-purple-600 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-violet-500/40"
>
  Quero fazer parte

  </button>

            </div>
          ))}

        </div>

      </Container>
    </section>
  );
}
