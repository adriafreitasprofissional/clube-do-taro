export type ConteudoDirecionamento = {
  slug: string;
  ano: string;
  mes: string;
  semana: string;
  tipo: string;
  ativo: string;
};

export function lerCsv(linha: string) {
  const colunas: string[] = [];
  let atual = "";
  let dentroDeAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const caractere = linha[i];

    if (caractere === '"') {
      dentroDeAspas = !dentroDeAspas;
    } else if (
      caractere === "," &&
      !dentroDeAspas
    ) {
      colunas.push(
        atual.trim().replace(/^"|"$/g, "")
      );
      atual = "";
    } else {
      atual += caractere;
    }
  }

  colunas.push(
    atual.trim().replace(/^"|"$/g, "")
  );

  return colunas;
}

export function transformarCsvConteudos(
  texto: string
): ConteudoDirecionamento[] {
  const linhas = texto
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter(Boolean);

  if (linhas.length === 0) {
    return [];
  }

  const cabecalho = lerCsv(linhas[0]).map(
    (item) => item.toLowerCase().trim()
  );

  return linhas
    .slice(1)
    .map((linha) => {
      const valores = lerCsv(linha);
      const item: Record<string, string> = {};

      cabecalho.forEach(
        (coluna, indice) => {
          item[coluna] =
            valores[indice] || "";
        }
      );

      return {
        slug: (item.slug || "")
          .toLowerCase()
          .trim(),

        ano: (item.ano || "").trim(),

        mes: (item.mes || "")
          .toLowerCase()
          .trim(),

        semana: (
          item.semana || ""
        ).trim(),

        tipo: (item.tipo || "")
          .toLowerCase()
          .trim(),

        ativo: (item.ativo || "")
          .toLowerCase()
          .trim(),
      };
    })
    .filter((item) => {
  if (
    !item.slug ||
    item.tipo !== "audio_individual" ||
    item.ativo !== "sim"
  ) {
    return false;
  }

  const ano = Number(item.ano);

  const meses: Record<string, number> = {
    janeiro: 1,
    fevereiro: 2,
    março: 3,
    marco: 3,
    abril: 4,
    maio: 5,
    junho: 6,
    julho: 7,
    agosto: 8,
    setembro: 9,
    outubro: 10,
    novembro: 11,
    dezembro: 12,
  };

  const mes = meses[item.mes] || 0;

  if (ano < 2026) {
    return false;
  }

  if (ano === 2026 && mes < 9) {
    return false;
  }

  return true;
});
}

const MESES: Record<string, number> = {
  janeiro: 1,
  fevereiro: 2,
  março: 3,
  marco: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
};

export function ordenarConteudos(
  conteudos: ConteudoDirecionamento[]
) {
  return [...conteudos].sort((a, b) => {
    const chaveA =
      Number(a.ano) * 10000 +
      (MESES[a.mes] || 0) * 100 +
      Number(a.semana);

    const chaveB =
      Number(b.ano) * 10000 +
      (MESES[b.mes] || 0) * 100 +
      Number(b.semana);

    return chaveA - chaveB;
  });
}