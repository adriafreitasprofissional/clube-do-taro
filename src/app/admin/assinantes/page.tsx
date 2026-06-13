"use client";

import { useState, useEffect } from "react";

export default function AssinantesPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [plano, setPlano] = useState("Bronze");
  const [senhaInicial, setSenhaInicial] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [genero, setGenero] = useState("Mulher");

  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    const response = await fetch("/api/admin/clientes");
    const data = await response.json();
    setClientes(data);
  }

  async function criarAssinante() {
    if (!nome || !email || !senhaInicial) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const response = await fetch(
      "/api/admin/criar-assinante",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          whatsapp,
          plano,
          senhaInicial,
          dataInicio,
          genero,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert("✨ Assinante criado com sucesso!");

    carregarClientes();

    setNome("");
    setEmail("");
    setWhatsapp("");
    setPlano("Bronze");
    setSenhaInicial("");
    setDataInicio("");
    setGenero("Mulher");
  }

  return (
    <div>
      <h1
        style={{
          color: "#f4d46a",
          marginBottom: "30px",
        }}
      >
        👥 Assinantes
      </h1>

      <a
        href="/admin"
        style={{
          color: "#f4d46a",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        ← Voltar ao Dashboard
      </a>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* FORMULÁRIO */}
        <div
          style={{
            background: "#240032",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid rgba(244,212,106,.2)",
          }}
        >
          <h2
            style={{
              color: "#f4d46a",
              marginBottom: "20px",
            }}
          >
            ➕ Novo Assinante
          </h2>

          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={campo}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={campo}
          />

          <input
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            style={campo}
          />

          <select
            value={plano}
            onChange={(e) => setPlano(e.target.value)}
            style={campo}
          >
            <option>Bronze</option>
            <option>Prata</option>
            <option>Ouro</option>
            <option>Diamante</option>
          </select>

          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            style={campo}
          >
            <option value="Mulher">👩 Mulher</option>
            <option value="Homem">👨 Homem</option>
          </select>

          <input
            placeholder="Senha Inicial"
            value={senhaInicial}
            onChange={(e) => setSenhaInicial(e.target.value)}
            style={campo}
          />

          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={campo}
          />

          <button
            onClick={criarAssinante}
            style={{
              background: "#f4d46a",
              color: "#000",
              border: "none",
              padding: "14px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ✨ Criar Assinante
          </button>
        </div>

        {/* LISTA */}
        <div
          style={{
            background: "#240032",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid rgba(244,212,106,.2)",
          }}
        >
          <h2
            style={{
              color: "#f4d46a",
              marginBottom: "20px",
            }}
          >
            👥 Assinantes
          </h2>

          <p style={{ color: "#fff" }}>
            Total: {clientes.length}
          </p>

          {clientes.map((cliente: any) => (
            <div
              key={cliente.id}
              style={{
                padding: "12px 0",
                borderBottom:
                  "1px solid rgba(255,255,255,.08)",
              }}
            >
              <strong>{cliente.nome}</strong>
              <br />
              <span style={{ color: "#ccc" }}>
                {cliente.plano} • {cliente.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const campo = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "1px solid rgba(244,212,106,.2)",
  background: "#1a001f",
  color: "#fff",
};