import Acoes from "@/components/acoes";

export default function LeituraPage() {
   
    const leitura = {
  assinante: "Rayssa Oliveira",
  plano: "Plano Ouro",
  periodo: "19/07/2026 até 26/07/2026",

  resumo: {
    numerologia: "9",
    orixa: "Egunitá",
    carta: "Os Livros",
    taro: "A Força",
    foco: "Proteção",
  },

  orixa:
    "Egunitá traz proteção e transformação nesta semana. Aproveite este período para fortalecer sua energia e encerrar ciclos que já cumpriram seu propósito.",

  carta:
    "A carta Os Livros indica conhecimento oculto, aprendizado e revelações importantes que chegarão no momento certo.",

  taro:
    "A carta A Força representa coragem, autocontrole e confiança para superar desafios sem perder o equilíbrio.",

  numerologia:
    "O número 9 favorece encerramentos, desapego e preparação para um novo ciclo em sua vida.",

  foco:
    "Concentre sua energia na proteção espiritual, organização da rotina e fortalecimento da sua intuição.",

  espiritual:
    "Reserve momentos para oração, meditação ou conexão com sua espiritualidade para renovar suas energias.",

  saude:
    "Cuide do descanso, da alimentação e evite excessos. O equilíbrio será fundamental durante a semana.",

  direcionamento:
    "Evite agir por impulso. Analise cada situação com calma antes de tomar decisões importantes.",

  exercicios:
    "Acenda uma vela para seu anjo da guarda, faça uma oração diária e anote seus principais aprendizados da semana.",

  conselho:
    "A verdadeira força está na serenidade. Caminhe com confiança, pois o momento favorece crescimento e proteção.",
};
  
    return (

    
    <main className="relative min-h-screen bg-gradient-to-b from-[#0E0616] via-[#160A22] to-[#09040F] text-white">

      {/* Container */}
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
{/* Efeito de brilho */}
<div className="pointer-events-none absolute inset-0 overflow-hidden">

  <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-yellow-500/5 blur-[160px]" />

  <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-purple-700/10 blur-[120px]" />

</div>
        {/* Cabeçalho */}
        {/* Cabeçalho */}

<section className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-b from-[#2A123D] to-[#14081F] p-12">

  <div className="absolute inset-0 opacity-10">
    <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.3),transparent_60%)]" />
  </div>

 <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:px-8">

    <p className="text-center text-sm uppercase tracking-[0.5em] text-yellow-500">
      Clube do Tarô
    </p>

    <h1 className="mt-4 text-center text-5xl font-bold">
      Direcionamento Semanal
    </h1>

    <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

    <h2 className="mt-8 text-center text-3xl font-semibold">
      {leitura.assinante}
    </h2>

    <p className="mt-3 text-center text-yellow-400">
      {leitura.plano}
    </p>

    <p className="mt-6 text-center text-gray-300">
     {leitura.periodo}
    </p>

  </div>

</section>

        {/* Resumo */}
        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">

         <Resumo
  titulo="Numerologia"
  valor={leitura.resumo.numerologia}
/>

<Resumo
  titulo="Orixá"
  valor={leitura.resumo.orixa}
/>

<Resumo
  titulo="Carta"
  valor={leitura.resumo.carta}
/>

<Resumo
  titulo="Tarô"
  valor={leitura.resumo.taro}
/>

<Resumo
  titulo="Foco"
  valor={leitura.resumo.foco}
/>

        </section>

        {/* Blocos */}

       <Bloco
  titulo="🕊 Orixá Regente"
  destaque={leitura.resumo.orixa}
  texto={leitura.orixa}
/>
       <Bloco
  titulo="🃏 Carta Cigana"
  destaque={leitura.resumo.carta}
  texto={leitura.carta}
/>

<Bloco
  titulo="⭐ Tarô"
  destaque={leitura.resumo.taro}
  texto={leitura.taro}
/>

<Bloco
  titulo="🔢 Numerologia"
  destaque={leitura.resumo.numerologia}
  texto={leitura.numerologia}
/>

<Bloco
  titulo="🎯 Foco da Semana"
  destaque={leitura.resumo.foco}
  texto={leitura.foco}
/>

<Bloco
  titulo="🌿 Espiritual"
  destaque=""
  texto={leitura.espiritual}
/>

<Bloco
  titulo="❤️ Saúde"
  destaque=""
  texto={leitura.saude}
/>

<Bloco
  titulo="✔ Direcionamento Prático"
  destaque=""
  texto={leitura.direcionamento}
/>

<Bloco
  titulo="📝 Exercícios da Semana"
  destaque=""
  texto={leitura.exercicios}
/>

<Bloco
  titulo="✨ Conselho Final"
  destaque=""
  texto={leitura.conselho}
/>

<Acoes leitura={leitura} />

      </div>
    </main>
  );
}

function Resumo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="group rounded-3xl border border-yellow-500/20 bg-gradient-to-b from-[#241133] to-[#170B22] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50">

      <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-yellow-500/30 bg-yellow-500/10" />

      <p className="text-center text-xs uppercase tracking-[0.25em] text-gray-400">
        {titulo}
      </p>

      <h3 className="mt-4 text-center text-xl font-semibold text-yellow-300">
        {valor}
      </h3>

    </div>
  );
}

function Bloco({
  titulo,
  destaque,
  texto,
}: {
  titulo: string;
  destaque: string;
  texto: string;
}) {
  return (

    <section className="relative mt-10 overflow-hidden rounded-3xl border border-yellow-500/20 bg-[#1A1026] shadow-2xl">

      {/* Barra superior */}
      <div className="h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />

      <div className="p-8 md:p-10">

        <div className="flex items-center gap-4">

          <div className="h-12 w-1 rounded-full bg-yellow-400" />

          <div>

            <h2 className="text-3xl font-bold text-yellow-300">
              {titulo}
            </h2>

{destaque && (
  <h3 className="mt-6 text-2xl font-semibold text-yellow-200">
    {destaque}
  </h3>
)}
            <p className="mt-1 text-sm text-gray-400">
              Direcionamento exclusivo da semana
            </p>

          </div>

        </div>

        <div className="mt-8 space-y-6">

          <p className="mt-6 text-lg leading-9 text-gray-300">
  {texto}
</p>

          <p className="text-lg leading-9 text-gray-300">
            Nesta área será exibida toda a interpretação referente
            a este tema, com uma leitura organizada e agradável.
          </p>

        </div>

      </div>

    </section>

    
  );
}