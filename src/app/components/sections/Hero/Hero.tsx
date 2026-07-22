import Badge from "../../ui/Badge";
import Container from "../../ui/Container";
import Glow from "../../ui/Glow";
import PrimaryButton from "../../ui/PrimaryButton";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#090312] text-white">

      <Glow className="top-[-250px] left-[-250px] h-[600px] w-[600px]" />
      <Glow className="bottom-[-250px] right-[-250px] h-[600px] w-[600px]" />

      <Container className="relative z-10">

        <div className="flex min-h-screen flex-col items-center justify-center py-20 text-center">

          <Badge>
            NOVOS CONTEÚDOS TODAS AS SEMANAS
          </Badge>

          <h1 className="mt-8 max-w-5xl text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            Clube do Tarô
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-gray-300">
            <span className="font-semibold text-white">
              Muito mais que um clube.
            </span>

            <br />
            <br />

            Uma plataforma exclusiva para quem deseja desenvolver o
            autoconhecimento através de mentorias, receber um direcionamento na vida do seu dia a dia
            semanal com os audios e pdf excluvisvos. E tem mais, cursos, biblioteca, meditações e conteúdos inéditos.

          </p>

      <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row">

  <a
    href="#planos-mensais"
    className="rounded-full bg-yellow-500 px-8 py-4 font-semibold text-black shadow-lg shadow-yellow-500/40 transition hover:scale-105"
  >
    Quero Conhecer Clube Mensal
  </a>

  <a
    href="#planos-anuais"
    className="rounded-full bg-pink-600 px-8 py-4 font-semibold text-white shadow-lg shadow-pink-600/40 transition hover:scale-105"
  >
    Quero Conhecer Clube Anual
  </a>

</div>

          <div className="mt-16 w-full max-w-5xl">

            <p className="mb-5 text-sm uppercase tracking-[0.25em] text-yellow-400">
              Conheça a plataforma em menos de 2 minutos
            </p>

            <div className="overflow-hidden rounded-[32px] border border-yellow-500/20 bg-[#12081E] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">

              <iframe
                className="aspect-video w-full rounded-2xl"
                src="https://www.youtube.com/embed/y7a6P-7hElY"
                title="Clube do Tarô"
                allowFullScreen
              />

            </div>

          </div>

        </div>

      </Container>

    </section>
  );
}