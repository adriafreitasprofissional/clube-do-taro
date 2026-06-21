import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PRODUTOS = {
  pombogira_publico: {
    descricao: "Portal do Poder da Sua Pombogira",
    preco: 4700,
  },
  pombogira_assinante: {
    descricao: "Portal do Poder da Sua Pombogira — valor especial para assinante",
    preco: 2720,
  },
} as const;

type ProdutoId = keyof typeof PRODUTOS;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      produtoId?: ProdutoId;
    };

    const produtoId = body.produtoId;

    if (!produtoId || !(produtoId in PRODUTOS)) {
      return NextResponse.json(
        { error: "Produto inválido." },
        { status: 400 }
      );
    }

    const produto = PRODUTOS[produtoId];
    const orderNsu = `clube-${produtoId}-${crypto.randomUUID()}`;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        const { error: erroPedido } = await supabaseAdmin.from("infinitepay_orders").insert({
      order_nsu: orderNsu,
      produto_id: produtoId,
      descricao: produto.descricao,
      valor: produto.preco,
      status: "pendente",
    });

    if (erroPedido) {
      console.error("Erro ao criar pedido:", erroPedido);

      return NextResponse.json(
        { error: "Não foi possível registrar o pedido." },
        { status: 500 }
      );
    }

    const resposta = await fetch(
      "https://api.checkout.infinitepay.io/links",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          handle: "adriaescritora",
          redirect_url: `${siteUrl}/pagamentos/sucesso`,
          webhook_url: `${siteUrl}/api/pagamentos/infinitepay/webhook`,
          order_nsu: orderNsu,
          items: [
            {
              quantity: 1,
              price: produto.preco,
              description: produto.descricao,
            },
          ],
        }),
      }
    );

    const dados = await resposta.json();

        if (!resposta.ok || !dados.url) {
      console.error("Erro da InfinitePay:", dados);

      await supabaseAdmin
        .from("infinitepay_orders")
        .update({ status: "erro_checkout" })
        .eq("order_nsu", orderNsu);

      return NextResponse.json(
        { error: "Não foi possível criar o checkout." },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from("infinitepay_orders")
      .update({ checkout_url: dados.url })
      .eq("order_nsu", orderNsu);

    return NextResponse.json({
      url: dados.url,
      orderNsu,
    });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);

    return NextResponse.json(
      { error: "Erro interno ao criar checkout." },
      { status: 500 }
    );
  }
}