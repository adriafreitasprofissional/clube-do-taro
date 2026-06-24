"use client";

import { useState } from "react";

export default function CopiarPixButton({
  chavePix,
}: {
  chavePix: string;
}) {
  const [copiado, setCopiado] = useState(false);

  async function copiarPix() {
    try {
      await navigator.clipboard.writeText(chavePix);
      setCopiado(true);

      setTimeout(() => {
        setCopiado(false);
      }, 2500);
    } catch {
      window.prompt("Copie a chave PIX abaixo:", chavePix);
    }
  }

  return (
    <button
      type="button"
      onClick={copiarPix}
      className="w-full rounded-xl bg-blue-600 px-5 py-4 text-sm font-extrabold text-white transition hover:bg-blue-500"
    >
      {copiado ? "✓ PIX COPIADO!" : "COPIAR CHAVE PIX"}
    </button>
  );
}