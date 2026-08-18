import { SearchClient } from "./SearchClient";

interface Client {
  id: string;
  nome: string;
  email: string;
  plano: string;
  status: string;

  data_nascimento?: string;
  hora_nascimento?: string;
  cidade_nascimento?: string;
  estado_nascimento?: string;
  pais_nascimento?: string;
}

interface Props {
  onNext: (client: Client) => void;
}

export function ClientSelector({
  onNext,
}: Props) {
  return (
    <div className="w-full">
      <SearchClient
        onSelect={onNext}
      />
    </div>
  );
}