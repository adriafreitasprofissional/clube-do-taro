import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const orderNsu = dados.order_nsu ? String(dados.order_nsu) : "";
    const transactionNsu = dados.transaction_nsu
      ? String(dados.transaction_nsu)
      : "";
    const slug = dados.slug ? String(dados.slug) : "";

    if (!orderNsu || !transactionNsu || !slug) {
      console.error("Webhook InfinitePay incompleto:", dados);

      return NextResponse.json(
        { error: "Dados do webhook incompletos." },
        { status: 400 }
      );
    }

    const resposta = await fetch(
      "https://api.checkout.infinitepay.io/payment_check",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          handle: "adriaescritora",
          order_nsu: orderNsu,
          transaction_nsu: transactionNsu,
          slug,
        }),
      }
    );

    const pagamento = await resposta.json();

    if (!resposta.ok || pagamento.success !== true || pagamento.paid !== true) {
      console.error("Pagamento não confirmado pela InfinitePay:", pagamento);

      return NextResponse.json(
        { error: "Pagamento ainda não confirmado." },
        { status: 400 }
      );
    }

    const { data: pedido, error: erroPedido } = await supabaseAdmin
      .from("infinitepay_orders")
      .select("id, valor, status")
      .eq("order_nsu", orderNsu)
      .single();

    if (erroPedido || !pedido) {
      console.error("Pedido não encontrado:", erroPedido);

      return NextResponse.json(
        { error: "Pedido não encontrado." },
        { status: 400 }
      );
    }

    if (Number(pagamento.amount) !== Number(pedido.valor)) {
      console.error("Valor do pagamento diferente do pedido:", {
        recebido: pagamento.amount,
        esperado: pedido.valor,
      });

      return NextResponse.json(
        { error: "Valor do pagamento não confere." },
        { status: 400 }
      );
    }

    const { error: erroAtualizacao } = await supabaseAdmin
      .from("infinitepay_orders")
      .update({
        status: "pago",
        infinitepay_transaction_id: transactionNsu,
        pago_em: new Date().toISOString(),
      })
      .eq("order_nsu", orderNsu);

    if (erroAtualizacao) {
      console.error("Erro ao atualizar pedido:", erroAtualizacao);

      return NextResponse.json(
        { error: "Não foi possível atualizar o pedido." },
        { status: 400 }
      );
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Erro no webhook InfinitePay:", error);

    return NextResponse.json(
      { error: "Webhook inválido." },
      { status: 400 }
    );
  }
}