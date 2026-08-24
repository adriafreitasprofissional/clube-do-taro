"use client";

import Link from "next/link";

export default function GestaoCursosPage() {
  return (
    <main className="min-h-screen bg-[#08020d] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* CABEÇALHO */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
            Conteúdo
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-yellow-400">
            📚 Gestão de Cursos
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-200">
            Administração da plataforma de cursos integrada ao ecossistema
            profissional. Os cursos permanecem na plataforma própria de
            cursos e são administrados por este painel.
          </p>
        </div>

        {/* RESUMO */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-purple-500/20 bg-[#120b20] p-5">
            <p className="text-xs uppercase tracking-wider text-purple-400">
              Plataforma
            </p>

            <p className="mt-2 text-lg font-extrabold text-white">
              Cursos externos
            </p>

            <p className="mt-1 text-xs text-purple-300">
              Aplicação independente integrada ao ecossistema.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-[#120b20] p-5">
            <p className="text-xs uppercase tracking-wider text-purple-400">
              Administração
            </p>

            <p className="mt-2 text-lg font-extrabold text-white">
              Centralizada
            </p>

            <p className="mt-1 text-xs text-purple-300">
              Gestão realizada pelo seu ADM.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-[#120b20] p-5">
            <p className="text-xs uppercase tracking-wider text-purple-400">
              Acessos
            </p>

            <p className="mt-2 text-lg font-extrabold text-white">
              Controlados
            </p>

            <p className="mt-1 text-xs text-purple-300">
              Você decide quem recebe cada curso.
            </p>
          </div>

        </div>

        {/* MÓDULOS */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* PLATAFORMA */}
          <section className="rounded-3xl border border-purple-500/30 bg-[#19172f] p-6 shadow-xl">

            <div className="flex items-start gap-4">
              <div className="text-4xl">
                🎓
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-yellow-400">
                  Cursos da Plataforma
                </h2>

                <p className="mt-2 text-sm leading-6 text-purple-100">
                  Gerencie os cursos que existem na plataforma externa,
                  incluindo cursos próprios e futuramente cursos de outros
                  profissionais.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-purple-500/20 bg-[#100b1b] p-4">
              <p className="text-sm font-bold text-white">
                Plataforma independente
              </p>

              <p className="mt-2 text-xs leading-5 text-purple-300">
                O conteúdo dos cursos não fica dentro do Clube do Tarô.
                Este painel funciona como centro administrativo e de
                integração.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">

              <a
                href="https://cursos.magiaoriente.com.br"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-5 py-3 text-sm font-extrabold text-yellow-300 transition hover:bg-yellow-500/20"
              >
                🔗 Abrir Plataforma
              </a>

            </div>

          </section>

          {/* LIBERAÇÃO */}
          <section className="rounded-3xl border border-yellow-500/30 bg-[#19172f] p-6 shadow-xl">

            <div className="flex items-start gap-4">
              <div className="text-4xl">
                🎁
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-yellow-400">
                  Liberação de Cursos
                </h2>

                <p className="mt-2 text-sm leading-6 text-purple-100">
                  Controle quais cursos serão disponibilizados para cada
                  assinante ou cliente.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <p className="text-sm font-bold text-yellow-200">
                Controle de acesso
              </p>

              <p className="mt-2 text-xs leading-5 text-purple-300">
                Selecione o assinante, escolha o curso e registre a
                liberação. O histórico permanece no ADM.
              </p>
            </div>

            <div className="mt-5">

              <Link
                href="/admin/gestao-cursos/liberacao-cursos"
                className="inline-flex rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-5 py-3 text-sm font-extrabold text-yellow-300 transition hover:bg-yellow-500/20"
              >
                🎁 Gerenciar Liberações →
              </Link>

            </div>

          </section>

          {/* ALUNOS */}
          <section className="rounded-3xl border border-purple-500/20 bg-[#120b20] p-6 shadow-xl">

            <div className="flex items-start gap-4">
              <div className="text-4xl">
                👥
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-yellow-400">
                  Alunos e Acessos
                </h2>

                <p className="mt-2 text-sm leading-6 text-purple-100">
                  Área preparada para acompanhar alunos e acessos aos
                  cursos da plataforma.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-purple-500/20 bg-[#19172f] p-4">
              <p className="text-xs leading-5 text-purple-300">
                Esta área será integrada aos dados da plataforma de cursos
                quando a gestão de alunos for implementada.
              </p>
            </div>

          </section>

          {/* PROFISSIONAIS */}
          <section className="rounded-3xl border border-purple-500/20 bg-[#120b20] p-6 shadow-xl">

            <div className="flex items-start gap-4">
              <div className="text-4xl">
                ✨
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-yellow-400">
                  Profissionais
                </h2>

                <p className="mt-2 text-sm leading-6 text-purple-100">
                  Estrutura preparada para futuros profissionais que
                  utilizarem a plataforma para cadastrar e comercializar
                  seus próprios cursos.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-purple-500/20 bg-[#19172f] p-4">
              <p className="text-xs leading-5 text-purple-300">
                Tarólogas, terapeutas, artistas, mentores e outros
                profissionais poderão utilizar este módulo conforme as
                permissões definidas no seu ADM.
              </p>
            </div>

          </section>

        </div>

      </div>
    </main>
  );
}