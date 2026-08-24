"use client";

import { useState } from "react";

export default function CortesiaPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);

  async function solicitarCortesia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nome.trim() || !email.trim() || !whatsapp.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const resposta = await fetch("/api/cortesia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          whatsapp,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.error || "Não foi possível liberar sua cortesia.");
        setLoading(false);
        return;
      }

      window.location.href = dados.redirectUrl || "/login";
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0616] text-white">
      <section className="relative overflow-hidden px-5 py-16 md:px-10 md:py-24">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-700/20 blur-[140px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* TEXTO */}
            <div>
              <span className="inline-flex rounded-full border border-yellow-500/40 bg-yellow-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-yellow-300">
                Cortesia Especial
              </span>

              <h1 className="mt-7 text-4xl font-extrabold leading-tight md:text-6xl">
                Conheça o
                <span className="block text-yellow-400">
                  Clube do Tarô
                </span>
                por dentro.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-purple-100">
                Entre gratuitamente no aplicativo do Clube do Tarô e
                conheça o trabalho de Ádria Freitas, seus conteúdos,
                cursos, livros, palestras e experiências espirituais.
              </p>

              <div className="mt-8 rounded-3xl border border-yellow-400/30 bg-yellow-500/10 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">
                  Seu presente de boas-vindas
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-white">
                  30 dias de Direcionamento Exclusivo
                </h2>

                <p className="mt-3 leading-7 text-purple-100">
                  Durante 30 dias você recebe a experiência do
                  direcionamento exclusivo do Clube como cortesia,
                  para conhecer de perto o nosso trabalho.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Beneficio texto="Aplicativo gratuito" />
                <Beneficio texto="Cursos gratuitos" />
                <Beneficio texto="Palestras e conteúdos" />
                <Beneficio texto="Livros e biblioteca" />
                <Beneficio texto="Loja do Clube" />
                <Beneficio texto="Novos conteúdos gratuitos" />
              </div>

              <div className="mt-8 border-l-2 border-yellow-400 pl-5">
                <p className="text-sm leading-7 text-white/80">
                  <strong className="text-yellow-300">
                    Importante:
                  </strong>{" "}
                  depois dos 30 dias, você não perde o aplicativo,
                  seus cursos, livros, palestras ou conteúdos.
                  Apenas o Direcionamento Exclusivo da cortesia
                  chega ao fim.
                </p>
              </div>
            </div>

            {/* FORMULÁRIO */}
            <div className="rounded-[32px] border border-purple-500/30 bg-[#171025] p-7 shadow-2xl md:p-10">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                  Seu acesso começa aqui
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-yellow-400">
                  Quero minha cortesia
                </h2>

                <p className="mt-4 text-sm leading-6 text-purple-100">
                  Preencha seus dados para receber seu acesso ao
                  Clube do Tarô.
                </p>
              </div>

              <form
                onSubmit={solicitarCortesia}
                className="mt-8 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Seu nome
                  </label>

                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition placeholder:text-white/35 focus:border-yellow-400/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Seu melhor e-mail
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition placeholder:text-white/35 focus:border-yellow-400/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    WhatsApp
                  </label>

                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition placeholder:text-white/35 focus:border-yellow-400/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 px-6 py-4 text-base font-extrabold text-[#170d20] shadow-xl transition hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60"
                >
                  {loading
                    ? "LIBERANDO SEU ACESSO..."
                    : "QUERO MINHA CORTESIA GRATUITA"}
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-5 text-white/45">
                O aplicativo é gratuito. A cortesia de 30 dias
                corresponde ao Direcionamento Exclusivo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Beneficio({ texto }: { texto: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 px-4 py-3">
      <span className="text-yellow-400">✦</span>
      <span className="text-sm text-white/90">{texto}</span>
    </div>
  );
}