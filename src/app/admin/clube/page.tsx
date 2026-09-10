import Link from "next/link";
import DashboardGestao from "../components/DashboardGestao";

export default function ClubeAdminPage() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        <div>
          <Link
            href="/admin"
            style={{
              display: "inline-block",
              marginBottom: "14px",
              color: "#cbd69d",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            ← Central de Negócios
          </Link>

          <p
            style={{
              margin: 0,
              color: "#b7c28b",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2.3px",
              textTransform: "uppercase",
            }}
          >
            Você está em
          </p>

          <h1
            style={{
              margin: "8px 0 6px",
              color: "#fff",
              fontSize: "clamp(30px, 5vw, 42px)",
            }}
          >
            Clube do Tarô
          </h1>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,.62)",
              fontSize: "15px",
            }}
          >
            Visão geral da gestão do Clube.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/admin/assinantes"
            style={{
              padding: "11px 16px",
              borderRadius: "12px",
              background: "#aebe79",
              color: "#243018",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 800,
            }}
          >
            + Novo Assinante
          </Link>

          <Link
            href="/admin/assinantes"
            style={{
              padding: "11px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(183,194,139,.25)",
              background: "rgba(92,108,61,.16)",
              color: "#dce5c0",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Ver Assinantes
          </Link>
        </div>
      </div>

      <DashboardGestao />
    </div>
  );
}