"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Headphones,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function PortalCard({
  title,
  subtitle,
  href,
  icon,
}: {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="group relative block overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#E7C96F]/10 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#E7C96F]/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 text-[#E7C96F]">{icon}</div>
        <h3 className="font-serif text-4xl">{title}</h3>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
          {subtitle}
        </p>

        <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#E7C96F]/30 px-6 py-4 text-[#E7C96F] transition group-hover:translate-x-2">
          ENTRAR
          <ArrowRight size={18} />
        </div>
      </div>
    </motion.a>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-[#120613] via-[#1b0822] to-[#0d0512] text-white">
      {/* FUNDO ETÉREO */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="stars">
  {[...Array(70)].map((_, i) => (
    <span
      key={i}
      className="star"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${15 + Math.random() * 20}s`,
        animationDelay: `${Math.random() * 20}s`,
      }}
    />
  ))}
</div>
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 14 }}
          className="absolute -top-20 right-0 h-[500px] w-[500px] rounded-full bg-fuchsia-700/15 blur-3xl"
        />

        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 18 }}
          className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-purple-700/20 blur-3xl"
        />

        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_45%)]"
        />
      </div>
<div
  className="absolute inset-0 opacity-20"
  style={{
    backgroundImage:
      "radial-gradient(#ffffff 1px, transparent 1px)",
    backgroundSize: "80px 80px",
  }}
/>
      {/* HERO */}
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-6 text-center md:text-left">
  <div className="mb-4 text-[#E7C96F] text-xl">
    ✦ ───── ❖ ───── ✦
  </div>

  <p className="mb-5 text-xs uppercase tracking-[0.45em] text-[#E7C96F]">
    Portal Místico Premium
  </p>

  <h1 className="font-serif text-5xl leading-tight md:text-8xl text-[#E7C96F] drop-shadow-[0_0_20px_rgba(231,201,111,0.35)]">
    CLUBE
    <br />
    DO TARÔ
  </h1>

  <p className="mt-5 text-2xl text-white">
    by Ádria Freitas
  </p>
</div>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">
            Um universo de espiritualidade, conhecimento, experiências e descobertas.
          </p>

          <div className="mt-12 flex flex-col gap-4 md:flex-row">
            <a
  href="/login"
  target="_blank"
  className="rounded-full border border-white/20 bg-white/10 px-8 py-5 text-center backdrop-blur-xl transition hover:bg-white/20"
>
  SOU MEMBRO DO CLUBE DO TARÔ
</a>

            <a
              href="https://cigana-tarot-magia.lovable.app/"
              className="rounded-full bg-[#D4AF37] px-8 py-5 text-center font-semibold text-black transition hover:scale-105"
            >
              QUERO FAZER PARTE DO CLUBE
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="relative flex justify-end"
        >
          <div className="absolute right-0 top-0 h-full w-full rounded-full bg-[#E7C96F]/10 blur-3xl" />

          <Image
            src="/imagens/adria-hero-metade.png"
            alt="Ádria Freitas"
            width={470}
            height={690}
            className="relative rounded-[36px] object-cover opacity-95 shadow-2xl"
          />
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-24">
  <div className="mb-14 text-center">
    <p className="mb-4 text-xs uppercase tracking-[0.45em] text-[#E7C96F]">
      EXPERIÊNCIAS EXCLUSIVAS
    </p>

    <h2 className="font-serif text-4xl text-white md:text-6xl">
      Explore o Universo do Clube do Tarô
    </h2>

    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
      Conteúdos espirituais, leituras mensais, rituais, aulas e experiências
      desenvolvidas para elevar sua conexão espiritual.
    </p>
  </div>

  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

    {/* CARD 1 */}
    <div className="group rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-[#E7C96F]/40 hover:bg-white/10">

      <div className="mb-6 text-[#E7C96F]">
  <Sparkles size={56} />
</div>

      <h3 className="mb-4 font-serif text-3xl text-white">
        Leituras Mensais
      </h3>

      <p className="leading-relaxed text-white/70">
        Leituras intuitivas completas com direcionamentos espirituais,
        conselhos e previsões energéticas do mês.
      </p>
    </div>

    {/* CARD 2 */}
    <div className="group rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-[#E7C96F]/40 hover:bg-white/10">

      <div className="mb-6 text-[#E7C96F]">
  <Headphones size={56} />

</div>

      <h3 className="mb-4 font-serif text-3xl text-white">
        Áudios Exclusivos
      </h3>

      <p className="leading-relaxed text-white/70">
        Meditações, ativações espirituais e conteúdos energéticos exclusivos
        liberados semanalmente para os membros.
      </p>
    </div>

    {/* CARD 3 */}
    <div className="group rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-[#E7C96F]/40 hover:bg-white/10">

      <div className="mb-6 text-[#E7C96F]">
  <BookOpen size={56} />
</div>

      <h3 className="mb-4 font-serif text-3xl text-white">
        Biblioteca Mística
      </h3>

      <p className="leading-relaxed text-white/70">
        E-books, romances umbandistas, materiais exclusivos, vídeo de ativação da pineal e conteúdos para fortalecer sua jornada espiritual.
      </p>
    </div>

  </div>
</section>

      {/* PORTAIS */}
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-24">
        <PortalCard
          title="Biblioteca Mística"
          subtitle="Livros, eBooks, PDFs gratuitos e vídeos para mergulhar no conhecimento espiritual."
          href="SEU_LINK_BIBLIOTECA"
          icon={<BookOpen size={36} />}
        />

        <PortalCard
          title="Cursos Exclusivos"
          subtitle="Entre em jornadas profundas de aprendizado, expansão espiritual e transformação."
          href="SEU_LINK_CURSOS"
          icon={<GraduationCap size={36} />}
        />

        <PortalCard
          title="Loja Mística"
          subtitle="Cristais, baralhos, itens energéticos e produtos especiais do seu universo místico."
          href="SEU_LINK_LOJA"
          icon={<ShoppingBag size={36} />}
        />

        <PortalCard
          title="Universo Literário"
          subtitle="Próximos lançamentos, trailers, sinopses narradas e experiências literárias imersivas."
          href="https://uiclap.bio/ADRIAFREITAS"
          icon={<Sparkles size={36} />}
        />

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid items-center gap-12 rounded-[40px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl md:grid-cols-2"
        >
          <Image
            src="/imagens/adria-hero.png"
            alt="Ádria"
            width={500}
            height={650}
            className="rounded-[32px] object-cover"
          />

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#E7C96F]">
              Universo Ádria
            </p>

            <h2 className="font-serif text-5xl">
              Escritora • Taróloga • Mentora
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-white/75">
              Conecte-se ao universo criativo e espiritual através das minhas redes e projetos.
            </p>

            <div className="mt-10 flex flex-col gap-4 md:flex-row">
              <a
                href="https://www.instagram.com/adriafreitastarologa"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-4"
              >
                Instagram Taróloga
              </a>

              <a
                href="https://www.instagram.com/adriafreitasescritora/"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-4"
              >
                Instagram Escritora
              </a>
            </div>
          </div>
        </motion.section>
      </section>
    </main>
  );
}
