import { ClientModel } from "@/models/Client"

export class ValidationEngine {

  execute(client: ClientModel): void {

    if (!client.fullName?.trim()) {
      throw new Error("Nome é obrigatório.")
    }

    if (!client.hasBirthDate) {
      throw new Error("Data de nascimento é obrigatória.")
    }

  }

}