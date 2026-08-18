import { Client } from "@/types/client"

export class ClientModel {

  constructor(
    public data: Client
  ) {}

  get fullName() {
    return this.data.nome
  }

  get hasBirthDate() {
    return !!this.data.dataNascimento
  }

  get hasBirthTime() {
    return !!this.data.horaNascimento
  }

  get hasAstrologyData() {
    return (
      this.hasBirthDate &&
      this.hasBirthTime &&
      this.data.cidade &&
      this.data.estado
    )
  }

  get hasNominalData() {
    return !!this.data.nome
  }

}