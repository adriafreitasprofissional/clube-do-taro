"use client";

import { useEffect, useState } from "react";
import type { Leitura } from "@/lib/direcionamento-engine";
import { cartasCiganas, focos, orixas, tarot } from "@/lib/direcionamento-engine";
import { EditableField } from "@/components/direcionamentos/EditableField";
import { gerarPdfMistico } from "@/lib/direcionamento-pdf";

type EditValue = string | string[];

interface Props {
  leitura: Leitura;
  slug: string;
  dataInicio: string;
  dataFim: string;
  onTrocarOrixa?: (value: string) => void;
  onTrocarFoco?: (value: string) => void;
  onTrocarCartaCigana?: (value: string) => void;
  onTrocarCartaTaro?: (value: string) => void;
  onEditarCampo?: (path: string, value: EditValue) => void;
}

const box = "rounded-2xl border border-purple-500/20 bg-[#151221] p-6";
const sub = "rounded-xl border border-purple-500/20 bg-[#201a35] p-4";
const label = "text-xs font-semibold uppercase tracking-wider text-yellow-300";
const texto = "mt-2 text-sm leading-relaxed text-purple-100";
const select = "w-full rounded-xl border border-purple-500/30 bg-[#1c1729] p-3 text-purple-50 outline-none focus:border-yellow-400";

export function LeituraResult(props: Props) {
  const { leitura } = props;
  const [parecerAdria, setParecerAdria] = useState("");
  const [roteiroAudio, setRoteiroAudio] = useState("");
  const [gerandoRoteiro, setGerandoRoteiro] = useState(false);
  const [gerandoAudio, setGerandoAudio] = useState(false);
const [rascunhoAudioCarregado, setRascunhoAudioCarregado] = useState(false);

const chaveRascunhoAudio =
  `clube-taro-audio:${props.slug}:${props.dataInicio}:${props.dataFim}`;

  useEffect(() => {
  setRascunhoAudioCarregado(false);

  try {
    const salvo = localStorage.getItem(chaveRascunhoAudio);

    if (salvo) {
      const dados = JSON.parse(salvo);

      setParecerAdria(dados.parecerAdria || "");
      setRoteiroAudio(dados.roteiroAudio || "");
    } else {
      setParecerAdria("");
      setRoteiroAudio("");
    }
  } catch (error) {
    console.error("Erro ao carregar roteiro salvo:", error);
  } finally {
    setRascunhoAudioCarregado(true);
  }
}, [chaveRascunhoAudio]);
useEffect(() => {
  if (!rascunhoAudioCarregado) return;

  try {
    localStorage.setItem(
      chaveRascunhoAudio,
      JSON.stringify({
        parecerAdria,
        roteiroAudio,
      })
    );
  } catch (error) {
    console.error("Erro ao salvar roteiro:", error);
  }
}, [
  parecerAdria,
  roteiroAudio,
  chaveRascunhoAudio,
  rascunhoAudioCarregado,
]);


  async function gerarRoteiroAudio() {
    try {
      setGerandoRoteiro(true);
      setRoteiroAudio("");

      const response = await fetch("/api/gerador-direcionamento/roteiro-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leitura, parecerAdria }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.erro || "Não foi possível gerar o roteiro para áudio.");
      }

      setRoteiroAudio(data.roteiro || "");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Erro ao gerar roteiro para áudio.");
    } finally {
      setGerandoRoteiro(false);
    }
  }

  async function copiarRoteiro() {
    if (!roteiroAudio) return;

    await navigator.clipboard.writeText(roteiroAudio);
    alert("Roteiro copiado.");
  }

  async function gerarAudioElevenLabs() {
    if (!roteiroAudio.trim()) {
      alert("Gere o roteiro para áudio primeiro.");
      return;
    }

    try {
      setGerandoAudio(true);

      const response = await fetch("/api/elevenlabs/gerar-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  texto: roteiroAudio,
  nome: leitura.nome,
  slug: props.slug,
  dataInicio: props.dataInicio,
  dataFim: props.dataFim,
}),
      });

      if (!response.ok) {
        let mensagem = "Não foi possível gerar o áudio.";

        try {
          const data = await response.json();
          mensagem = data?.error || mensagem;
        } catch {}

        throw new Error(mensagem);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const contentDisposition =
  response.headers.get("Content-Disposition");

const nomeArquivo =
  contentDisposition?.match(/filename="([^"]+)"/)?.[1] ||
  `${props.slug}-direcionamento-audio.mp3`;

const link = document.createElement("a");
link.href = url;
link.download = nomeArquivo;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Erro ao gerar áudio."
      );
    } finally {
      setGerandoAudio(false);
    }
  }

  const edit = (path: string) =>
    props.onEditarCampo
      ? (value: EditValue) => props.onEditarCampo?.(path, value)
      : undefined;

  const ancestralidade = leitura.orixa === "Babá Egum";

  return (
    <div className="space-y-6">
      <section className={box}>
        <div className="text-center">
          <p className="text-xs text-purple-300">Associada #{leitura.idAssociado}</p>
          <h2 className="mt-1 text-3xl font-bold text-yellow-400">{leitura.nome}</h2>
          <p className="mt-1 text-sm text-purple-200">Semana: {leitura.semana}</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Numerologia", leitura.numerologia],
            ["Energia espiritual", leitura.orixa],
            ["Carta Cigana", leitura.cartaCigana],
            ["Tarô", leitura.cartaTaro],
            ["Foco", leitura.foco],
          ].map(([k, v]) => (
            <div key={String(k)} className={sub}>
              <p className={label}>{k}</p>
              <p className="mt-2 font-semibold text-purple-50">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <SelectBox labelText="Trocar energia espiritual" value={leitura.orixa} options={orixas} onChange={props.onTrocarOrixa} />
          <SelectBox labelText="Trocar foco" value={leitura.foco} options={focos} onChange={props.onTrocarFoco} />
          <SelectBox labelText="Trocar Carta Cigana" value={leitura.cartaCigana} options={cartasCiganas} onChange={props.onTrocarCartaCigana} />
          <SelectBox labelText="Trocar Tarô" value={leitura.cartaTaro} options={tarot} onChange={props.onTrocarCartaTaro} />
        </div>
      </section>

      <section className={box}>
        <h3 className="text-xl font-bold text-yellow-300">
          {leitura.orixa} — {ancestralidade ? "ancestralidade da semana" : "energia espiritual da semana"}
        </h3>
        <EditableField value={leitura.orixaPerfil.descricao} onSave={edit("orixaPerfil.descricao")}>
          <p className={texto}>{leitura.orixaPerfil.descricao}</p>
        </EditableField>
        <div className={`${sub} mt-4`}>
          <p className={label}>Onde essa energia ajuda</p>
          <EditableField value={leitura.orixaPerfil.ondeAjuda} onSave={edit("orixaPerfil.ondeAjuda")}>
            <p className={texto}>{leitura.orixaPerfil.ondeAjuda}</p>
          </EditableField>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className={sub}><p className={label}>Cores</p><EditableField value={leitura.orixaPerfil.cores} onSave={edit("orixaPerfil.cores")} hint="Uma cor por linha."><p className={texto}>{leitura.orixaPerfil.cores.join(" • ")}</p></EditableField></div>
          <div className={sub}><p className={label}>Dia de pico</p><EditableField value={leitura.orixaPerfil.diaSemana} onSave={edit("orixaPerfil.diaSemana")}><p className={texto}>{leitura.orixaPerfil.diaSemana}</p></EditableField></div>
          <div className={sub}><p className={label}>Elemento</p><p className={texto}>{leitura.orixaPerfil.elemento}</p></div>
        </div>
      </section>

      <section className={box}>
        <h3 className="text-xl font-bold text-yellow-300">{leitura.cartaCigana}</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className={sub}><p className={label}>Naipe</p><EditableField value={leitura.detalheCartaCigana.naipe} onSave={edit("detalheCartaCigana.naipe")}><p className={texto}>{leitura.detalheCartaCigana.naipe}</p></EditableField></div>
          <div className={sub}><p className={label}>Elemento Lenormand</p><EditableField value={leitura.detalheCartaCigana.elemento} onSave={edit("detalheCartaCigana.elemento")}><p className={texto}>{leitura.detalheCartaCigana.elemento}</p></EditableField></div>
        </div>
        <div className={`${sub} mt-3`}><p className={label}>Direcionamento do Naipe</p><EditableField value={leitura.detalheCartaCigana.direcionamentoNaipe} onSave={edit("detalheCartaCigana.direcionamentoNaipe")}><p className={texto}>{leitura.detalheCartaCigana.direcionamentoNaipe}</p></EditableField></div>
        <div className={`${sub} mt-3`}><p className={label}>Direcionamento do elemento</p><EditableField value={leitura.detalheCartaCigana.direcionamentoLenormand} onSave={edit("detalheCartaCigana.direcionamentoLenormand")}><p className={texto}>{leitura.detalheCartaCigana.direcionamentoLenormand}</p></EditableField></div>
        <div className={`${sub} mt-3`}><p className={label}>Como reflete na vida</p><EditableField value={leitura.detalheCartaCigana.reflexo} onSave={edit("detalheCartaCigana.reflexo")}><p className={texto}>{leitura.detalheCartaCigana.reflexo}</p></EditableField></div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Message title={leitura.cartaCigana} value={leitura.significadoCartaCigana} onSave={edit("significadoCartaCigana")} />
        <Message title={leitura.cartaTaro} value={leitura.significadoTaro} onSave={edit("significadoTaro")} />
      </div>

      <section className={box}>
        <h3 className="text-xl font-bold text-yellow-300">Numerologia — Semana {leitura.numerologiaDetalhe.numeroSemana} · Vibração do Nome {leitura.numerologiaDetalhe.numeroNome}</h3>
        <div className={`${sub} mt-4`}><EditableField value={leitura.numerologiaDetalhe.mensagemUnificada} onSave={edit("numerologiaDetalhe.mensagemUnificada")}><p className={texto}>{leitura.numerologiaDetalhe.mensagemUnificada}</p></EditableField></div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Lista titulo="Pontos fortes" value={leitura.numerologiaDetalhe.pontosFortes} onSave={edit("numerologiaDetalhe.pontosFortes")} />
          <Lista titulo="Pontos a observar" value={leitura.numerologiaDetalhe.pontosFracos} onSave={edit("numerologiaDetalhe.pontosFracos")} />
          <Lista titulo="O que melhorar" value={leitura.numerologiaDetalhe.aMelhorar} onSave={edit("numerologiaDetalhe.aMelhorar")} />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Message title={`Foco — ${leitura.foco}`} value={leitura.mensagemFoco} onSave={edit("mensagemFoco")} />
        <Message title="Espiritual" value={leitura.mensagemEspiritual} onSave={edit("mensagemEspiritual")} />
        <Message title="Saúde" value={leitura.mensagemSaude} onSave={edit("mensagemSaude")} />
      </div>

      <section className={box}>
        <h3 className="text-xl font-bold text-yellow-300">Direcionamento prático</h3>
        <EditableField value={leitura.sugestoes} onSave={edit("sugestoes")} hint="Um item por linha.">
          <ol className="mt-3 space-y-2 text-purple-100">{leitura.sugestoes.map((s, i) => <li key={i}>{i + 1}. {s}</li>)}</ol>
        </EditableField>
      </section>

      <section className={box}>
        <h3 className="text-xl font-bold text-yellow-300">Exercício de saúde mental</h3>
        <EditableField value={leitura.exercicioMental.titulo} onSave={edit("exercicioMental.titulo")}><p className={texto}>{leitura.exercicioMental.titulo}</p></EditableField>
        <EditableField value={leitura.exercicioMental.passos} onSave={edit("exercicioMental.passos")} hint="Um passo por linha."><ol className="mt-3 space-y-2 text-purple-100">{leitura.exercicioMental.passos.map((s, i) => <li key={i}>{i + 1}. {s}</li>)}</ol></EditableField>
      </section>

      <section className={box}>
        <h3 className="text-center text-xl font-bold text-yellow-300">Conselho da Cigana Estella</h3>
        <EditableField value={leitura.mensagemFinal} onSave={edit("mensagemFinal")}><p className="mt-3 text-center italic leading-relaxed text-purple-100">{leitura.mensagemFinal}</p></EditableField>
      </section>

      <section className={box}>
        <h3 className="text-xl font-bold text-yellow-300">Roteiro resumido para o áudio</h3>
        <p className="mt-2 text-sm text-purple-200">
          Se quiser, acrescente uma observação sua. O agente cria um resumo curto apenas da energia espiritual, cartas, naipe, elemento e numerologia; o restante permanece no PDF.
        </p>
        <textarea
          value={parecerAdria}
          onChange={(e) => setParecerAdria(e.target.value)}
          placeholder="Observações da Ádria para este áudio (opcional)..."
          className="mt-4 min-h-28 w-full resize-y rounded-xl border border-purple-500/30 bg-[#1c1729] p-4 text-purple-50 outline-none focus:border-yellow-400"
        />

        <button
          type="button"
          onClick={gerarRoteiroAudio}
          disabled={gerandoRoteiro}
          className="mt-4 w-full rounded-2xl border border-purple-400/50 bg-purple-500/10 px-5 py-4 font-bold text-purple-100 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {gerandoRoteiro ? "GERANDO ROTEIRO..." : "GERAR ROTEIRO RESUMIDO PARA ÁUDIO"}
        </button>

        {roteiroAudio && (
          <div className="mt-5 rounded-2xl border border-purple-500/30 bg-[#201a35] p-5">
            <p className={label}>Roteiro pronto para gravação</p>
            <textarea
              value={roteiroAudio}
              onChange={(e) => setRoteiroAudio(e.target.value)}
              className="mt-3 min-h-[260px] w-full resize-y rounded-xl border border-purple-500/30 bg-[#171426] p-4 text-sm leading-relaxed text-purple-50 outline-none focus:border-purple-300"
            />
            <button
              type="button"
              onClick={copiarRoteiro}
              className="mt-3 rounded-xl border border-purple-400/50 px-4 py-2 font-semibold text-purple-100"
            >
              COPIAR ROTEIRO
            </button>
          </div>
        )}
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => gerarPdfMistico(leitura)} className="rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-400 px-5 py-4 font-bold text-[#151221]">GERAR PDF</button>
        <button
          type="button"
          onClick={gerarAudioElevenLabs}
          disabled={!roteiroAudio.trim() || gerandoAudio}
          className="rounded-2xl border border-purple-400/40 bg-purple-500/10 px-5 py-4 font-bold text-purple-100 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {gerandoAudio
            ? "GERANDO ÁUDIO..."
            : "GERAR ÁUDIO — ELEVENLABS"}
        </button>
      </div>
    </div>
  );
}

function SelectBox({ labelText, value, options, onChange }: { labelText: string; value: string; options: string[]; onChange?: (value: string) => void }) {
  return <div><p className="mb-1 text-xs text-purple-300">{labelText}</p><select className={select} value={value} onChange={(e) => onChange?.(e.target.value)}>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>;
}

function Message({ title, value, onSave }: { title: string; value: string; onSave?: (value: EditValue) => void }) {
  return <section className={box}><h3 className="text-lg font-bold text-yellow-300">{title}</h3><EditableField value={value} onSave={onSave}><p className={texto}>{value}</p></EditableField></section>;
}

function Lista({ titulo, value, onSave }: { titulo: string; value: string[]; onSave?: (value: EditValue) => void }) {
  return <div className={sub}><p className={label}>{titulo}</p><EditableField value={value} onSave={onSave} hint="Um item por linha."><ul className="mt-2 space-y-1 text-sm text-purple-100">{value.map((s, i) => <li key={i}>• {s}</li>)}</ul></EditableField></div>;
}
