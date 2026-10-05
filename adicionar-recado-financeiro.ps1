$p = "src\app\admin\financeiro\page.tsx"
$t = [System.IO.File]::ReadAllText((Resolve-Path $p))

$alvo = "  function abrirEdicao(cliente: Cliente) {"

$bloco = @"
  function nomeParaRecado(cliente: Cliente) {
    return cliente.nome_referencia?.trim() || cliente.slug?.trim() || cliente.nome?.split(" ")[0] || "assinante";
  }

  function criarMensagemFinanceira(cliente: Cliente) {
    const nome = nomeParaRecado(cliente);

    if (cliente.tipo_assinatura === "cortesia") {
      const fim = parseDateLocal(cliente.cortesia_fim);

      if (fim && diffDaysFromToday(fim) < 0) {
        return `Olá, ${nome}! Sua cortesia no Clube do Tarô chegou ao fim. 💜

O que achou da experiência no Clube?

Se quiser continuar com a gente, preparei uma condição especial para você fazer parte do Clube.

https://www.magiaoriente.com.br

Vou adorar ter você por aqui!`;
      }
    }

    const vencimento = parseDateLocal(cliente.proximo_vencimento);

    if (!vencimento) {
      return `Oi, ${nome}! Passando para deixar um recadinho sobre sua assinatura do Clube do Tarô. 💜

Se precisar falar comigo sobre seu pagamento ou vencimento, estou por aqui.

Beijos, Ádria.`;
    }

    const dias = diffDaysFromToday(vencimento);
    const data = formatarData(cliente.proximo_vencimento);

    if (dias === 0) {
      return `Oi, ${nome}! Hoje é o vencimento da sua mensalidade do Clube do Tarô. 💜

Este é só um lembrete para você não perder o acesso aos seus conteúdos.

Beijos, Ádria.`;
    }

    if (dias < 0) {
      return `Oi, ${nome}! Percebi que sua mensalidade do Clube do Tarô venceu em ${data} e ainda consta como pendente. 💜

Quando puder, dê uma conferidinha para manter seu acesso normalmente.

Se já realizou o pagamento, pode desconsiderar este recadinho.

Beijos, Ádria.`;
    }

    return `Oi, ${nome}! Passando para lembrar com carinho que a mensalidade do Clube do Tarô vence no dia ${data}. 💜

Assim você mantém seu acesso e continua aproveitando tudo do Clube.

Beijos, Ádria.`;
  }

  function abrirRecadoFinanceiro(cliente: Cliente) {
    setClienteRecado(cliente);
    setTituloRecado(
      cliente.tipo_assinatura === "cortesia"
        ? "Sua cortesia no Clube do Tarô"
        : "Lembrete do Clube do Tarô"
    );
    setTextoRecado(criarMensagemFinanceira(cliente));
  }

  async function enviarRecadoFinanceiro() {
    if (!clienteRecado || !textoRecado.trim()) return;

    setEnviandoRecado(true);

    const { error } = await supabase.from("client_messages").insert({
      client_id: clienteRecado.id,
      titulo: tituloRecado.trim() || "Lembrete do Clube do Tarô",
      mensagem: textoRecado.trim(),
      tipo_destino: "cliente",
      publicado: true,
    });

    setEnviandoRecado(false);

    if (error) {
      console.error("Erro ao enviar recado financeiro:", error);
      alert("Não foi possível enviar o recado.");
      return;
    }

    alert("Recado enviado com sucesso.");
    setClienteRecado(null);
    setTextoRecado("");
  }

"@

if (-not $t.Contains($alvo)) {
    throw "Ponto de inserção não encontrado."
}

$t = $t.Replace($alvo, $bloco + $alvo)
[System.IO.File]::WriteAllText((Resolve-Path $p), $t, (New-Object System.Text.UTF8Encoding($false)))
