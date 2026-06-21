"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !senha) {
      alert("Digite seu e-mail e sua senha.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error || !data.user) {
      alert(error?.message || "Não foi possível entrar.");
      setLoading(false);
      return;
    }

    const emailUsuario = data.user.email;

    const { data: clienteData, error: errorCliente } = await supabase
      .from("club_clients")
      .select("slug, status, role")
      .eq("email", emailUsuario)
      .single();

    if (errorCliente || !clienteData?.slug) {
      alert("Cliente não encontrado.");
      setLoading(false);
      return;
    }

    if (clienteData.status !== "ativo") {
      alert("Seu acesso está temporariamente indisponível. Entre em contato com o Clube do Tarô.");
      setLoading(false);
      return;
    }

    if (clienteData.role === "admin") {
      window.location.href = "/admin";
      return;
    }

    window.location.href = `/cliente/${clienteData.slug}/portal`;
  }

  async function resetSenha() {
    if (!email) {
      alert("Digite seu e-mail primeiro.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://www.magiaoriente.com.br/auth/reset-password",
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Enviamos um link para redefinir sua senha. Abra o e-mail e crie uma nova senha.");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#1A001A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "32px",
          padding: "40px",
          backdropFilter: "blur(20px)",
        }}
      >
        <p
          style={{
            marginBottom: "16px",
            textAlign: "center",
            fontSize: "12px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#E7C96F",
          }}
        >
          Portal do Assinante
        </p>

        <h1
          style={{
            marginBottom: "40px",
            textAlign: "center",
            fontSize: "42px",
            color: "white",
          }}
        >
          Clube do Tarô
        </h1>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{
              width: "100%",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "rgba(255,255,255,0.05)",
              padding: "16px",
              color: "white",
              marginBottom: "16px",
              boxSizing: "border-box",
            }}
          />

          <div style={{ position: "relative" }}>
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Sua senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              style={{
                width: "100%",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(255,255,255,0.05)",
                padding: "16px",
                paddingRight: "56px",
                color: "white",
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              onClick={() => setMostrarSenha((valor) => !valor)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              style={{
                position: "absolute",
                right: "16px",
                top: "16px",
                background: "transparent",
                border: "none",
                color: "#E7C96F",
                cursor: "pointer",
              }}
            >
              👁
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              borderRadius: "16px",
              backgroundColor: "#D4AF37",
              padding: "16px",
              fontWeight: "bold",
              color: "black",
              border: "none",
              marginTop: "20px",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Entrando..." : "ENTRAR NO PORTAL"}
          </button>
        </form>

        <button
          type="button"
          onClick={resetSenha}
          style={{
            width: "100%",
            marginTop: "20px",
            background: "transparent",
            border: "none",
            color: "#E7C96F",
            cursor: "pointer",
          }}
        >
          Esqueceu sua senha?
        </button>
      </div>
    </main>
  );
}