export type AgendaAtendimento = {
  id: string;
  client_id: string;
  client_name: string;
  client_slug?: string | null;

  service_type: string;
  professional: string;

  scheduled_at: string;
  duration_minutes: number;
  status: string;

  notes?: string | null;
  meet_url?: string | null;

  charge_type: string;
  amount?: number | null;

  private_session_notes?: string | null;
  evolution_summary?: string | null;
  client_activity?: string | null;
  published_to_client?: boolean;
  completed_at?: string | null;

  created_at?: string;
  updated_at?: string;
};

export type EdicaoAgendaModo = "editar" | "remarcar";
