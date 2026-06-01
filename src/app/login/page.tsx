"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Login no Supabase
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error || !user) {
      alert("E-mail ou senha inválidos");
      setLoading(false);
      return;
    }

    // Busca o slug do cliente na tabela club_clients
    const emailUsuario = user.user.email;

const { data: clienteData, error: errorCliente } = await supabase
  .from("club_clients")
  .select("slug,status")
  .eq("email", emailUsuario)
  .single();

if (errorCliente || !clienteData?.slug) {
  alert(JSON.stringify(errorCliente));
  setLoading(false);
  return;
}

window.location.href =
  `/cliente/${clienteData.slug}/portal`;

setLoading(false);
window.location.href =
  `/cliente/${clienteData.slug}/portal`;

    // Redireciona para a página do cliente em nova aba
    const clienteUrl = `/cliente/${clienteData.slug}/portal`;
    window.location.href =
  `/cliente/${clienteData.slug}/portal`;
    setLoading(false);
  }

  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }

  async function resetSenha() {
    if (!email) {
      alert("Digite seu e-mail primeiro.");
      return;
    }

    await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: "https://www.magiaoriente.com.br/auth/callback",
});

    alert("Enviamos um link para redefinir sua senha.");
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
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "rgba(255,255,255,0.05)",
              padding: "16px",
              color: "white",
              marginBottom: "16px",
            }}
          />

          <div style={{ position: "relative" }}>
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(255,255,255,0.05)",
                padding: "16px",
                color: "white",
              }}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
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
              cursor: "pointer",
            }}
          >
            {loading ? "Entrando..." : "ENTRAR NO PORTAL"}
          </button>
        </form>

        <button
          onClick={loginGoogle}
          style={{
            width: "100%",
            borderRadius: "16px",
            backgroundColor: "rgba(255,255,255,0.08)",
            padding: "16px",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
            marginTop: "16px",
            cursor: "pointer",
          }}
        >
          Entrar com Google
        </button>

        <button
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