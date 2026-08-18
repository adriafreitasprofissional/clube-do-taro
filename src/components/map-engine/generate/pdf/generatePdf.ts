import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export async function generatePdf(_resultado?: any) {
  const element = document.getElementById("premium-pdf");

  if (!element) {
    alert("Conteúdo do PDF não encontrado.");
    return;
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  const blocks = Array.from(
    element.children
  ) as HTMLElement[];

  if (blocks.length === 0) {
    alert("Nenhum conteúdo encontrado para o PDF.");
    return;
  }

  let pageStarted = false;

  for (const block of blocks) {
    if (
      block.offsetWidth === 0 ||
      block.offsetHeight === 0
    ) {
      continue;
    }

    const clone = block.cloneNode(
      true
    ) as HTMLElement;

    clone.style.position = "fixed";
    clone.style.left = "0";
    clone.style.top = "0";
    clone.style.width = "794px";
    clone.style.height = "auto";
    clone.style.maxWidth = "794px";
    clone.style.maxHeight = "none";
    clone.style.overflow = "visible";
    clone.style.margin = "0";
    clone.style.padding = "32px";
    clone.style.background = "#F5F0F8";
    clone.style.backgroundColor = "#F5F0F8";
    clone.style.boxShadow = "none";
    clone.style.zIndex = "999999";
    clone.style.pointerEvents = "none";
    clone.style.color = "#30263A";

    clone
      .querySelectorAll("button")
      .forEach((button) => {
        button.remove();
      });

    const originalNodes =
      block.querySelectorAll("*");

    const clonedNodes =
      clone.querySelectorAll("*");

    const length = Math.min(
      originalNodes.length,
      clonedNodes.length
    );

    for (let i = 0; i < length; i++) {
      const original = originalNodes[i];
      const cloned =
        clonedNodes[i] as HTMLElement;

      const computed =
        window.getComputedStyle(original);

      cloned.style.color =
        computed.color;

      cloned.style.fontFamily =
        computed.fontFamily;

      cloned.style.fontSize =
        computed.fontSize;

      cloned.style.fontWeight =
        computed.fontWeight;

      cloned.style.fontStyle =
        computed.fontStyle;

      cloned.style.lineHeight =
        computed.lineHeight;

      cloned.style.letterSpacing =
        computed.letterSpacing;

      cloned.style.textAlign =
        computed.textAlign;

      cloned.style.textTransform =
        computed.textTransform;

      cloned.style.display =
        computed.display;

      cloned.style.flexDirection =
        computed.flexDirection;

      cloned.style.alignItems =
        computed.alignItems;

      cloned.style.justifyContent =
        computed.justifyContent;

      cloned.style.gap =
        computed.gap;

      cloned.style.padding =
        computed.padding;

      cloned.style.margin =
        computed.margin;

      cloned.style.width =
        computed.width;

      cloned.style.height =
        computed.height;

      cloned.style.borderRadius =
        computed.borderRadius;

      cloned.style.border =
        computed.border;

      cloned.style.boxShadow =
        "none";

      /*
       * Fundo premium.
       */
      const background =
        computed.backgroundColor;

      if (
        background === "rgb(11, 7, 18)" ||
        background === "rgb(18, 11, 28)" ||
        background === "rgb(26, 19, 44)" ||
        background === "rgb(36, 24, 58)"
      ) {
        cloned.style.backgroundColor =
          "#FBF8FC";
      } else {
        cloned.style.backgroundColor =
          background;
      }

      /*
       * Textos muito claros ficam sofisticados
       * em roxo profundo no PDF.
       */
      const color =
        computed.color;

      if (
        color === "rgb(255, 248, 234)" ||
        color === "rgb(242, 236, 248)" ||
        color === "rgb(245, 242, 255)" ||
        color === "rgb(215, 201, 231)"
      ) {
        cloned.style.color =
          "#30263A";
      }

      /*
       * Roxos muito escuros permanecem elegantes.
       */
      if (
        color === "rgb(11, 7, 18)" ||
        color === "rgb(26, 19, 44)"
      ) {
        cloned.style.color =
          "#30263A";
      }

      cloned.style.boxShadow = "none";
    }

    /*
     * Fundo geral da página.
     */
    clone.style.backgroundColor =
      "#F5F0F8";

    /*
     * Blocos internos.
     */
    clone
      .querySelectorAll(
        "article, section, header, footer"
      )
      .forEach((node) => {
        const item =
          node as HTMLElement;

        const current =
          window.getComputedStyle(item);

        if (
          current.backgroundColor ===
            "rgb(11, 7, 18)" ||
          current.backgroundColor ===
            "rgb(18, 11, 28)" ||
          current.backgroundColor ===
            "rgb(26, 19, 44)" ||
          current.backgroundColor ===
            "rgb(36, 24, 58)"
        ) {
          item.style.backgroundColor =
            "#FBF8FC";
        }

        item.style.boxShadow =
          "none";
      });

    document.body.appendChild(clone);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });

    const width = clone.scrollWidth;
    const height = clone.scrollHeight;

    if (
      width <= 0 ||
      height <= 0
    ) {
      clone.remove();
      continue;
    }

    const maxDimension =
      Math.max(width, height);

    const scale = Math.min(
      1.2,
      30000 / maxDimension
    );

    let canvas: HTMLCanvasElement;

    try {
      canvas = await html2canvas(
        clone,
        {
          scale,
          useCORS: true,
          backgroundColor: "#F5F0F8",
          logging: false,

          width,
          height,

          windowWidth: width,
          windowHeight: height,

          scrollX: 0,
          scrollY: 0,
        }
      );
    } catch (error) {
      console.error(
        "Erro ao gerar PDF:",
        error
      );

      clone.remove();

      alert(
        "Não foi possível preparar o PDF."
      );

      return;
    }

    clone.remove();

    if (
      canvas.width === 0 ||
      canvas.height === 0
    ) {
      continue;
    }

    const imageWidth =
      contentWidth;

    const imageHeight =
      (canvas.height * imageWidth) /
      canvas.width;

    if (
      imageHeight <= contentHeight
    ) {
      if (pageStarted) {
        pdf.addPage();
      }

      /*
       * Fundo marfim/lilás.
       */
      pdf.setFillColor(
        245,
        240,
        248
      );

      pdf.rect(
        0,
        0,
        pageWidth,
        pageHeight,
        "F"
      );

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        margin,
        margin,
        imageWidth,
        imageHeight,
        undefined,
        "FAST"
      );

      pageStarted = true;

      continue;
    }

    const pixelsPerPage = Math.max(
      1,
      Math.floor(
        (contentHeight /
          imageHeight) *
          canvas.height
      )
    );

    let sourceY = 0;

    while (
      sourceY < canvas.height
    ) {
      if (pageStarted) {
        pdf.addPage();
      }

      /*
       * Fundo premium.
       */
      pdf.setFillColor(
        245,
        240,
        248
      );

      pdf.rect(
        0,
        0,
        pageWidth,
        pageHeight,
        "F"
      );

      const sliceHeight =
        Math.min(
          pixelsPerPage,
          canvas.height - sourceY
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
        sliceCanvas.getContext("2d");

      if (!context) {
        throw new Error(
          "Não foi possível preparar o PDF."
        );
      }

      context.fillStyle =
        "#F5F0F8";

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

      const sliceData =
        sliceCanvas.toDataURL(
          "image/png"
        );

      const sliceHeightMm =
        (sliceHeight *
          imageWidth) /
        canvas.width;

      pdf.addImage(
        sliceData,
        "PNG",
        margin,
        margin,
        imageWidth,
        sliceHeightMm,
        undefined,
        "FAST"
      );

      sourceY += sliceHeight;

      pageStarted = true;
    }
  }

  if (!pageStarted) {
    alert(
      "Não foi possível gerar o PDF."
    );

    return;
  }

  /*
   * Rodapé premium.
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
     * Linha dourada.
     */
    pdf.setDrawColor(
      184,
      148,
      50
    );

    pdf.setLineWidth(0.25);

    pdf.line(
      margin,
      pageHeight - 8,
      pageWidth - margin,
      pageHeight - 8
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(7);

    pdf.setTextColor(
      117,
      102,
      128
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

  /*
   * Abre para visualização.
   */
  const blob =
    pdf.output("blob");

  const url =
    URL.createObjectURL(blob);

  window.open(
    url,
    "_blank"
  );
}