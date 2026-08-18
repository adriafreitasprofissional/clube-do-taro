"use client"

interface ClientFormProps {
  showAstrology: boolean
}

export default function ClientForm({
  showAstrology,
}: ClientFormProps) {
  return (
    <div className="space-y-8">

      {/* Dados Gerais */}

      <div className="rounded-xl border p-6">

        <h2 className="text-xl font-semibold mb-6">
          Dados da Cliente
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Nome Completo"
            className="border rounded-lg p-3"
          />

          <input
            placeholder="Apelido"
            className="border rounded-lg p-3"
          />

          <input
            placeholder="Assinatura"
            className="border rounded-lg p-3"
          />

        </div>

      </div>

      {/* Astrologia */}

      {showAstrology && (

        <div className="rounded-xl border p-6">

          <h2 className="text-xl font-semibold mb-6">
            Dados Astrológicos
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="date"
              className="border rounded-lg p-3"
            />

            <input
              type="time"
              className="border rounded-lg p-3"
            />

            <input
              placeholder="Cidade"
              className="border rounded-lg p-3"
            />

            <input
              placeholder="Estado"
              className="border rounded-lg p-3"
            />

            <input
              placeholder="País"
              className="border rounded-lg p-3"
            />

          </div>

        </div>

      )}

    </div>
  )
}