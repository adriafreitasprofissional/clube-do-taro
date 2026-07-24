import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nome,
      email,
      cpf,
      plano,
      valor
    } = body;

    const response = await fetch(
      "https://sandbox.api.pagseguro.com/checkouts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAGBANK_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reference_id: `CLUBE-${Date.now()}`,

          customer: {
            name: nome,
            email,
            tax_id: cpf
          },

          items: [
            {
              reference_id: plano,
              name: plano,
              quantity: 1,
              unit_amount: valor
            }
          ],

          redirect_url:
            "https://www.magiaoriente.com.br/pagamento/sucesso"
        })
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { erro: "Erro ao criar checkout." },
      { status: 500 }
    );
  }
}