"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarDays,
  FileText,
  HeartHandshake,
  MonitorSmartphone,
  PlayCircle,
  Sparkles,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";

function AcessoCard({
  title,
  subtitle,
  href,
  icon,
  destaque = false,
}: {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  destaque?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className={`group relative min-w-0 overflow-hidden rounded-[28px] border p-6 shadow-lg transition duration-500 hover:-translate-y-1 sm:rounded-[32px] sm:p-8 ${
        destaque
          ? "border-[#93A081] bg-gradient-to-br from-[#66785A] to-[#4F5E4A] text-white"
          : "border-[#D8D2C4] bg-white text-[#4F5E4A]"
      }`}
    >
      <div
        className={`absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 ${
          destaque
            ? "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_40%)]"
            : "bg-[radial-gradient(circle_at_top_right,rgba(120,140,105,0.08),transparent_40%)]"
        }`}
      />

      <div className="relative z-10">
        <div
          className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
            destaque
              ? "bg-white/15 text-white"
              : "bg-[#EEF1E8] text-[#5E7357]"
          }`}
        >
          {icon}
        </div>

        <h3 className="text-2xl font-extrabold">{title}</h3>

        <p
          className={`mt-3 text-sm leading-7 ${
            destaque ? "text-white/85" : "text-[#6C8465]"
          }`}
        >
          {subtitle}
        </p>

        <Link
          href={href}
          className={`mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
            destaque
              ? "bg-white text-[#4F5E4A] hover:bg-[#F7F1E4]"
              : "border border-[#C8CFBF] bg-[#F8F4EC] text-[#5E7357] hover:bg-[#EEF1E8]"
          }`}
        >
          Entrar
          <ArrowRight size={18} />
        </Link>
      </div>
    </motion.div>
  );
}

function RecursoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="min-w-0 rounded-[24px] border border-[#D8D2C4] bg-white p-5 shadow-sm transition hover:-translate-y-1 sm:rounded-[28px] sm:p-6"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF1E8] text-[#5E7357]">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-extrabold text-[#4F5E4A]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-[#6C8465]">
        {text}
      </p>
    </motion.div>
  );
}

export default function TerapiaVitrinePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F4EC] text-[#4F5E4A]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 16 }}
          className="absolute -top-20 right-0 h-[420px] w-[420px] rounded-full bg-[#8AA27A]/15 blur-3xl"
        />

        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 18 }}
          className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-[#5E7357]/12 blur-3xl"
        />
      </div>

      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-2 md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D8D2C4] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#7C8E71] shadow-sm">
            <Sparkles size={14} />
            Bem-vindos
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-[#4F5E4A] sm:text-5xl md:text-7xl">
            Terapia em Dia
          </h1>

          <p className="mt-3 text-xl font-semibold text-[#6C8465] sm:text-2xl md:text-3xl">
            com Ádria Freitas
          </p>

          <p className="mt-7 max-w-2xl text-base leading-8 text-[#6C8465] md:text-lg">
            Um espaço criado para acolher, organizar e acompanhar o processo
            terapêutico de forma simples, humana e segura. Aqui, pacientes e
            terapeutas encontram tecnologia com leveza, cuidado e propósito.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/terapia"
              className="inline-flex items-center justify-center rounded-full bg-[#5E7357] px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#4F5E4A]"
            >
              Sou paciente
            </Link>

            <Link
              href="/profissional"
              className="inline-flex items-center justify-center rounded-full border border-[#C8CFBF] bg-white px-8 py-4 text-sm font-bold text-[#5E7357] shadow-sm transition hover:bg-[#EEF1E8]"
            >
              Sou terapeuta
            </Link>

            <a
              href="#planos"
              className="inline-flex items-center justify-center rounded-full border border-[#D8D2C4] bg-[#F2EEE5] px-8 py-4 text-sm font-bold text-[#5E7357] transition hover:bg-[#EAE4D8]"
            >
              Conhecer o sistema
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm text-[#6C8465]">
            <span className="rounded-full border border-[#D8D2C4] bg-white px-4 py-2 shadow-sm">
              Portal do paciente
            </span>
            <span className="rounded-full border border-[#D8D2C4] bg-white px-4 py-2 shadow-sm">
              Mini palestras
            </span>
            <span className="rounded-full border border-[#D8D2C4] bg-white px-4 py-2 shadow-sm">
              Quiz dinâmico
            </span>
            <span className="rounded-full border border-[#D8D2C4] bg-white px-4 py-2 shadow-sm">
              Agenda terapêutica
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1 }}
          className="relative flex justify-center md:justify-end"
        >
          <div className="absolute inset-0 rounded-[40px] bg-[#8AA27A]/10 blur-[90px]" />

          <div className="relative w-full max-w-[520px] overflow-hidden rounded-[28px] border border-[#D8D2C4] bg-white p-3 shadow-2xl sm:rounded-[40px] sm:p-4">
            <Image
              src="/imagens/adria-hero.png"
              alt="Ádria Freitas"
              width={520}
              height={700}
              className="rounded-[30px] object-cover"
            />
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <AcessoCard
            title="Área do Paciente"
            subtitle="Acesse seu espaço terapêutico, sua anamnese, orientações, mini palestras, relatórios, gravações e sua jornada de acompanhamento."
            href="/terapia"
            icon={<UserRound size={26} />}
            destaque
          />

          <AcessoCard
            title="Área do Terapeuta"
            subtitle="Organize seus atendimentos, pacientes, atividades, conteúdos e acompanhamento com praticidade, leveza e visão profissional."
            href="/profissional"
            icon={<Stethoscope size={26} />}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-14 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#7C8E71]">
            O que o sistema oferece
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-[#4F5E4A] md:text-5xl">
            Simples para usar. Poderoso para acompanhar.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#6C8465]">
            O Terapia em Dia foi pensado para ajudar terapeutas e pacientes sem
            criar peso, confusão ou distância. Tudo precisa ser intuitivo,
            acolhedor e útil no dia a dia.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <RecursoCard
            icon={<CalendarDays size={22} />}
            title="Agenda terapêutica"
            text="Organização clara de atendimentos, horários, tipos de sessão, remarcações e acompanhamento profissional."
          />

          <RecursoCard
            icon={<FileText size={22} />}
            title="Anamnese e registros"
            text="Formulários, anotações, evolução da sessão, orientações e materiais organizados com praticidade."
          />

          <RecursoCard
            icon={<PlayCircle size={22} />}
            title="Mini palestras 9:16"
            text="Vídeos curtos e educativos para explicar temas importantes ao paciente de forma leve e acessível."
          />

          <RecursoCard
            icon={<Brain size={22} />}
            title="Quiz dinâmico"
            text="Atividades personalizadas criadas a partir das anotações da sessão, sempre com segurança e autonomia para o paciente."
          />

          <RecursoCard
            icon={<HeartHandshake size={22} />}
            title="Feedback e confiança"
            text="Ferramentas para entender como o paciente se sentiu, ajustar ritmo, acolhimento e evolução do processo."
          />

          <RecursoCard
            icon={<MonitorSmartphone size={22} />}
            title="Portal do paciente"
            text="Um espaço vivo, bonito e funcional para manter o paciente ativo com aprendizado, atividades e acompanhamento."
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full overflow-hidden rounded-[28px] border border-[#D8D2C4] bg-gradient-to-br from-[#66785A] to-[#4F5E4A] p-5 text-white shadow-xl sm:rounded-[40px] sm:p-8 md:p-12"
        >
          <div className="grid min-w-0 grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#DCE5D3] sm:text-xs sm:tracking-[0.3em]">
                Nosso diferencial
              </p>

              <h2 className="mt-4 max-w-full break-words text-2xl font-extrabold leading-tight sm:text-3xl md:text-5xl">
                Não é só agenda.
                <br />
                É acompanhamento de verdade.
              </h2>

              <p className="mt-5 max-w-full break-words text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
                O paciente não entra no aplicativo só para marcar sessão. Ele
                aprende, acompanha sua jornada, recebe atividades, mini palestras,
                orientações e continua conectado ao cuidado.
              </p>
            </div>

            <div className="grid min-w-0 gap-4">
              <div className="min-w-0 rounded-[22px] bg-white/10 p-4 backdrop-blur-md sm:rounded-[28px] sm:p-5">
                <p className="break-words font-bold">Leveza e segurança</p>
                <p className="mt-2 break-words text-sm leading-6 text-white/80 sm:leading-7">
                  Linguagem simples, acolhedora e respeitosa, sempre com espaço
                  para o paciente dizer: “no momento não consigo responder”.
                </p>
              </div>

              <div className="min-w-0 rounded-[22px] bg-white/10 p-4 backdrop-blur-md sm:rounded-[28px] sm:p-5">
                <p className="break-words font-bold">Agentes inteligentes como suporte</p>
                <p className="mt-2 break-words text-sm leading-6 text-white/80 sm:leading-7">
                  Apoiam a criação de quizzes, atividades e conteúdos, sempre
                  com revisão e controle do profissional.
                </p>
              </div>

              <div className="min-w-0 rounded-[22px] bg-white/10 p-4 backdrop-blur-md sm:rounded-[28px] sm:p-5">
                <p className="break-words font-bold">Tecnologia sem complicação</p>
                <p className="mt-2 break-words text-sm leading-6 text-white/80 sm:leading-7">
                  Você cuida dos seus pacientes. Nós cuidamos da tecnologia, da
                  implantação e do suporte.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="planos" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-14 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#7C8E71]">
            Para terapeutas
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-[#4F5E4A] md:text-5xl">
            Planos pensados para crescer com você
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#6C8465]">
            Você não precisa entender de tecnologia para usar o Terapia em Dia.
            O sistema foi pensado para ser simples, eficaz e humano.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {[
            {
              title: "Gratuito",
              text: "Até 3 clientes com pagamentos. Ideal para começar.",
            },
            {
              title: "Essencial",
              text: "Agenda, pacientes, anamnese e portal básico.",
            },
            {
              title: "Pro",
              text: "Mais recursos terapêuticos, conteúdos e automações.",
            },
            {
              title: "Premium",
              text: "Experiência mais completa para profissional e paciente.",
            },
            {
              title: "Personalizado",
              text: "Para quem deseja uma estrutura ainda mais exclusiva.",
            },
          ].map((plano) => (
            <motion.div
              key={plano.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="min-w-0 rounded-[24px] border border-[#D8D2C4] bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-6"
            >
              <p className="text-lg font-extrabold text-[#4F5E4A]">
                {plano.title}
              </p>

              <p className="mt-3 text-sm leading-7 text-[#6C8465]">
                {plano.text}
              </p>

              <a
                href="/profissional"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#5E7357]"
              >
                Quero saber mais
                <ArrowRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid min-w-0 items-center gap-8 rounded-[28px] border border-[#D8D2C4] bg-white p-5 shadow-lg sm:rounded-[40px] sm:p-8 md:grid-cols-2 md:p-10"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7C8E71]">
              Universo Ádria
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-[#4F5E4A] sm:text-4xl">
              Terapeuta, escritora e criadora
            </h2>

            <p className="mt-6 text-base leading-8 text-[#6C8465]">
              O Terapia em Dia nasce da minha vivência com pessoas, histórias,
              escuta, sensibilidade e criação. Não vou esconder quem eu sou:
              minha escrita e minha visão também fazem parte da minha forma de
              cuidar.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://www.instagram.com/adriafreitasmentora"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#C8CFBF] bg-[#F8F4EC] px-6 py-4 text-sm font-bold text-[#5E7357] transition hover:bg-[#EEF1E8]"
              >
                Instagram Terapêutico
              </a>

              <a
                href="https://www.instagram.com/adriafreitasescritora/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#C8CFBF] bg-white px-6 py-4 text-sm font-bold text-[#5E7357] transition hover:bg-[#EEF1E8]"
              >
                Instagram de Escritora
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] bg-[#F8F4EC] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF1E8] text-[#5E7357]">
                <BookOpen size={22} />
              </div>
              <p className="mt-4 text-lg font-bold text-[#4F5E4A]">
                Escrita e sensibilidade
              </p>
              <p className="mt-2 text-sm leading-7 text-[#6C8465]">
                Meu trabalho também passa pela palavra, pela escuta e pela forma
                como cada história precisa ser acolhida.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#F8F4EC] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF1E8] text-[#5E7357]">
                <Users size={22} />
              </div>
              <p className="mt-4 text-lg font-bold text-[#4F5E4A]">
                Cuidado com pessoas reais
              </p>
              <p className="mt-2 text-sm leading-7 text-[#6C8465]">
                Cada ferramenta do sistema nasce para servir pessoas, não para
                complicar o atendimento.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}