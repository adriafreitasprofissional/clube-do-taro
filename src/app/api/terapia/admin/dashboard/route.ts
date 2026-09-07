import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "../_auth";

function clienteRel(rel: any) {
  return Array.isArray(rel) ? rel[0] || null : rel || null;
}

export async function GET(request: NextRequest) {
  const admin = await getTherapyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }

  try {
    const { data: acessos, error } = await supabaseAdmin
      .from("therapy_client_access")
      .select(`
        client_id,
        active,
        club_clients (
          id, nome, nome_referencia, email, slug
        )
      `)
      .eq("active", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const clientes = (acessos || []).map((item: any) => {
      const c = clienteRel(item.club_clients);
      if (!c) return null;
      return {
        id: item.client_id,
        nome: c.nome_referencia || c.nome || "Cliente",
        nome_completo: c.nome || "",
        email: c.email || "",
        slug: c.slug || "",
      };
    }).filter(Boolean) as any[];

    const ids = clientes.map((c) => c.id);
    let anamneses: any[] = [];
    let proximos: any[] = [];

    if (ids.length) {
      const { data: a } = await supabaseAdmin
        .from("therapy_anamneses")
        .select("id, client_id, status, submitted_at")
        .in("client_id", ids)
        .order("submitted_at", { ascending: false });

      anamneses = a || [];

      const { data: p } = await supabaseAdmin
        .from("appointments")
        .select(`
          id, client_id, service_type, scheduled_at,
          duration_minutes, status, meet_url,
          club_clients (nome, nome_referencia)
        `)
        .in("client_id", ids)
        .neq("status", "cancelado")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(12);

      proximos = (p || []).map((item: any) => {
        const c = clienteRel(item.club_clients);
        return {
          id: item.id,
          client_id: item.client_id,
          client_name: c?.nome_referencia || c?.nome || "Cliente",
          service_type: item.service_type,
          scheduled_at: item.scheduled_at,
          duration_minutes: item.duration_minutes,
          status: item.status,
          meet_url: item.meet_url,
        };
      });
    }

    const latest = new Map<string, any>();
    for (const a of anamneses) {
      if (!latest.has(a.client_id)) latest.set(a.client_id, a);
    }

    const lista = clientes.map((c) => ({
      ...c,
      anamnese: latest.get(c.id) || null,
    }));

    const recebidas = lista.filter((c) =>
      c.anamnese?.status === "enviada" ||
      c.anamnese?.status === "revisada"
    ).length;

    const hojeBR = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const ini = new Date(`${hojeBR}T00:00:00-03:00`);
    const fim = new Date(`${hojeBR}T23:59:59-03:00`);

    const sessoesHoje = proximos.filter((item) => {
      const d = new Date(item.scheduled_at);
      return d >= ini && d <= fim;
    }).length;

    return NextResponse.json({
      admin,
      resumo: {
        clientes_ativas: lista.length,
        sessoes_hoje: sessoesHoje,
        anamneses_recebidas: recebidas,
        anamneses_pendentes: lista.length - recebidas,
      },
      clientes: lista,
      proximos_atendimentos: proximos,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao carregar painel." },
      { status: 500 }
    );
  }
}
