import Link from "next/link";

const aulas = [
  { dia: 1 },
  { dia: 2 },
  { dia: 3 },
  { dia: 4 },
  { dia: 5 },
  { dia: 6 },
  { dia: 7 },
];

export default function CursoPage() {
  return (
    <main className="min-h-screen bg-[#140B1D] text-white">

      <img
        src="/images/courses/desafio-pombagira/banner-desafio.png"
        alt="Desafio da Pombagira"
        className="w-full h-80 object-cover"
      />

      <div className="max-w-6xl mx-auto px-8 py-10">

        <h1 className="text-5xl font-bold text-yellow-400">
          Desafio do Poder da Sua Pombagira
        </h1>

        <p className="mt-5 text-xl text-gray-300">
          Bem-vinda ao desafio. Cada dia foi preparado para conduzir você em uma jornada de fortalecimento espiritual.
        </p>

        <h2 className="text-3xl font-bold mt-14 mb-8">
          Aulas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center">

          {aulas.map((aula) => (
            <Link
              key={aula.dia}
              href={`/aula/${aula.dia}`}
            >
              <div className="rounded-2xl bg-[#241236] overflow-hidden hover:scale-[1.02] transition cursor-pointer">

                <img
  src={`/images/courses/desafio-pombagira/dia${aula.dia}.png`}
  alt={`Dia ${aula.dia}`}
  className="w-full h-auto object-cover"
/>

                <div className="p-5">

                  <h3 className="text-2xl font-bold text-yellow-400">
                    Dia {aula.dia}
                  </h3>

                  <p className="text-gray-300 mt-2">
                    Clique para assistir esta aula.
                  </p>

                </div>

              </div>

            </Link>
          ))}

        </div>

      </div>

    </main>
  );
}