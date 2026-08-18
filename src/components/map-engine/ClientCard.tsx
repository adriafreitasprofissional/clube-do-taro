interface ClientCardProps {
  client: {
    id: string;
    nome: string;
    email?: string;
    plano?: string;
  };
  onSelect: () => void;
}

export function ClientCard({
  client,
  onSelect,
}: ClientCardProps) {
  
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex items-center justify-between">

      <div>

        <h3 className="text-xl font-semibold">
          {client.nome}
        </h3>

        <p className="text-zinc-400">
          {client.email ?? "Sem e-mail"}
        </p>

        <p className="text-yellow-400 mt-1">
          {client.plano ?? "Sem plano"}
        </p>

      </div>

      <button
        onClick={onSelect}
        className="rounded-lg bg-purple-700 px-5 py-3 hover:bg-purple-600"
      >
        Selecionar
      </button>

    </div>
  );
}