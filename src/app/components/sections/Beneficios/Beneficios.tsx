import Container from "../../ui/Container";

const beneficios = [
  {
    titulo: "Direcionamentos Semanais",
    descricao:
      "Receba orientações exclusivas em áudio e PDF para tomar decisões com mais segurança e clareza.",
    icone: "🔮",
  },
  {
    titulo: "Cursos Exclusivos",
    descricao:
      "Tenha acesso a cursos completos de Tarô, Baralho Cigano, espiritualidade e desenvolvimento pessoal.",
    icone: "🎓",
  },
  {
    titulo: "Biblioteca Digital",
    descricao:
      "Leia livros e materiais exclusivos produzidos por Ádria Freitas em um só lugar.",
    icone: "📚",
  },
  {
    titulo: "Meditações Guiadas",
    descricao:
      "Práticas energéticas para equilíbrio emocional, proteção espiritual e expansão da consciência.",
    icone: "🧘",
  },
  {
    titulo: "Conteúdos Inéditos",
    descricao:
      "Novos materiais adicionados constantemente para acelerar seu desenvolvimento.",
    icone: "✨",
  },
  {
    titulo: "Comunidade Exclusiva",
    descricao:
      "Faça parte de um ambiente reservado para pessoas que buscam evolução espiritual com responsabilidade.",
    icone: "💜",
  },
];

export default function Beneficios() {
  return (
    <section
  id="beneficios"
  className="py-24 px-6 bg-[#12061E]"
>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-yellow-400">
            Tudo o que você recebe
          </span>

          <h2 className="mt-6 text-4xl font-bold lg:text-5xl">
            Uma plataforma completa para transformar sua jornada
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-300">
            Muito mais do que consultas. O Clube do Tarô reúne conteúdos,
            mentorias, direcionamentos e experiências exclusivas em um único
            ambiente.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((item) => (
            <div
              key={item.titulo}
              className="rounded-3xl border border-yellow-500/20 bg-[#1A0E2A] p-8 transition duration-300 hover:border-yellow-400 hover:-translate-y-2"
            >
              <div className="mb-5 text-5xl">{item.icone}</div>

              <h3 className="text-xl font-bold">{item.titulo}</h3>

              <p className="mt-4 leading-7 text-gray-300">
                {item.descricao}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}