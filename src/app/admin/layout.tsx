"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/admin", icon: "🏠", label: "Dashboard" },

  { href: "/admin/assinantes", icon: "👥", label: "Assinantes" },

  { href: "/admin/financeiro", icon: "💳", label: "Financeiro" },

  {
  href: "/admin/atendimento",
  icon: "🌹",
  label: "Atendimento",
},

   // {
//   href: "/admin/direcionamentos",
//   icon: "🔮",
//   label: "Direcionamentos Exclusivos",
// },

  { href: "/admin/recados", icon: "📢", label: "Recados" },

  { href: "/admin/beneficios", icon: "🎁", label: "Benefícios" },

  { href: "/admin/indicacoes", icon: "🤝", label: "Indicações" },

  { href: "/admin/sorteios", icon: "🍀", label: "Sorteios" },

  { href: "/admin/convites", icon: "🌞", label: "Convites" },

  { href: "/admin/aniversarios", icon: "🎂", label: "Aniversários" },

  { href: "/admin/cursos", icon: "📚", label: "Cursos" },

  { href: "/admin/biblioteca", icon: "📖", label: "Biblioteca Ádria Freitas" },

  { href: "/admin/configuracoes", icon: "⚙️", label: "Configurações" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      style={{
        minHeight: "100vh",
       display: "flex",
flexDirection: "column",
        background: "#120018",
        color: "#ffffff",
      }}
    >
      <aside
        style={{
        width: "100%",
          flexShrink: 0,
          padding: "22px 16px",
          background:
            "linear-gradient(180deg, #22002d 0%, #130019 100%)",
          borderRight: "1px solid rgba(231, 201, 111, 0.18)",
        }}
      >
        <Link
          href="/admin"
          style={{
            display: "block",
            color: "#E7C96F",
            textDecoration: "none",
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "28px",
          }}
        >
          🔮 Clube do Tarô
        </Link>

        <nav style={{ display: "grid", gap: "6px" }}>
          {menu.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: active ? "#1a0921" : "#ffffff",
                  background: active ? "#E7C96F" : "transparent",
                  fontWeight: active ? 700 : 500,
                  transition: "0.2s",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "34px 38px",
          background:
            "radial-gradient(circle at top right, rgba(103, 24, 130, 0.22), transparent 35%), #120018",
        }}
      >
        {children}
      </main>
    </div>
  );
}