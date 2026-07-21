export interface Direcionamento {
  resumo: {
    numerologia: string;
    orixa: string;
    carta: string;
    taro: string;
    foco: string;
  };

  orixa: {
    titulo: string;
    texto: string;
    ondeAjuda: string;
    cores: string[];
    diaPico: string;
    elemento: string;
    saudacao: string;
  };

  carta: {
    titulo: string;
    naipe: string;
    elemento: string;
    texto: string;
    naipeTexto: string;
    elementoTexto: string;
  };

  taro: {
    titulo: string;
    texto: string;
  };

  numerologia: {
    vibracaoSemana: string;
    essenciaNome: string;
    pontosFortes: string[];
    pontosObservar: string[];
    melhorar: string[];
  };

  foco: {
    titulo: string;
    texto: string;
  };

  espiritual: {
    titulo: string;
    texto: string;
  };

  saude: {
    titulo: string;
    texto: string;
  };

  direcionamentoPratico: string[];

  exercicioSemana: string[];

  conselhoFinal: string;
}