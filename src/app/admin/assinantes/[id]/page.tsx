"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string; nome: string; senha_inicial?: string | null; nome_referencia?: string | null; email?: string | null; whatsapp?: string | null; plano?: string | null; genero?: string | null; tipo_assinatura?: string | null; data_inicio?: string | null; slug?: string | null; status?: string | null; acesso_app?: boolean | null; direcionamento_exclusivo?: boolean | null;
};

export default function FichaAssinante({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  useEffect(() => { carregarCliente(); }, [id]);

  async function carregarCliente() {
    setCarregando(true);
    const { data: sessao } = await supabase.auth.getSession();
    const token = sessao.session?.access_token;
    if (!token) { alert("Sessão expirada. Entre novamente."); setCarregando(false); return; }
    const response = await fetch(`/api/admin/clientes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) { alert(data.error || "Não foi possível carregar a assinante."); setCarregando(false); return; }
    setCliente(data);
    setCarregando(false);
  }

  async function enviarAcesso() {
    if (!cliente) return;
    if (!confirm(`Enviar o e-mail de acesso para ${cliente.nome}?`)) return;
    setEnviando(true);
    const { data: sessao } = await supabase.auth.getSession();
    const token = sessao.session?.access_token;
    if (!token) { alert("Sessão expirada. Entre novamente."); setEnviando(false); return; }
    const response = await fetch("/api/admin/enviar-boas-vindas", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: cliente.id }) });
    const data = await response.json();
    setEnviando(false);
    if (!response.ok) { alert(data.error || "Não foi possível enviar o e-mail."); return; }
    alert(`E-mail de acesso enviado para ${data.email}.`);
  }

  if (carregando) return <main style={{ padding: 30, color: "#fff" }}>Carregando assinante...</main>;
  if (!cliente) return <main style={{ padding: 30, color: "#fff" }}>Assinante não encontrada.</main>;

  return (
    <main style={{ minHeight: "100vh", background: "#12071f", color: "#fff", padding: "32px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <a href="/admin/assinantes" style={{ color: "#d8b4fe", textDecoration: "none" }}>← Voltar para Assinantes</a>
        <h1 style={{ marginTop: 24, marginBottom: 4 }}>Ficha da Assinante</h1>
        <p style={{ color: "#c4b5d4", marginTop: 0 }}>{cliente.nome_referencia || cliente.nome}</p>
        <section style={{ marginTop: 24, padding: 24, borderRadius: 16, background: "#21112f", border: "1px solid #4c2b63" }}>
          <h2 style={{ marginTop: 0 }}>Dados da assinante</h2>
          <p><strong>Nome:</strong> {cliente.nome}</p>
          <p><strong>Nome de referência:</strong> {cliente.nome_referencia || "—"}</p>
          <p><strong>E-mail:</strong> {cliente.email || "—"}</p>
          <p><strong>WhatsApp:</strong> {cliente.whatsapp || "—"}</p>
          <p><strong>Senha inicial:</strong> {cliente.senha_inicial || "—"}</p>
          <p><strong>Plano:</strong> {cliente.plano || "—"}</p>
          <p><strong>Tipo de assinatura:</strong> {cliente.tipo_assinatura || "—"}</p>
          <p><strong>Status:</strong> {cliente.status || "—"}</p>
          <p><strong>Início:</strong> {cliente.data_inicio ? new Date(cliente.data_inicio + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</p>
          <button onClick={enviarAcesso} disabled={enviando} style={{ marginTop: 16, padding: "12px 18px", border: 0, borderRadius: 10, background: "#7c3aed", color: "#fff", fontWeight: 700, cursor: enviando ? "wait" : "pointer" }}>{enviando ? "Enviando..." : "Enviar/Reenviar acesso"}</button>
        </section>
      </div>
    </main>
  );
}
