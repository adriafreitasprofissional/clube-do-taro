"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const menuGroups = [
  {
    title: "GESTÃO",
    items: [
      { href: "/admin", icon: "🏠", label: "Dashboard" },
      { href: "/admin/assinantes", icon: "👥", label: "Assinantes" },
      { href: "/admin/financeiro", icon: "💳", label: "Financeiro" },
      { href: "/admin/atendimento", icon: "🌹", label: "Atendimento" },
      { href: "/admin/recados", icon: "📢", label: "Recados" },
      { href: "/admin/agenda", icon: "📅", label: "Agenda" },
    ],
  },
  {
    title: "RELACIONAMENTO",
    items: [
      { href: "/admin/beneficios", icon: "🎁", label: "Benefícios" },
      { href: "/admin/indicacoes", icon: "🤝", label: "Indicações" },
      { href: "/admin/sorteios", icon: "🍀", label: "Sorteios" },
      { href: "/admin/convites", icon: "🌞", label: "Convites" },
      { href: "/admin/aniversarios", icon: "🎂", label: "Aniversários" },
    ],
  },
  {
    title: "CONTEÚDO",
    items: [
      { href: "/admin/cursos", icon: "📚", label: "Cursos" },
      {
        href: "/admin/biblioteca",
        icon: "📖",
        label: "Biblioteca Ádria Freitas",
      },
    ],
  },
  {
    title: "SISTEMA",
    items: [
      { href: "/admin/maps/novo", icon: "✨", label: "Mapas" },
      {
        href: "/admin/configuracoes",
        icon: "⚙️",
        label: "Configurações",
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function navegar() {
    setMenuAberto(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#120018",
        color: "#fff",
      }}
    >
      {/* TOPO MOBILE */}
      <header
        style={{
          display: "none",
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: "64px",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          background: "#22002d",
          borderBottom: "1px solid rgba(231,201,111,.18)",
        }}
        className="admin-mobile-header"
      >
        <Link
          href="/admin"
          onClick={navegar}
          style={{
            color: "#E7C96F",
            textDecoration: "none",
            fontSize: "17px",
            fontWeight: 700,
          }}
        >
          🔮 Clube do Tarô
        </Link>

        <button
          onClick={() => setMenuAberto(true)}
          style={{
            border: "1px solid rgba(231,201,111,.35)",
            background: "rgba(231,201,111,.08)",
            color: "#E7C96F",
            borderRadius: "10px",
            padding: "9px 13px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ☰ Menu
        </button>
      </header>

      {/* FUNDO DO MENU MOBILE */}
      {menuAberto && (
        <div
          onClick={() => setMenuAberto(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            zIndex: 90,
          }}
          className="admin-mobile-overlay"
        />
      )}

      {/* MENU LATERAL */}
      <aside
        style={{
          width: "290px",
          flexShrink: 0,
          padding: "22px 16px",
          background:
            "linear-gradient(180deg,#22002d 0%,#130019 100%)",
          borderRight: "1px solid rgba(231,201,111,.18)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflowY: "auto",
          transform: menuAberto
            ? "translateX(0)"
            : "translateX(-100%)",
          transition: "transform .25s ease",
        }}
        className="admin-sidebar"
      >
        {/* CABEÇALHO DO MENU */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
          }}
        >
          <Link
            href="/admin"
            onClick={navegar}
            style={{
              color: "#E7C96F",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            🔮 Clube do Tarô
          </Link>

          <button
            onClick={() => setMenuAberto(false)}
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              color: "#E7C96F",
              fontSize: "22px",
              cursor: "pointer",
            }}
            className="admin-mobile-close"
          >
            ×
          </button>
        </div>

        {/* MENU */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {menuGroups.map((group) => (
            <div
              key={group.title}
              style={{
                marginBottom: "22px",
              }}
            >
              <div
                style={{
                  color: "#E7C96F",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  paddingLeft: "12px",
                }}
              >
                {group.title}
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "4px",
                }}
              >
                {group.items.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={navegar}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "11px 14px",
                        borderRadius: "12px",
                        textDecoration: "none",
                        color: active
                          ? "#1a0921"
                          : "#fff",
                        background: active
                          ? "#E7C96F"
                          : "transparent",
                        fontWeight: active
                          ? 700
                          : 500,
                      }}
                    >
                      <span
                        style={{
                          width: "20px",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </span>

                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* SAIR */}
        <button
          onClick={sair}
          style={{
            marginTop: "10px",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: "#8b0000",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          🚪 Sair
        </button>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main
        style={{
          minHeight: "100vh",
          marginLeft: "290px",
          padding: "34px 38px",
          background:
            "radial-gradient(circle at top right, rgba(103,24,130,.22), transparent 35%), #120018",
        }}
        className="admin-main"
      >
        {children}
      </main>

      {/* RESPONSIVIDADE */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .admin-mobile-header {
            display: flex !important;
          }

          .admin-sidebar {
            width: min(290px, 86vw) !important;
          }

          .admin-sidebar .admin-mobile-close {
            display: block !important;
          }

          .admin-main {
            margin-left: 0 !important;
            padding: 22px 16px !important;
          }
        }

        @media (min-width: 769px) {
          .admin-sidebar {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </div>
  );
}