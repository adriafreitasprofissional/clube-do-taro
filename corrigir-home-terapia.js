const fs = require("fs");

const arquivo = "src/app/admin/terapia/page.tsx";
let texto = fs.readFileSync(arquivo, "utf8");

// IMPORTS
texto = texto.replace(
  'import Link from "next/link";',
  `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";`
);

// INÍCIO DO COMPONENTE
texto = texto.replace(
  /export default function TerapiaAdminPage\(\) \{\r?\n\s*return \(/,
`export default function TerapiaAdminPage() {
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error("Sessão administrativa expirada.");
        }

        const response = await fetch(
          "/api/terapia/admin/dashboard",
          {
            cache: "no-store",
            headers: {
              Authorization:
                \`Bearer \${session.access_token}\`,
            },
          }
        );

        const resultado = await response.json();

        if (!response.ok) {
          throw new Error(
            resultado?.error ||
              "Erro ao carregar os dados."
          );
        }

        setDados(resultado);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar os dados."
        );
      }
    }

    carregar();
  }, []);

  const resumo = dados?.resumo || null;

  return (`
);

// CARDS
texto = texto.replace(
  /\{\[\s*\["Pacientes ativas", "—"\],\s*\["Próximos atendimentos", "—"\],\s*\["Atividades pendentes", "—"\],\s*\["Respostas recebidas", "—"\],\s*\]\.map\(\(\[label, valor\]\) => \(/m,
`{[
          [
            "Pacientes ativas",
            resumo
              ? String(resumo.clientes_ativas)
              : "...",
          ],
          [
            "Sessões hoje",
            resumo
              ? String(resumo.sessoes_hoje)
              : "...",
          ],
          [
            "Anamneses recebidas",
            resumo
              ? String(resumo.anamneses_recebidas)
              : "...",
          ],
          [
            "Anamneses pendentes",
            resumo
              ? String(resumo.anamneses_pendentes)
              : "...",
          ],
        ].map(([label, valor]) => (`
);

// MENSAGEM DE ERRO
texto = texto.replace(
  /\s*\{\/\* MÓDULOS \*\/\}/,
`
      {erro && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px 16px",
            borderRadius: "14px",
            border: "1px solid rgba(248,113,113,.3)",
            background: "rgba(127,29,29,.18)",
            color: "#fecaca",
            fontSize: "13px",
          }}
        >
          {erro}
        </div>
      )}

      {/* MÓDULOS */}`
);

fs.writeFileSync(arquivo, texto, "utf8");

console.log("HOME DA TERAPIA CORRIGIDA");