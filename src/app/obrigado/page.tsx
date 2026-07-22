export default function ObrigadoPage() {
  return (
    <main className="min-h-screen bg-[#0B0616] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-yellow-500/20 bg-[#1A1026] p-10 text-center shadow-2xl">

        <div className="mb-8 text-6xl">✨</div>

        <h1 className="text-4xl font-bold text-white">
          Bem-vindo ao Clube do Tarô!
        </h1>

        <p className="mt-6 text-lg text-gray-300 leading-8">
          Seu pagamento foi recebido.
        </p>

        <p className="mt-4 text-gray-400 leading-8">
          Estamos preparando seu acesso ao Portal.
          Esse processo normalmente leva apenas alguns instantes.
        </p>

        <div className="mt-10 rounded-2xl border border-yellow-500/20 bg-[#241337] p-6">

          <h2 className="text-xl font-semibold text-yellow-400">
            O que acontece agora?
          </h2>

          <ul className="mt-6 space-y-4 text-left text-gray-300">
            <li>✔ Confirmamos seu pagamento.</li>
            <li>✔ Criamos automaticamente sua conta.</li>
            <li>✔ Liberamos seu plano.</li>
            <li>✔ Enviamos seu acesso por e-mail.</li>
          </ul>

        </div>

        <div className="mt-10">

          <div className="inline-flex items-center gap-3 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-6 py-3">

            <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-400"></div>

            <span className="text-yellow-300 font-medium">
              Processando sua assinatura...
            </span>

          </div>

        </div>

      </div>
    </main>
  );
}