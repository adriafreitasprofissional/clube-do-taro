"use client";

export default function TesteMercadoPago() {
  async function testarCheckout() {
    try {
      const response = await fetch(
        "/api/pagamentos/mercadopago/criar-preferencia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: "Comprador Teste",
            email: "test_user_123456@testuser.com",
            plano: "Bronze",
            valor: 27.2,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (!data.ok) {
        alert("Erro ao criar preferência.");
        return;
      }

      window.location.href =
        data.sandboxInitPoint || data.initPoint;
    } catch (e) {
      console.error(e);
      alert("Erro na comunicação com a API.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={testarCheckout}
        style={{
          padding: "18px 36px",
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        Testar Checkout Mercado Pago
      </button>
    </main>
  );
}