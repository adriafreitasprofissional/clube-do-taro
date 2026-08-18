interface Client {
  id: string
  nome: string
  data_nascimento?: string
  hora_nascimento?: string
  cidade_nascimento?: string
  estado_nascimento?: string
}

interface Props {
  client: Client | null
}

export function GenerateStepClient({
  client,
}: Props) {
  return (
    <div className="rounded-xl bg-zinc-950 p-4 text-sm text-zinc-300">

      <p><strong>Cliente:</strong> {client?.nome}</p>

      <p><strong>Data:</strong> {client?.data_nascimento}</p>

      <p><strong>Hora:</strong> {client?.hora_nascimento}</p>

      <p><strong>Cidade:</strong> {client?.cidade_nascimento}</p>

      <p><strong>Estado:</strong> {client?.estado_nascimento}</p>

    </div>
  )
}