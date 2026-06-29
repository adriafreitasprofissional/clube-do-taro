"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
}


export default function MeusCursosPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [nome, setNome] = useState("Guardiã");

  useEffect(() => {
    carregarCursos();
  }, []);

  async function carregarCursos() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setNome(
      user.user_metadata?.nome ||
        user.email?.split("@")[0] ||
        "Guardiã"
    );

   // Localiza o cliente pelo e-mail
const { data: cliente, error: erroCliente } = await supabase
  .from("club_clients")
  .select("id")
  .eq("email", user.email)
  .single();

if (erroCliente || !cliente) {
  console.error(erroCliente);
  setLoading(false);
  return;
}

// Localiza o curso liberado para esse cliente
const { data: aluno, error: erroAluno } = await supabase
  .from("course_students")
  .select("course_id")
  .eq("club_client_id", cliente.id)
  .single();

if (erroAluno || !aluno?.course_id) {
  console.error(erroAluno);
  setCursos([]);
  setLoading(false);
  return;
}

    const { data: cursos, error } = await supabase
      .from("courses")
      .select("id, titulo, descricao, imagem_url")
      .eq("id", aluno.course_id);

   if (error) {
  alert(JSON.stringify(error, null, 2));
  console.log(error);
  setCursos([]);
  setLoading(false);
  return;
}

setCursos(cursos || []);
setLoading(false);
  }

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#140B1D] flex items-center justify-center text-white text-2xl">
        Carregando...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#140B1D] text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="w-72 bg-[#1A0E25] border-r border-yellow-600/20 p-8">

          <h1 className="text-3xl font-bold text-yellow-400">
            CLUBE DO TARÔ
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Área de Estudos
          </p>

          <div className="mt-12">
            <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/30 p-5">
              <p className="text-sm text-gray-300">
                Bem-vinda
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {nome}
              </h2>
            </div>
          </div>

          <nav className="mt-12 space-y-3">
            <div className="rounded-xl bg-yellow-500 text-[#140B1D] px-5 py-4 font-bold">
              📚 Meus Cursos
            </div>
          </nav>

          <button
            onClick={sair}
            className="mt-16 w-full rounded-xl bg-red-600 py-4 font-bold hover:bg-red-500"
          >
            Sair
          </button>

        </aside>

        {/* CONTEÚDO */}
        <section className="flex-1 overflow-auto">

          <div className="mx-auto max-w-7xl px-12 py-12">

            <p className="uppercase tracking-[0.4em] text-purple-300">
              ÁREA DE ESTUDOS
            </p>

            <h1 className="mt-3 text-6xl font-black text-yellow-400">
              Meus Cursos
            </h1>

            <p className="mt-5 text-xl text-gray-300">
              O conhecimento liberta.
            </p>

            <div className="mt-12">

              {cursos.length === 0 ? (

                <div className="rounded-3xl border border-yellow-500/20 bg-[#241236] p-16 text-center">

                  <h2 className="text-3xl font-bold text-yellow-400">
                    Nenhum curso liberado
                  </h2>

                  <p className="mt-4 text-lg text-gray-400">
                    Assim que um curso for liberado ele aparecerá aqui.
                  </p>

                </div>

              ) : (

                cursos.map((curso) => (

                  <Link
                    key={curso.id}
                   href="/cursos/pombogira"
                    className="block mb-10"
                  >

                    <div className="overflow-hidden rounded-[32px] border border-yellow-500/20 bg-[#241236] shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-yellow-500/60">

                      <div className="relative">

                        <img
  src={curso.imagem_url}
  alt={curso.titulo}
  className="h-[420px] w-full object-cover"
/>

                        <div className="absolute inset-0 bg-gradient-to-t from-[#140B1D] via-transparent to-transparent" />

                        <div className="absolute bottom-8 left-8">
                          <span className="rounded-full bg-yellow-500 px-5 py-2 text-sm font-bold text-[#140B1D]">
                            CURSO LIBERADO
                          </span>
                        </div>

                      </div>

                      <div className="grid gap-10 p-12 lg:grid-cols-[1fr_260px]">

                        <div>

                          <p className="uppercase tracking-[0.3em] text-purple-300">
                            Desenvolvimento Espiritual
                          </p>

                          <h2 className="mt-4 text-5xl font-black text-yellow-400">
                            {curso.titulo}
                          </h2>

                         <p className="mt-8 max-w-3xl text-xl leading-9 text-gray-300">
  {curso.descricao ??
    "Continue exatamente de onde você parou e aprofunde seu desenvolvimento espiritual."}
</p>
                        </div>

                        <div className="flex flex-col justify-center">

                          <div className="rounded-2xl border border-yellow-500/20 bg-[#1A0E25] p-8">

                            <p className="text-gray-400">
                              Status
                            </p>

                            <h3 className="mt-3 text-3xl font-bold text-green-400">
                              Liberado
                            </h3>

                            <div className="mt-10 w-full rounded-2xl bg-yellow-500 py-5 text-center text-lg font-bold text-[#140B1D] transition hover:bg-yellow-400">
                              Continuar Curso →
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </Link>

                ))

              )}

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}