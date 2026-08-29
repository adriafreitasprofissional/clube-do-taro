const recursos = [
  {
    titulo: "Portal próprio",
    descricao:
      "Um espaço exclusivo para seus clientes acessarem conteúdos, atendimentos, recados, cursos e muito mais.",
  },
  {
    titulo: "Direcionamentos",
    descricao:
      "Organize e entregue direcionamentos de forma profissional, mantendo histórico e acompanhamento de cada cliente.",
  },
  {
    titulo: "Agenda",
    descricao:
      "Gerencie seus atendimentos, horários e compromissos em um só lugar.",
  },
  {
    titulo: "Pagamentos",
    descricao:
      "Centralize cobranças, assinaturas e pagamentos vinculados aos seus serviços.",
  },
  {
    titulo: "Loja",
    descricao:
      "Venda produtos, serviços, cursos, materiais digitais e outros itens diretamente pelo seu espaço.",
  },
  {
    titulo: "Cursos",
    descricao:
      "Disponibilize conteúdos e formações para seus clientes dentro do próprio ambiente.",
  },
  {
    titulo: "Biblioteca",
    descricao:
      "Organize livros, PDFs, materiais e conteúdos complementares para seus clientes.",
  },
  {
    titulo: "Página de vendas",
    descricao:
      "Tenha sua própria página configurável para divulgar planos, serviços e assinaturas.",
  },
];

const agentes = [
  "Gerador de Mapas",
  "Gerador de Direcionamentos",
  "AF Viral Studio",
  "Gerador de Sorteios",
  "Gerador de Baralho Cigano",
];

export default function EcossistemaProfissional() {
  return (
    <section className="relative overflow-hidden bg-[#0d0615] px-6 py-24 text-white sm:py-28 lg:px-8">
      <div className="absolute left-[-180px] top-[10%] h-[420px] w-[420px] rounded-full bg-purple-700/10 blur-[130px]" />
      <div className="absolute right-[-180px] bottom-[10%] h-[420px] w-[420px] rounded-full bg-fuchsia-700/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-yellow-400 sm:text-sm">
            Tudo em um só ambiente
          </p>

          <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Seu próprio ecossistema profissional
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-300 sm:text-lg">
            Organize seus atendimentos, cuide da experiência dos seus clientes,
            venda seus produtos e conteúdos e mantenha sua marca presente em
            cada etapa do relacionamento.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recursos.map((recurso) => (
            <div
              key={recurso.titulo}
              className="rounded-[24px] border border-purple-400/15 bg-[#160a22]/85 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.22)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-yellow-500/25"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10 text-lg text-yellow-300">
                ✦
              </div>

              <h3 className="text-xl font-bold text-white">
                {recurso.titulo}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
                {recurso.descricao}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 overflow-hidden rounded-[32px] border border-yellow-500/20 bg-[#12081e] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-yellow-400 sm:text-sm">
                Agentes inteligentes
              </p>

              <h3 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Suporte para seus atendimentos, sem tirar de você o controle.
              </h3>

              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
                Conte com agentes inteligentes para apoiar sua rotina
                profissional. Todos os resultados são editáveis para que você
                possa revisar, complementar e acrescentar sua experiência,
                interpretação e parecer antes de usar ou entregar ao cliente.
              </p>

              <div className="mt-7 inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-5 py-3 text-sm font-semibold text-purple-100">
                Todos editáveis
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {agentes.map((agente) => (
                <div
                  key={agente}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-yellow-300">
                    ✦
                  </div>

                  <span className="text-sm font-semibold text-white sm:text-base">
                    {agente}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-fuchsia-400/15 bg-gradient-to-br from-[#1c0b2b] to-[#12081e] p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300">
              Sua própria loja
            </p>

            <h3 className="mt-4 text-3xl font-bold">
              Transforme seu espaço em mais uma fonte de receita.
            </h3>

            <p className="mt-5 text-base leading-8 text-gray-300">
              Venda produtos, consultas, cursos, materiais e conteúdos
              diretamente dentro do seu ecossistema profissional.
            </p>
          </div>

          <div className="rounded-[28px] border border-yellow-500/15 bg-gradient-to-br from-[#1a1120] to-[#12081e] p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400">
              Sua própria página de vendas
            </p>

            <h3 className="mt-4 text-3xl font-bold">
              Divulgue seus planos e serviços com sua identidade.
            </h3>

            <p className="mt-5 text-base leading-8 text-gray-300">
              Tenha uma página configurável para apresentar seu trabalho,
              divulgar seus planos e conduzir seus clientes para contratação e
              pagamento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}