export interface Client {

  // Identificação
  id?: string

  nome: string
  apelido?: string
  assinatura?: string

  // Nascimento
  dataNascimento?: string
  horaNascimento?: string

  cidade?: string
  estado?: string
  pais?: string

}