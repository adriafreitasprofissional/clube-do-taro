"use client";

import Container from "../ui/Container";
import { useState } from "react";

const planos = [
  {
  nome: "Bronze",
  produtoId: "bronze-anual",
  cor: "#C084FC",
  glow: "rgba(192,132,252,.28)",
  badge: "15% OFF",
  parcelas: "12x",
  valor: "24,91",
  pix: "R$ 298,86",
  descricao: "Economize 15% escolhendo o plano anual.",
  beneficios: [
    "Tudo do Bronze",
    "Economia de 15%",
    "12 meses de acesso",
    "Conteúdo atualizado",
  ],

},
  {
    nome: "Prata",
    produtoId: "prata-anual",
    cor: "#D1D5DB",
    glow: "rgba(209,213,219,.25)",
    badge: "15% OFF",
    parcelas: "12x",
    valor: "40,92",
    pix: "R$ 491,00",
    descricao: "Mais benefícios pagando menos.",
    beneficios: [
      "Tudo do Prata",
      "Economia de 15%",
      "12 meses de acesso",
      "Atualizações inclusas",
    ],
  
  },
  {
    nome: "Ouro",
    produtoId: "ouro-anual",
    cor: "#FACC15",
    glow: "rgba(250,204,21,.28)",
    badge: "MAIS VENDIDO",
    parcelas: "12x",
    valor: "62,90",
    pix: "R$ 754,80",
    descricao: "Plano anual para quem busca evolução constante.",
    beneficios: [
      "Tudo do Ouro",
      "Economia de 15%",
      "12 meses de acesso",
      "Novidades inclusas",
    ],
   
  },
  {
    nome: "Diamante",
    produtoId: "diamante-anual",
    cor: "#60A5FA",
    glow: "rgba(96,165,250,.28)",
    badge: "VIP",
    parcelas: "12x",
    valor: "139,40",
    pix: "R$ 1.672,80",
    descricao: "A experiência completa com o melhor custo-benefício.",
    beneficios: [
      "Tudo liberado",
      "Economia de 15%",
      "12 meses de acesso",
      "Todos os benefícios VIP",
    ],
  
  },
];

export default function PlanosAnuais() {

const [email, setEmail] = useState("");
const [nome, setNome] = useState("");
const [planoSelecionado, setPlanoSelecionado] =
  useState<(typeof planos)[number] | null>(null);

async function comprar(plano: (typeof planos)[number]) {
  if (!nome.trim() || !email.trim()) {
    alert("Informe seu nome e e-mail.");
    return;
  }

  try {
    const resposta = await fetch(
      "/api/pagamentos/mercadopago/criar-preferencia",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plano: plano.nome,
          valor: Number(plano.pix.replace("R$", "").replace(".", "").replace(",", ".")),
          nome,
          email,
        }),
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.error(dados);
      alert("Erro ao criar pagamento.");
      return;
    }

    window.location.href = dados.initPoint;
  } catch (erro) {
    console.error(erro);
    alert("Erro ao iniciar pagamento.");
  }
}


  return (
    <section id="planos-anuais" className="bg-[#12081E] py-24 text-white">

{planoSelecionado && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="w-full max-w-md rounded-2xl bg-[#1B1029] p-8">

      <h3 className="mb-6 text-2xl font-bold text-white">
        Finalizar assinatura anual
      </h3>

      <input
        type="text"
        placeholder="Seu nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="mb-4 w-full rounded-lg border border-white/20 bg-[#2A183F] p-3 text-white"
      />

      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-6 w-full rounded-lg border border-white/20 bg-[#2A183F] p-3 text-white"
      />

      <div className="flex gap-3">

        <button
          onClick={() => setPlanoSelecionado(null)}
          className="flex-1 rounded-lg border border-white/20 py-3 text-white"
        >
          Cancelar
        </button>

        <button
          onClick={() => comprar(planoSelecionado)}
          className="flex-1 rounded-lg bg-violet-600 py-3 font-semibold text-white"
        >
          Continuar
        </button>

      </div>

    </div>
  </div>
)}


      <Container>

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
            ⭐ ECONOMIZE 15%
          </span>

          <h2 className="mt-6 font-serif text-5xl font-semibold lg:text-6xl">
            Assinaturas Anuais
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-300">
            Garanta um ano inteiro de acesso e economize 15% pagando
            à vista no PIX.
          </p>

        </div>
      <div className="mx-auto grid max-w-[1500px] gap-6 md:grid-cols-2 xl:grid-cols-4">
          {planos.map((plano) => (
            <div
              key={plano.nome}
              className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#1A1028] p-10 transition-all duration-300 hover:-translate-y-2"
style={{
  boxShadow: `0 0 18px ${plano.glow}`
}}
            >
              <div
  className="mb-6 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.25em]"
  style={{
    background: `${plano.cor}20`,
    color: plano.cor,
    border: `1px solid ${plano.cor}40`,
  }}
>
  {plano.badge}
</div>

              <h3
  className="font-serif text-4xl font-semibold tracking-wide"
  style={{ color: plano.cor }}
>
  {plano.nome}
</h3>

              <p className="mt-3 min-h-[60px] text-sm leading-6 text-gray-300">
                {plano.descricao}
              </p>

              <div className="mt-8">
                <div className="mt-8 flex items-end gap-2">

  <span className="text-lg text-gray-400">
    {plano.parcelas} de
  </span>

  <span className="text-lg text-gray-400">
    R$
  </span>

  <span
    className="text-5xl font-bold leading-none"
    style={{ color: plano.cor }}
  >
    {plano.valor}
  </span>

  <span className="text-base text-gray-500 mb-1">*</span>

</div>

                <p className="mt-2 text-sm uppercase tracking-[0.25em] text-gray-400">
  NO CARTÃO
</p>
              </div>

              <div
  className="mt-6 rounded-2xl border bg-black/20 p-4"
  style={{
    borderColor: `${plano.cor}40`,
  }}
>
                <p
  className="text-xs font-semibold uppercase tracking-[0.3em]"
  style={{ color: plano.cor }}
>
  À VISTA NO PIX
</p>

                <p className="mt-2 text-2xl font-bold text-white">
  {plano.pix}
</p>
              </div>

              <ul className="mt-8 space-y-4">
                {plano.beneficios.map((beneficio) => (
                  <li
  key={beneficio}
  className="flex items-center gap-3 text-gray-300"
>
  <span
    className="h-2.5 w-2.5 rounded-full"
    style={{
      background: plano.cor,
      boxShadow: `0 0 12px ${plano.cor}`,
    }}
  />
  {beneficio}
</li>
                ))}
              </ul>

             <div className="mt-10">
 
   <button
  onClick={() => setPlanoSelecionado(plano)}
  className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-700 via-fuchsia-600 to-purple-600 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-violet-500/40"
>
  Quero fazer parte
</button>

</div>
              <p className="mt-6 text-center text-xs text-gray-500">
                *Parcelamento sujeito aos juros da operadora do cartão.
              </p>
            </div>
          ))}
        </div>

      </Container>

    </section>
  );
}
       