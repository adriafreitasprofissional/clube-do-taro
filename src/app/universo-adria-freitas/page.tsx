"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Crown,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import CelestialBackground from "../components/CelestialBackground";

const livros = [
  {
    titulo: "Exu Lúcifer",
    subtitulo: "O Príncipe das Trevas",
    imagem: "/livros/exu-lucifer.png",
    uiclap: "https://loja.uiclap.com/titulo/ua112984/",
    amazon: null,
  },
  {
    titulo: "Exu Morcego",
    subtitulo: "O Senhor das Sombras",
    imagem: "/livros/exu-morcego.png",
    uiclap: "https://loja.uiclap.com/titulo/ua116839/",
    amazon: null,
  },
  {
    titulo: "Tranca Rua das Almas",
    subtitulo: "Causa e Efeito",
    imagem: "/livros/tranca-rua-das-almas.png",
    uiclap: "https://loja.uiclap.com/titulo/ua97277/",
    amazon: null,
  },
  {
    titulo: "O Ciúmes",
    subtitulo: "Entre o Amor e o Ódio",
    imagem: "/livros/o-ciumes.png",
    uiclap: "https://loja.uiclap.com/titulo/ua84490/",
    amazon: null,
  },
  {
    titulo: "O Destino Nunca Falha",
    subtitulo: "Encontro e Desencontro",
    imagem: "/livros/o-destino-nunca-falha.png",
    uiclap: "https://loja.uiclap.com/titulo/ua109408/",
    amazon: null,
  },
  {
    titulo: "No Portal da Escuridão",
    subtitulo: "Romance espiritual",
    imagem: "/livros/no-portal-da-escuridao.png",
    uiclap: "https://loja.uiclap.com/titulo/ua102723/",
    amazon: null,
  },
  {
    titulo: "Seu Lado Sombrio",
    subtitulo: "Ação e Reação",
    imagem: "/livros/seu-lado-sombrio.png",
    uiclap: "https://loja.uiclap.com/titulo/ua74195/",
    amazon:
      "https://www.amazon.com/SEU-LADO-SOMBRIO-REA%C3%87%C3%83O-Portuguese/dp/6501066875?ref_=ast_author_dp_rw&th=1&psc=1&dib=eyJ2IjoiMSJ9.hMgJ02IRgXHZ6X_oKkLZ8M_06BjM-Brki3gAWmmLd1XmO6VvO29kN4lGaPjK53J_i_XAM5pPiuuFwD0Vlm4RrEky7-oj2qiRXwFIuhU0Ulstgy26GXGNXPxowanBuT4htVzvs6NG47Zqkt9-yX52AD_VO1a6iHcSNGDeHsYhNXw.x9EP0klNIPd2R9UJxYzXhAHzsPfeOC8dF-7Df1mi4Ls&dib_tag=AUTHOR",
  },
  {
    titulo: "Exu Treme Terra",
    subtitulo: "A Missão",
    imagem: "/livros/exu-treme-terra-a-missao.png",
    uiclap: "https://loja.uiclap.com/titulo/ua94481/",
    amazon:
      "https://www.amazon.com/EXU-TREME-TERRA-MISS%C3%83O-Portuguese-ebook/dp/B0FF2WJHQG?ref_=ast_author_dp_rw&th=1&psc=1&dib=eyJ2IjoiMSJ9.hMgJ02IRgXHZ6X_oKkLZ8M_06BjM-Brki3gAWmmLd1XmO6VvO29kN4lGaPjK53J_i_XAM5pPiuuFwD0Vlm4RrEky7-oj2qiRXwFIuhU0Ulstgy26GXGNXPxowanBuT4htVzvs6NG47Zqkt9-yX52AD_VO1a6iHcSNGDeHsYhNXw.x9EP0klNIPd2R9UJxYzXhAHzsPfeOC8dF-7Df1mi4Ls&dib_tag=AUTHOR",
  },
];

const amazon =
  "https://www.amazon.com/stores/author/B088F6W5GL/allbooks?_encoding=UTF8&ref_=aufs_ap_ahdr_dsk_ab&pd_rd_w=dBHjw&content-id=amzn1.sym.7e190e19-9f6f-4df8-807a-5a7608594741&pf_rd_p=7e190e19-9f6f-4df8-807a-5a7608594741&pf_rd_r=147-6497516-9078348&pd_rd_wg=h3FzC&pd_rd_r=e598d7c9-3787-429e-877a-955c813a012b&ccs_id=733fdc51-2de6-42af-b45b-2d14f33b5a9b";
const uiclap = "https://uiclap.bio/ADRIAFREITAS";
const tiktok = "https://www.tiktok.com/@adriafreitas33";
const tiktokIlustracoes = "https://www.tiktok.com/@adriailustracoes";

export default function UniversoAdriaFreitas() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09080b] text-[#f5efe5]">
      <CelestialBackground />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-[#5b183c]/20 blur-[130px]" />
        <div className="absolute -right-40 top-[45%] h-[500px] w-[500px] rounded-full bg-[#80622b]/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-[#311228]/20 blur-[140px]" />
      </div>

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={17} />
          Voltar
        </Link>

        <p className="hidden text-xs uppercase tracking-[0.35em] text-[#d8ba73] sm:block">
          Universo Ádria Freitas
        </p>
      </header>

      <section className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-12 px-6 pb-24 pt-8 lg:grid-cols-[1fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10"
        >
          <div className="mb-7 flex items-center gap-3 text-[#d8ba73]">
            <Sparkles size={17} />
            <span className="text-xs uppercase tracking-[0.42em]">
              Entre no meu universo
            </span>
          </div>

          <h1 className="font-serif text-5xl leading-[0.98] text-[#f6f0e8] md:text-7xl xl:text-8xl">
            UNIVERSO
            <br />
            <span className="text-[#d8ba73]">ÁDRIA FREITAS</span>
          </h1>

          <div className="mt-9 h-px w-28 bg-gradient-to-r from-[#d8ba73] to-transparent" />

          <h2 className="mt-8 max-w-2xl font-serif text-3xl leading-tight text-white md:text-4xl">
            Não uso rótulos.
            <br />
            Sou autêntica e criativa.
          </h2>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/65">
            Histórias, personagens, mistérios e criações que atravessam as
            páginas. Este é o começo de um universo feito para ser descoberto,
            vivido e compartilhado.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#livros"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#d8ba73] px-7 py-4 font-semibold text-[#181214] transition hover:scale-[1.02]"
            >
              Conhecer meus livros
              <ArrowRight size={18} />
            </a>

            <a
              href="#onde-comprar"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-[#d8ba73]/30 bg-white/5 px-7 py-4 text-[#e8d5a5] backdrop-blur-xl transition hover:bg-white/10"
            >
              Onde comprar
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1 }}
          className="relative mx-auto w-full max-w-[470px]"
        >
          <div className="absolute inset-8 rounded-full bg-[#d8ba73]/10 blur-[90px]" />

          <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-white/5 p-2 shadow-2xl">
            <Image
              src="/imagens/adria-universo.png"
              alt="Ádria Freitas"
              width={975}
              height={1612}
              priority
              className="h-[620px] w-full rounded-[36px] object-cover object-top"
            />
            <div className="pointer-events-none absolute inset-2 rounded-[36px] bg-gradient-to-t from-[#09080b]/70 via-transparent to-transparent" />
          </div>
        </motion.div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.025]">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <BookOpen className="mx-auto mb-6 text-[#d8ba73]" size={28} />
          <p className="font-serif text-3xl leading-relaxed text-white/90 md:text-5xl">
            “Livros que tocam o invisível.”
          </p>
        </div>
      </section>

      <section id="livros" className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.42em] text-[#d8ba73]">
            Biblioteca
          </p>
          <h2 className="font-serif text-4xl md:text-6xl">Minhas histórias</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            Cada livro é uma porta. Escolha por onde deseja entrar.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {livros.map((livro, index) => (
            <motion.article
              key={livro.titulo + livro.subtitulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.04 }}
              className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-[#d8ba73]/40 hover:bg-white/[0.06]"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-[22px] bg-black/20">
                <Image
                  src={livro.imagem}
                  alt={`${livro.titulo} ${livro.subtitulo}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>

              <div className="px-2 pb-3 pt-6">
                <h3 className="font-serif text-2xl text-white">{livro.titulo}</h3>
                <p className="mt-2 text-sm text-[#d8ba73]">{livro.subtitulo}</p>

                <div className="mt-6 flex gap-2">
  <a
    href={livro.uiclap}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-xs uppercase tracking-wider text-white/75 transition hover:border-[#d8ba73]/40 hover:text-[#d8ba73]"
  >
    Uiclap
  </a>

  {livro.amazon && (
    <a
      href={livro.amazon}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-xs uppercase tracking-wider text-white/75 transition hover:border-[#d8ba73]/40 hover:text-[#d8ba73]"
    >
      Amazon
    </a>
  )}
</div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid overflow-hidden rounded-[42px] border border-[#d8ba73]/20 bg-gradient-to-br from-[#2b1022]/80 via-[#130c13]/95 to-[#09080b] lg:grid-cols-[0.75fr_1.25fr]"
        >
          <div className="relative min-h-[520px]">
            <Image
              src="/livros/rosa-caveira-a-missao.png"
              alt="Rosa Caveira - A Missão"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#130c13]/80 lg:block" />
          </div>

          <div className="flex flex-col justify-center p-8 md:p-14">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#d8ba73]/30 bg-[#d8ba73]/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#d8ba73]">
              <Sparkles size={14} />
              Próximo portal
            </div>

            <h2 className="font-serif text-4xl text-white md:text-6xl">
              Rosa Caveira
              <br />
              <span className="text-[#d8ba73]">A Missão</span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/65">
              Uma nova história está sendo preparada. Personagens, segredos,
              escolhas e caminhos que ainda serão revelados.
            </p>

            <p className="mt-8 text-sm uppercase tracking-[0.35em] text-white/40">
              Em breve
            </p>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="relative overflow-hidden rounded-[42px] border border-[#d8ba73]/20 bg-[#121014] px-7 py-16 md:px-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#d8ba73]/10 blur-[100px]" />

          <div className="relative z-10 max-w-3xl">
            <Crown className="mb-7 text-[#d8ba73]" size={32} />

            <p className="mb-4 text-xs uppercase tracking-[0.42em] text-[#d8ba73]">
              Coleção Especial
            </p>

            <h2 className="font-serif text-4xl leading-tight md:text-6xl">
              Livros Luxo Exclusivo
            </h2>

            <p className="mt-8 text-xl font-light text-[#e7d7b2]">
              Uma obra para ler. Uma peça para guardar.
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
              Edições artesanais criadas uma a uma. O livro recebe acabamento
              especial inspirado em grimórios e uma caixa de MDF personalizada,
              transformando cada exemplar em uma peça única para a estante.
            </p>

            <div className="mt-9 rounded-[26px] border border-white/10 bg-white/[0.035] p-6">
              <p className="text-white/75">
                Capas artesanais • caixa personalizada • acabamento exclusivo • produção limitada
              </p>
            </div>

            <a
              href="https://www.instagram.com/adriafreitasescritora/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex items-center gap-3 rounded-full border border-[#d8ba73]/35 bg-[#d8ba73]/10 px-7 py-4 text-[#e7d7b2] transition hover:bg-[#d8ba73]/15"
            >
              Quero acompanhar as edições
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section id="onde-comprar" className="border-y border-white/5 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.42em] text-[#d8ba73]">
              Encontre minhas obras
            </p>
            <h2 className="font-serif text-4xl md:text-5xl">Onde comprar</h2>
          </div>

          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <a
              href={amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[28px] border border-white/10 bg-white/5 p-7 text-center transition hover:-translate-y-1 hover:border-[#d8ba73]/40"
            >
              <ExternalLink className="mx-auto mb-4 text-[#d8ba73]" size={24} />
              <h3 className="font-serif text-2xl">Amazon</h3>
              <p className="mt-2 text-sm text-white/50">Conheça meus livros na Amazon.</p>
            </a>

            <a
              href={uiclap}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[28px] border border-white/10 bg-white/5 p-7 text-center transition hover:-translate-y-1 hover:border-[#d8ba73]/40"
            >
              <BookOpen className="mx-auto mb-4 text-[#d8ba73]" size={24} />
              <h3 className="font-serif text-2xl">Uiclap</h3>
              <p className="mt-2 text-sm text-white/50">Minha página oficial na editora.</p>
            </a>

            <a
              href="https://www.instagram.com/adriafreitasescritora/"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[28px] border border-white/10 bg-white/5 p-7 text-center transition hover:-translate-y-1 hover:border-[#d8ba73]/40"
            >
              <Sparkles className="mx-auto mb-4 text-[#d8ba73]" size={24} />
              <h3 className="font-serif text-2xl">Instagram</h3>
              <p className="mt-2 text-sm text-white/50">Bastidores, novidades e lançamentos.</p>
            </a>

            <a
              href={tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[28px] border border-white/10 bg-white/5 p-7 text-center transition hover:-translate-y-1 hover:border-[#d8ba73]/40"
            >
              <Sparkles className="mx-auto mb-4 text-[#d8ba73]" size={24} />
              <h3 className="font-serif text-2xl">TikTok Escritora</h3>
              <p className="mt-2 text-sm text-white/50">Livros, personagens, bastidores e lançamentos.</p>
            </a>

            <a
              href={tiktokIlustracoes}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[28px] border border-white/10 bg-white/5 p-7 text-center transition hover:-translate-y-1 hover:border-[#d8ba73]/40"
            >
              <Sparkles className="mx-auto mb-4 text-[#d8ba73]" size={24} />
              <h3 className="font-serif text-2xl">TikTok Ilustrações</h3>
              <p className="mt-2 text-sm text-white/50">
                Desenhos, processos criativos, capas, ilustrações e arte autoral.
              </p>
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="font-serif text-3xl text-[#e5d3aa] md:text-4xl">
          Eu criei. Eu construí.
          <br />
          Este é o meu universo.
        </p>

        <p className="mt-6 text-sm text-white/40">© Universo Ádria Freitas</p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#d8ba73]"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
      </footer>
    </main>
  );
}
