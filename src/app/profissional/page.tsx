import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Compass,
  CreditCard,
  Gem,
  Globe,
  GraduationCap,
  Layers,
  LayoutGrid,
  Moon,
  PieChart,
  Repeat,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  Wand2,
} from "lucide-react";

import {
  Atmosphere,
  Constellation,
  Orbits,
  SectionLabel,
} from "@/components/tarot/atmosphere";

import {
  DesktopPanel,
  FloatingTag,
  PhonePortal,
  StoreScreen,
} from "@/components/tarot/mockups";

import { cn } from "@/lib/utils";
import "./profissional.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Clube do Tarô para Profissionais | Recorrência para tarólogos",
  description:
    "Crie seu próprio Clube: portal do cliente, assinaturas, agenda, pagamentos, loja, cursos e agentes inteligentes para tarólogos e profissionais holísticos.",
};

function GoldButton({
  children,
  href,
  variant = "solid",
  className,
}: {
  children: React.ReactNode;
  href: string;
  variant?: "solid" | "ghost";
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-500",
        variant === "solid"
          ? "text-primary-foreground shadow-[var(--glow-gold)] hover:-translate-y-0.5"
          : "gold-hairline glass-card text-gold hover:-translate-y-0.5 hover:border-gold/60",
        className
      )}
      style={
        variant === "solid"
          ? { backgroundImage: "var(--gradient-gold)" }
          : undefined
      }
    >
      {children}

      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
    </a>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="glass-card gold-hairline inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm uppercase tracking-[0.3em] text-gold/90">
      <Moon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function Title({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-display text-3xl leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-5xl",
        className
      )}
    >
      {children}
    </Tag>
  );
}

function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative px-5 py-20 sm:px-8 md:py-28",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export default function ProfissionalPage() {
  return (
    <main
      className={`${cormorant.variable} ${manrope.variable} professional-page`}
    >
      <Atmosphere />

      <Hero />
      <Ecosystem />
      <HowItWorks />
      <Agents />
      <SalesPage />
      <Store />
      <Plans />
      <FinalCall />

      <footer className="relative px-6 pb-12 text-center text-sm uppercase tracking-[0.3em] text-muted-foreground/70">
        Clube do Tarô para Profissionais
      </footer>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative px-5 pb-16 pt-14 sm:px-8 md:pb-24 md:pt-20">
      <Orbits className="left-[-14rem] top-[-8rem] hidden h-[38rem] w-[38rem] md:block" />

      <Constellation className="right-4 top-10 hidden w-56 md:block" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-rise">
          <Badge>Clube do Tarô para Profissionais</Badge>

          <Title
            as="h1"
            className="mt-7 text-4xl sm:text-5xl md:text-[3.6rem]"
          >
            Pare de viver apenas de consultas.

            <span className="mt-3 block text-gold-gradient">
              Crie seu próprio Clube e transforme atendimentos em recorrência.
            </span>
          </Title>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Tenha sua própria estrutura para manter seus clientes conectados ao
            seu trabalho durante todo o mês — com portal exclusivo,
            direcionamentos, assinaturas, agenda, pagamentos, loja, cursos e
            muito mais.
          </p>

          <div className="glass-card mt-8 max-w-xl rounded-3xl p-6">
            <p className="font-display text-xl leading-snug text-gold sm:text-2xl">
              Você cuida dos seus clientes.
              <br />
              Nós cuidamos da tecnologia.
            </p>

            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Você não precisa entender de tecnologia. Acompanhamos sua
              implantação e damos o suporte necessário para colocar seu Clube
              em funcionamento.
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <GoldButton href="#planos">
              Quero conhecer meu futuro Clube
            </GoldButton>

            <GoldButton href="#como-funciona" variant="ghost">
              Ver como funciona
            </GoldButton>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div
            className="halo left-1/4 top-6 h-72 w-72 opacity-60"
            style={{ background: "var(--lavender)" }}
          />

          <div className="relative pt-12">
            <DesktopPanel className="animate-float ml-auto w-[92%]" />

            <div className="mt-5 flex items-start gap-4 sm:-mt-2 sm:gap-5">
              <PhonePortal className="animate-float w-[38%] max-w-40 shrink-0 [animation-delay:1.2s] sm:-ml-4 sm:translate-y-6" />

              <StoreScreen className="animate-float mt-6 w-full [animation-delay:2.4s] sm:mt-14" />
            </div>

            <FloatingTag className="left-0 top-2 sm:left-2">
              Sua marca
            </FloatingTag>

            <FloatingTag className="right-2 top-[-0.75rem] hidden sm:block">
              Seus clientes
            </FloatingTag>

            <FloatingTag className="bottom-[-1.25rem] left-1/2 hidden -translate-x-1/2 sm:block">
              Sua loja
            </FloatingTag>

            <FloatingTag className="right-0 top-1/2 sm:right-[-1.5rem]">
              Sua recorrência
            </FloatingTag>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Layers,
    title: "Portal exclusivo",
    text: "Um espaço só seu, com sua identidade.",
  },
  {
    icon: Repeat,
    title: "Assinaturas e recorrência",
    text: "Receita previsível todo mês.",
  },
  {
    icon: CalendarDays,
    title: "Agenda integrada",
    text: "Horários e sessões organizados.",
  },
  {
    icon: CreditCard,
    title: "Pagamentos",
    text: "Cobranças e renovações automáticas.",
  },
  {
    icon: ShoppingBag,
    title: "Loja",
    text: "Venda dentro do seu ambiente.",
  },
  {
    icon: GraduationCap,
    title: "Cursos",
    text: "Formações e trilhas para seus clientes.",
  },
  {
    icon: BookOpen,
    title: "Biblioteca",
    text: "Materiais e conteúdos sempre disponíveis.",
  },
  {
    icon: Compass,
    title: "Direcionamentos",
    text: "Mensagens e leituras periódicas.",
  },
  {
    icon: PieChart,
    title: "Financeiro",
    text: "Visão clara do seu faturamento.",
  },
  {
    icon: Globe,
    title: "Página de vendas",
    text: "Sua vitrine pronta para divulgar.",
  },
];

function Ecosystem() {
  return (
    <Section>
      <div className="max-w-2xl">
        <SectionLabel>Um ecossistema completo</SectionLabel>

        <Title>
          Tudo o que você precisa para transformar seu trabalho em uma{" "}
          <span className="text-gold-gradient">
            experiência completa
          </span>
          .
        </Title>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="glass-card group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/35"
          >
            <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

            <Icon
              className="h-6 w-6 text-gold"
              strokeWidth={1.1}
            />

            <h3 className="mt-5 font-display text-xl text-foreground">
              {title}
            </h3>

            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {text}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

const steps = [
  {
    title: "Escolha seu plano",
    text: "Você escolhe a estrutura ideal para o momento do seu trabalho.",
  },
  {
    title: "Nós ajudamos na implantação",
    text: "Personalizamos seu Clube com sua identidade e orientamos toda a implantação.",
  },
  {
    title: "Traga seus clientes",
    text: "Comece a cadastrar e convidar seus clientes para seu novo espaço.",
  },
  {
    title: "Conte com nosso suporte",
    text: "Você cuida do seu trabalho. Nós apoiamos a parte técnica.",
  },
];

function HowItWorks() {
  return (
    <Section id="como-funciona">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-md">
          <Orbits className="inset-[-12%] hidden sm:block" />

          <div className="glass-card relative overflow-hidden rounded-[2rem] p-2">
            <img
              src="/profissional/woman-mystic.jpg"
              alt="Taróloga profissional trabalhando no notebook cercada por cristais e luz violeta"
              width={1024}
              height={1280}
              loading="lazy"
              className="w-full rounded-[1.6rem] object-cover"
            />

            <div
              className="pointer-events-none absolute inset-0 rounded-[2rem]"
              style={{
                background:
                  "linear-gradient(180deg, transparent 45%, oklch(0.16 0.075 300 / 75%))",
              }}
            />
          </div>

          <img
            src="/profissional/crystals.png"
            alt=""
            aria-hidden
            width={768}
            height={768}
            loading="lazy"
            className="animate-float pointer-events-none absolute -bottom-10 -left-8 w-28 opacity-90 sm:w-36"
          />

          <span className="glass-card gold-hairline animate-float absolute -top-4 right-2 max-w-[11rem] rounded-2xl px-4 py-3 text-sm leading-snug text-foreground/90">
            Eu cuido dos meus clientes.
          </span>

          <span className="glass-card gold-hairline animate-float absolute bottom-8 -right-3 max-w-[12rem] rounded-2xl px-4 py-3 text-sm leading-snug text-foreground/90 [animation-delay:1.6s]">
            A tecnologia trabalha ao meu lado.
          </span>
        </div>

        <div>
          <SectionLabel>Primeiros passos</SectionLabel>

          <Title>
            Começar é mais simples{" "}
            <span className="text-gold-gradient">
              do que parece.
            </span>
          </Title>

          <ol className="mt-10 space-y-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="glass-card flex gap-4 rounded-2xl p-5"
              >
                <span className="font-display text-2xl leading-none text-gold/80">
                  {index + 1}
                </span>

                <div>
                  <h3 className="font-display text-lg text-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-base leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

const agents = [
  {
    icon: Star,
    name: "Gerador de Mapas",
  },
  {
    icon: Compass,
    name: "Gerador de Direcionamentos",
  },
  {
    icon: Wand2,
    name: "AF Viral Studio",
  },
  {
    icon: Ticket,
    name: "Gerador de Sorteios",
  },
  {
    icon: LayoutGrid,
    name: "Gerador de Baralho Cigano",
  },
];

function Agents() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <SectionLabel>Agentes inteligentes</SectionLabel>

        <Title>
          Agentes inteligentes como{" "}
          <span className="text-gold-gradient">
            suporte
          </span>{" "}
          para seus atendimentos.
        </Title>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Ferramentas que apoiam seu trabalho sem substituir sua experiência.
          Todos os conteúdos podem ser revisados, editados, personalizados e
          complementados por você.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {agents.map(({ icon: Icon, name }) => (
          <article
            key={name}
            className="glass-card group relative flex flex-col items-center gap-4 rounded-3xl px-5 py-9 text-center transition-all duration-500 hover:-translate-y-2 hover:border-gold/35"
          >
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/30">
              <span className="absolute inset-0 rounded-full bg-gold/10 opacity-60 blur-md transition-opacity duration-500 group-hover:opacity-100" />

              <Icon
                className="relative h-6 w-6 text-gold"
                strokeWidth={1.1}
              />
            </span>

            <h3 className="font-display text-lg leading-snug text-foreground">
              {name}
            </h3>
          </article>
        ))}
      </div>
    </Section>
  );
}

const salesBenefits = [
  "Sua marca",
  "Seus serviços",
  "Seus planos",
  "Integração com pagamentos",
  "Estrutura pronta para divulgação",
];

function SalesPage() {
  return (
    <Section>
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionLabel>Sua página de vendas</SectionLabel>

          <Title>
            Tenha sua própria página de vendas{" "}
            <span className="text-gold-gradient">
              integrada ao seu Clube.
            </span>
          </Title>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Apresente seu trabalho, seus serviços, seus planos e sua identidade
            em um espaço profissional pronto para divulgação.
          </p>

          <ul className="mt-8 space-y-3">
            {salesBenefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 text-base text-foreground/90"
              >
                <Gem
                  className="h-4 w-4 shrink-0 text-gold"
                  strokeWidth={1.2}
                />

                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-lg pb-16">
          <Constellation className="-top-8 left-0 w-44" />

          <div className="glass-card animate-float rounded-2xl p-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold/50" />
              <span className="h-2 w-2 rounded-full bg-lavender/25" />
              <span className="ml-2 h-4 flex-1 rounded-full bg-lavender/10" />
            </div>

            <div className="rounded-xl border border-border/60 bg-night/30 p-5">
              <p className="font-display text-xl text-gold">
                Seu Nome · Tarô
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Leituras, mentorias e experiências
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-border/60 bg-lavender/5 p-2"
                  >
                    <div className="h-10 rounded-md bg-gradient-to-br from-lavender/20 to-transparent" />

                    <div className="mt-2 h-1.5 w-3/4 rounded-full bg-lavender/20" />
                  </div>
                ))}
              </div>

              <div className="mt-4 h-8 w-40 rounded-full bg-gold/70" />
            </div>
          </div>

          <PhonePortal className="animate-float absolute -bottom-2 -left-2 w-32 [animation-delay:1.5s] sm:w-40" />

          <img
            src="/profissional/crystals.png"
            alt=""
            aria-hidden
            width={768}
            height={768}
            loading="lazy"
            className="animate-float pointer-events-none absolute -right-4 bottom-4 w-20 opacity-80 [animation-delay:2s] sm:w-28"
          />
        </div>
      </div>
    </Section>
  );
}

const storeItems = [
  {
    title: "Consultas",
    note: "Sessões avulsas ou em pacote",
    image: "/profissional/loja-consultas.png",
  },
  {
    title: "Cursos",
    note: "Formações e trilhas",
    image: "/profissional/loja-cursos.png",
  },
  {
    title: "Materiais",
    note: "E-books, guias e rituais",
    image: "/profissional/loja-materiais.png",
  },
  {
    title: "Mentorias",
    note: "Acompanhamentos individuais ou em grupo",
    image: "/profissional/loja-mentorias.png",
  },
];

function Store() {
  return (
    <Section>
      <div className="glass-card relative overflow-hidden rounded-[2.5rem] px-6 py-14 sm:px-10 lg:px-12">
        <div
          className="halo -left-24 -top-24 h-96 w-96 opacity-60"
          style={{ background: "var(--plum)" }}
        />

        <div className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Loja</SectionLabel>

            <Title>
              Seu Clube também pode{" "}
              <span className="text-gold-gradient">
                vender por você.
              </span>
            </Title>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Venda consultas, cursos, materiais e mentorias diretamente
              dentro do seu próprio ambiente.
            </p>

            <div className="mt-7">
              <GoldButton href="#planos">
                Quero minha loja
              </GoldButton>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {storeItems.map((item) => (
              <article
                key={item.title}
                className="glass-card group overflow-hidden rounded-[1.75rem] transition-all duration-500 hover:-translate-y-2 hover:border-gold/35"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
                </div>

                <div className="flex min-h-[205px] flex-col p-6">
                  <h3 className="font-display text-2xl text-gold">
                    {item.title}
                  </h3>

                  <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">
                    {item.note}
                  </p>

                  <div className="mt-5 h-px w-full bg-border/70" />

                  <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                    Vender agora →
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "PARA COMEÇAR",
    features: [
      "Conheça a plataforma",
      "Estrutura inicial do Clube",
      "Acesso aos recursos básicos",
    ],
  },
  {
    name: "Essencial",
    price: "R$ 59,90",
    period: "ASSINATURA MENSAL",
    features: [
      "Portal para seus clientes",
      "Gestão de clientes",
      "Agenda integrada",
      "Assinaturas e recorrência",
      "Recados e direcionamentos",
    ],
  },
  {
    name: "Pro",
    price: "R$ 99,90",
    period: "ASSINATURA MENSAL",
    popular: true,
    features: [
      "Tudo do Essencial",
      "Loja integrada",
      "Cursos e conteúdos",
      "Biblioteca digital",
      "Financeiro",
      "Agentes inteligentes",
    ],
  },
  {
    name: "Premium",
    price: "R$ 169,90",
    period: "ASSINATURA MENSAL",
    features: [
      "Tudo do Pro",
      "Ecossistema completo",
      "Mais recursos e capacidade",
      "Página de vendas",
      "Acompanhamento diferenciado",
      "Suporte prioritário",
    ],
  },
];

function Plans() {
  return (
    <Section id="planos">
      <div className="mx-auto max-w-3xl text-center">
        <SectionLabel>Assinaturas mensais</SectionLabel>

        <Title className="text-4xl sm:text-5xl">
          Escolha seu{" "}
          <span className="text-gold-gradient">
            Plano
          </span>
        </Title>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Escolha a estrutura ideal para criar seu Clube e transformar seus
          atendimentos em uma experiência contínua para seus clientes.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={cn(
              "glass-card relative flex min-h-[560px] flex-col rounded-[2rem] px-7 py-9 transition-all duration-500 hover:-translate-y-2",
              plan.popular &&
                "gold-hairline xl:-translate-y-5 xl:shadow-[0_0_60px_oklch(0.85_0.09_88/0.18)]"
            )}
          >
            {plan.popular && (
              <span
                className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold uppercase tracking-[0.22em] text-primary-foreground"
                style={{
                  backgroundImage: "var(--gradient-gold)",
                }}
              >
                Mais escolhido
              </span>
            )}

            <div className="flex justify-center gap-3 text-gold">
              <Sparkles
                className="h-4 w-4"
                strokeWidth={1.2}
              />
              <Sparkles
                className="h-4 w-4"
                strokeWidth={1.2}
              />
              <Sparkles
                className="h-4 w-4"
                strokeWidth={1.2}
              />
            </div>

            <h3
              className={cn(
                "mt-7 text-center font-display text-3xl text-foreground",
                plan.popular && "text-gold"
              )}
            >
              {plan.name}
            </h3>

            <p
              className={cn(
                "mt-6 text-center font-display text-[2.15rem] text-foreground",
                plan.popular && "text-gold"
              )}
            >
              {plan.price}
            </p>

            <p className="mt-2 text-center text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              {plan.period}
            </p>

            <div className="my-7 h-px bg-border/70" />

            <ul className="flex-1 space-y-4">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-base leading-relaxed text-foreground/90"
                >
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />

                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <GoldButton
              href="#final"
              variant={plan.popular ? "solid" : "ghost"}
              className="mt-8 w-full"
            >
              Quero este plano
            </GoldButton>
          </article>
        ))}
      </div>

      <div className="glass-card gold-hairline relative mt-10 overflow-hidden rounded-[2rem] px-8 py-9 sm:px-10">
        <div
          className="halo -right-16 -top-24 h-64 w-64 opacity-30"
          style={{ background: "var(--gold)" }}
        />

        <div className="relative flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-gold">
              Personalizado
            </p>

            <h3 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              Precisa de uma estrutura exclusiva?
            </h3>

            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Criamos uma solução sob medida para profissionais que precisam de
              identidade, estrutura ou funcionalidades específicas.
            </p>
          </div>

          <div className="shrink-0 lg:text-right">
            <p className="font-display text-3xl text-gold">
              A partir de R$ 297
            </p>

            <p className="mt-1 text-sm uppercase tracking-[0.25em] text-muted-foreground">
              Projeto personalizado
            </p>

            <GoldButton
              href="#final"
              className="mt-5 w-full lg:w-auto"
            >
              Falar sobre meu projeto
            </GoldButton>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FinalCall() {
  return (
    <Section
      id="final"
      className="pb-28"
    >
      <div className="glass-card relative overflow-hidden rounded-[2.5rem] px-6 py-20 text-center sm:px-14">
        <Constellation className="left-4 top-6 w-40 sm:w-56" />

        <Constellation className="bottom-6 right-4 w-40 rotate-180 sm:w-56" />

        <div
          className="halo left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 opacity-50"
          style={{ background: "var(--gold)" }}
        />

        <img
          src="/profissional/crystals.png"
          alt=""
          aria-hidden
          width={768}
          height={768}
          loading="lazy"
          className="animate-float pointer-events-none absolute -bottom-6 left-2 hidden w-24 opacity-80 sm:block"
        />

        <img
          src="/profissional/crystals.png"
          alt=""
          aria-hidden
          width={768}
          height={768}
          loading="lazy"
          className="animate-float pointer-events-none absolute -top-4 right-2 hidden w-20 -scale-x-100 opacity-70 [animation-delay:2s] sm:block"
        />

        <div className="relative mx-auto max-w-2xl">
          <Title className="text-3xl sm:text-4xl md:text-[3.2rem]">
            Seu conhecimento já é seu.

            <span className="mt-2 block text-gold-gradient">
              Agora ele pode ter seu próprio espaço.
            </span>
          </Title>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Crie uma experiência própria para seus clientes e desenvolva novas
            possibilidades para o seu trabalho.
          </p>

          <div className="mt-10 flex justify-center">
            <GoldButton href="#planos">
              Quero criar meu Clube
            </GoldButton>
          </div>
        </div>
      </div>
    </Section>
  );
}