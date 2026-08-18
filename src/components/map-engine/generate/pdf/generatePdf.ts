import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export async function generatePdf(
  _resultado?: any,
  nome?: string
) {
  const element =
    document.getElementById("premium-pdf");

  if (!element) {
    alert("Conteúdo do PDF não encontrado.");
    return;
  }

  console.log("PDF: iniciando");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const margin = 12;
  const headerHeight = 10;

  const contentWidth =
    pageWidth - margin * 2;

  const contentHeight =
    pageHeight -
    margin * 2 -
    headerHeight;

  /*
   * Capturamos cada bloco separadamente.
   *
   * Isso evita ultrapassar o limite máximo
   * de 32767px do canvas.
   */
  const blocks = Array.from(
    element.children
  ) as HTMLElement[];

  if (blocks.length === 0) {
    alert(
      "Nenhum conteúdo encontrado para o PDF."
    );
    return;
  }

  let pageNumber = 0;

  for (
    let blockIndex = 0;
    blockIndex < blocks.length;
    blockIndex++
  ) {
    const block = blocks[blockIndex];

    if (!block) {
      continue;
    }

    console.log(
      `PDF: preparando bloco ${
        blockIndex + 1
      } de ${blocks.length}`
    );

    const clone =
      block.cloneNode(true) as HTMLElement;

    /*
     * Área temporária de captura.
     */
    const captureArea =
      document.createElement("div");

    captureArea.style.position =
      "fixed";

    captureArea.style.left =
      "-9000px";

    captureArea.style.top =
      "0";

    captureArea.style.width =
      "794px";

    captureArea.style.margin =
      "0";

    captureArea.style.padding =
      "0";

    captureArea.style.backgroundColor =
      "#24183A";

    captureArea.style.pointerEvents =
      "none";

    captureArea.style.zIndex =
      "-9999";

    /*
     * Configuração principal do bloco.
     *
     * O PDF inteiro usa uma única cor:
     * roxo profundo #24183A.
     */
    clone.style.position =
      "relative";

    clone.style.left =
      "0";

    clone.style.top =
      "0";

    clone.style.width =
      "794px";

    clone.style.maxWidth =
      "794px";

    clone.style.height =
      "auto";

    clone.style.maxHeight =
      "none";

    clone.style.overflow =
      "visible";

    clone.style.margin =
      "0";

    clone.style.backgroundColor =
      "#24183A";

    clone.style.background =
      "#24183A";

    clone.style.backgroundImage =
      "none";

    clone.style.boxShadow =
      "none";

    clone.style.filter =
      "none";

    clone.style.color =
      "#F8F3EA";

    /*
     * Remove botões.
     */
    clone
      .querySelectorAll("button")
      .forEach((button) => {
        button.remove();
      });

    /*
     * IMPORTANTE:
     *
     * Todos os elementos internos ficam
     * transparentes.
     *
     * Assim não aparece mais:
     *
     * roxo por fora
     * + preto por dentro.
     *
     * O fundo passa a ser uma única cor.
     */
    clone
      .querySelectorAll("*")
      .forEach((node) => {
        const item =
          node as HTMLElement;

        item.style.backgroundColor =
          "transparent";

        item.style.backgroundImage =
          "none";

        item.style.boxShadow =
          "none";

        item.style.filter =
          "none";
      });

    /*
     * O próprio bloco continua sendo
     * o fundo roxo principal.
     */
    clone.style.backgroundColor =
      "#24183A";

    clone.style.background =
      "#24183A";

    captureArea.appendChild(
      clone
    );

    document.body.appendChild(
      captureArea
    );

    /*
     * Aguarda o navegador calcular
     * completamente o layout.
     */
    await new Promise<void>(
      (resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }
    );

    const width =
      captureArea.scrollWidth;

    const height =
      captureArea.scrollHeight;

    console.log(
      `PDF: bloco ${
        blockIndex + 1
      } — ${width} x ${height}px`
    );

    if (
      width <= 0 ||
      height <= 0
    ) {
      captureArea.remove();
      continue;
    }

    /*
     * O canvas nunca pode ultrapassar
     * 32767px.
     */
    const maxDimension =
      30000;

    const scale =
      Math.min(
        1.5,
        maxDimension /
          Math.max(
            width,
            height
          )
      );

    let canvas:
      HTMLCanvasElement;

    try {
      console.log(
        `PDF: renderizando bloco ${
          blockIndex + 1
        }`
      );

      canvas =
        await html2canvas(
          captureArea,
          {
            scale,

            useCORS:
              true,

            backgroundColor:
              "#24183A",

            logging:
              false,

            width,

            height,

            windowWidth:
              width,

            windowHeight:
              Math.min(
                height,
                maxDimension
              ),

            scrollX:
              0,

            scrollY:
              0,
          }
        );
    } catch (error) {
      console.error(
        `PDF: erro no bloco ${
          blockIndex + 1
        }`,
        error
      );

      captureArea.remove();

      alert(
        `Erro ao preparar a página ${
          blockIndex + 1
        } do PDF.`
      );

      return;
    }

    /*
     * Remove imediatamente
     * a cópia temporária.
     */
    captureArea.remove();

    if (
      canvas.width <= 0 ||
      canvas.height <= 0
    ) {
      continue;
    }

    /*
     * Calcula o tamanho da imagem
     * dentro do A4.
     */
    const imageWidth =
      contentWidth;

    const imageHeight =
      (canvas.height *
        imageWidth) /
      canvas.width;

    /*
     * Caso o bloco caiba inteiro
     * em uma página.
     */
    if (
      imageHeight <=
      contentHeight
    ) {
      if (pageNumber > 0) {
        pdf.addPage();
      }

      /*
       * Fundo único da página.
       */
      pdf.setFillColor(
        36,
        24,
        58
      );

      pdf.rect(
        0,
        0,
        pageWidth,
        pageHeight,
        "F"
      );

      /*
       * Cabeçalho discreto.
       */
      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(7);

      pdf.setTextColor(
        212,
        175,
        55
      );

      pdf.text(
        "MAPA NUMEROLÓGICO PREMIUM",
        margin,
        7
      );

      if (nome) {
        pdf.setTextColor(
          220,
          211,
          229
        );

        pdf.text(
          nome,
          pageWidth - margin,
          7,
          {
            align: "right",
          }
        );
      }

      /*
       * Conteúdo.
       */
      pdf.addImage(
        canvas.toDataURL(
          "image/png"
        ),
        "PNG",
        margin,
        margin +
          headerHeight,
        imageWidth,
        imageHeight,
        undefined,
        "FAST"
      );

      pageNumber++;

      continue;
    }

    /*
     * Se o bloco for maior que uma
     * página, divide em páginas A4.
     */
    const pixelsPerPage =
      Math.max(
        1,
        Math.floor(
          (contentHeight /
            imageHeight) *
            canvas.height
        )
      );

    let sourceY = 0;

    while (
      sourceY <
      canvas.height
    ) {
      if (pageNumber > 0) {
        pdf.addPage();
      }

      /*
       * Fundo único.
       */
      pdf.setFillColor(
        36,
        24,
        58
      );

      pdf.rect(
        0,
        0,
        pageWidth,
        pageHeight,
        "F"
      );

      /*
       * Cabeçalho discreto.
       */
      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(7);

      pdf.setTextColor(
        212,
        175,
        55
      );

      pdf.text(
        "MAPA NUMEROLÓGICO PREMIUM",
        margin,
        7
      );

      if (nome) {
        pdf.setTextColor(
          220,
          211,
          229
        );

        pdf.text(
          nome,
          pageWidth - margin,
          7,
          {
            align: "right",
          }
        );
      }

      /*
       * Altura desta parte da página.
       */
      const sliceHeight =
        Math.min(
          pixelsPerPage,
          canvas.height -
            sourceY
        );

      const sliceCanvas =
        document.createElement(
          "canvas"
        );

      sliceCanvas.width =
        canvas.width;

      sliceCanvas.height =
        sliceHeight;

      const context =
        sliceCanvas.getContext(
          "2d"
        );

      if (!context) {
        throw new Error(
          "Não foi possível preparar a página."
        );
      }

      /*
       * Fundo único também no
       * pedaço da imagem.
       */
      context.fillStyle =
        "#24183A";

      context.fillRect(
        0,
        0,
        sliceCanvas.width,
        sliceCanvas.height
      );

      context.drawImage(
        canvas,

        0,
        sourceY,

        canvas.width,
        sliceHeight,

        0,
        0,

        canvas.width,
        sliceHeight
      );

      const imageData =
        sliceCanvas.toDataURL(
          "image/png"
        );

      const sliceHeightMm =
        (sliceHeight *
          imageWidth) /
        canvas.width;

      pdf.addImage(
        imageData,
        "PNG",
        margin,
        margin +
          headerHeight,
        imageWidth,
        sliceHeightMm,
        undefined,
        "FAST"
      );

      sourceY +=
        sliceHeight;

      pageNumber++;
    }
  }

  if (
    pageNumber === 0
  ) {
    alert(
      "Não foi possível criar nenhuma página."
    );

    return;
  }

  /*
   * RODAPÉ DE TODAS AS PÁGINAS.
   */
  const totalPages =
    pdf.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    pdf.setPage(page);

    /*
     * Linha dourada discreta.
     */
    pdf.setDrawColor(
      212,
      175,
      55
    );

    pdf.setLineWidth(
      0.25
    );

    pdf.line(
      margin,
      pageHeight - 8,
      pageWidth - margin,
      pageHeight - 8
    );

    /*
     * Rodapé.
     */
    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(7);

    pdf.setTextColor(
      216,
      201,
      232
    );

    pdf.text(
      "MAPA NUMEROLÓGICO PREMIUM",
      margin,
      pageHeight - 4
    );

    pdf.text(
      `${page} / ${totalPages}`,
      pageWidth - margin,
      pageHeight - 4,
      {
        align: "right",
      }
    );
  }

  console.log(
    `PDF: ${totalPages} páginas criadas`
  );

  /*
   * Abre o PDF em outra aba.
   */
  const blob =
    pdf.output("blob");

  const url =
    URL.createObjectURL(
      blob
    );

  const newWindow =
    window.open(
      url,
      "_blank"
    );

  if (!newWindow) {
    alert(
      "O navegador bloqueou a abertura do PDF. Permita pop-ups."
    );

    return;
  }

  console.log(
    "PDF: aberto com sucesso"
  );
}