"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ClientCard } from "./ClientCard";

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
  onSelect: (client: Client) => void;
}

export function SearchClient({
  onSelect,
}: Props) {

  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
const [novoCliente, setNovoCliente] = useState(false);
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [whatsapp, setWhatsapp] = useState("");
const [dataNascimento, setDataNascimento] = useState("");
const [horaNascimento, setHoraNascimento] = useState("");
const [cidade, setCidade] = useState("");
const [estado, setEstado] = useState("SP");
const [pais, setPais] = useState("Brasil");



  useEffect(() => {

    async function loadClients() {

      if (search.length < 3) {

        setClients([]);
        return;

      }

      setLoading(true);

      const { data } = await supabase
        .from("club_clients")
        .select(`
  id,
  nome,
  email,
  plano,
  status,
  whatsapp,
  data_nascimento,
  hora_nascimento,
  cidade_nascimento,
  estado_nascimento,
  pais_nascimento
`)
        .eq("status", "ativo")
        .or(
          `nome.ilike.%${search}%,email.ilike.%${search}%,whatsapp.ilike.%${search}%`
        )
        .order("nome")
        .limit(10);

      setClients(data ?? []);

      setLoading(false);

    }

    loadClients();

  }, [search]);

if (novoCliente) {

  return (

    <div className="rounded-3xl border border-yellow-500/20 bg-[#151221] p-10 space-y-6">

      <h2 className="text-3xl font-bold text-yellow-400">
        Nova Cliente
      </h2>

      <input
        placeholder="Nome Completo"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
      />

      <input
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
      />

      <input
        placeholder="WhatsApp"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
      />

      <div className="grid grid-cols-2 gap-4">

        <input
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-4"
        />

        <input
          type="time"
          value={horaNascimento}
          onChange={(e) => setHoraNascimento(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-4"
        />

      </div>

      <input
        placeholder="Cidade"
        value={cidade}
        onChange={(e) => setCidade(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
      />

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
      >
        <option value="SP">SP</option>
        <option value="RJ">RJ</option>
        <option value="MG">MG</option>
        <option value="ES">ES</option>
        <option value="PR">PR</option>
        <option value="SC">SC</option>
        <option value="RS">RS</option>
      </select>

      <input
        value={pais}
        onChange={(e) => setPais(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
      />

      <button
        onClick={salvarCliente}
        className="w-full rounded-2xl bg-yellow-500 py-4 font-bold text-[#151221]"
      >
        SALVAR CLIENTE
      </button>

    </div>

  );

}
async function salvarCliente() {

  const { data, error } = await supabase
    .from("club_clients")
    .insert({
      nome,
      email,
      whatsapp,
      status: "ativo",
      plano: "Mapa Premium",
      data_nascimento: dataNascimento,
      hora_nascimento: horaNascimento,
      cidade_nascimento: cidade,
      estado_nascimento: estado,
      pais_nascimento: pais,
    })
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }


  onSelect({
  ...data,
  data_nascimento: dataNascimento,
  hora_nascimento: horaNascimento,
  cidade_nascimento: cidade,
  estado_nascimento: estado,
  pais_nascimento: pais,
});

}
  return (

    <div className="space-y-6">

      <input
        type="text"
        placeholder="Digite nome, e-mail ou WhatsApp..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
      />

      {search.length < 3 && (

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-12 text-center">

          <div className="text-6xl">
            🔍
          </div>

          <h3 className="mt-4 text-2xl font-bold">
            Pesquise uma cliente
          </h3>

          <p className="mt-2 text-zinc-400">
            Digite pelo menos 3 letras.
          </p>

        </div>

      )}

      {loading && (

  <p className="text-zinc-400">
    Pesquisando...
  </p>

)}

{!loading && search.length >= 3 && clients.length === 0 && (

  <div className="rounded-3xl border border-yellow-500/20 bg-[#151221] p-10 text-center">

    <h2 className="text-2xl font-bold text-yellow-400">
      Cliente não encontrada
    </h2>

    <p className="mt-3 text-zinc-400">
      Deseja cadastrar uma nova cliente?
    </p>

    <button
      onClick={() => setNovoCliente(true)}
      className="mt-8 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-400 px-8 py-4 font-bold text-[#151221]"
    >
      + Cadastrar Nova Cliente
    </button>
  </div>

)}

{!loading &&
  clients.map((client) => (

    <ClientCard
      key={client.id}
      client={client}
      onSelect={() => {

        onSelect(client);

      }}
    />

))}

    </div>

  );

}