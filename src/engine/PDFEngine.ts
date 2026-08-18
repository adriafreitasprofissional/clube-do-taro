import { MapResult } from "@/types/results"

export class PDFEngine {

  async generate(map: MapResult): Promise<Buffer | null> {

    /**
     * TODO
     * Montar PDF Premium
     * - Capa
     * - Sumário
     * - Capítulos
     * - Rodapé
     * - Paginação
     * - Marca d'água
     */

    console.log("Gerando PDF...", map)

    return null

  }

}