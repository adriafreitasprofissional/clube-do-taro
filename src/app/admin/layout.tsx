import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#120018",
      }}
    >
      <aside
        style={{
          width: "280px",
          background: "#1a001f",
          borderRight: "1px solid rgba(255,255,255,.08)",
          padding: "20px",
        }}
      >
        <h2
          style={{
            color: "#f4d46a",
            marginBottom: "30px",
          }}
        >
          🔮 Clube do Tarô
        </h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <a href="/admin">🏠 Dashboard</a>

          <a href="/admin/assinantes">
            👥 Assinantes
          </a>

          <a href="#">
            🔮 Direcionamentos
          </a>

          <a href="#">
            🎁 Benefícios
          </a>

          <a href="#">
            🌟 Convites
          </a>

          <a href="#">
            🎂 Aniversários
          </a>

          <a href="#">
            📚 Cursos
          </a>

          <a href="#">
            📖 Biblioteca Ádria Freitas
          </a>

          <a href="#">
            ⚙️ Configurações
          </a>
        </nav>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        {children}
      </main>
    </div>
  );
}