"use client";

type Props = {
  tipo: "existente" | "novo";
  setTipo: (tipo: "existente" | "novo") => void;
  clienteId: string;
  setClienteId: (id: string) => void;
  clientes: any[];
};

export default function SelecionarCliente({
  tipo,
  setTipo,
  clienteId,
  setClienteId,
  clientes,
}: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-yellow-300">
          Cliente
        </h3>

        <p className="mt-1 text-sm text-purple-300">
          Selecione uma pessoa já cadastrada ou cadastre um novo cliente.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setTipo("existente")}
          className={`rounded-xl border p-4 text-left transition ${
            tipo === "existente"
              ? "border-yellow-300/60 bg-purple-800/50 text-white"
              : "border-purple-500/30 bg-[#1d0023] text-purple-300"
          }`}
        >
          <span className="block font-semibold">Cliente existente</span>
          <span className="mt-1 block text-xs opacity-70">
            Buscar alguém que já está cadastrado.
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTipo("novo")}
          className={`rounded-xl border p-4 text-left transition ${
            tipo === "novo"
              ? "border-yellow-300/60 bg-purple-800/50 text-white"
              : "border-purple-500/30 bg-[#1d0023] text-purple-300"
          }`}
        >
          <span className="block font-semibold">Novo cliente</span>
          <span className="mt-1 block text-xs opacity-70">
            Cadastrar uma nova pessoa.
          </span>
        </button>
      </div>

      {tipo === "existente" && (
        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className="w-full rounded-xl border border-purple-500/30 bg-[#1d0023] p-4 text-white outline-none"
        >
          <option value="">Selecione o cliente</option>

          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}