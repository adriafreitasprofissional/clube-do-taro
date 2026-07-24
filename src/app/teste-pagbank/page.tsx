"use client";

export default function TestePagBank() {
  async function testar() {
    const res = await fetch("/api/pagamentos/pagbank/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: "Teste Clube do Tarô",
        email: "teste@teste.com",
        cpf: "12345678909",
        plano: "Plano Ouro",
        valor: 9700,
      }),
    });

    const data = await res.json();

    console.log(data);

    alert(JSON.stringify(data, null, 2));
  }

  return (
    <div style={{ padding: 40 }}>
      <button onClick={testar}>
        Testar PagBank
      </button>
    </div>
  );
}