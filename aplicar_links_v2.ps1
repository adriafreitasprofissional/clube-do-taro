$ErrorActionPreference = "Stop"

$root = "C:\Users\MICRO\clube-do-taro"

# =========================
# 1) PORTAL DA ASSINANTE
# =========================
$portal = Join-Path $root "src\app\cliente\[slug]\page.tsx"
$texto = Get-Content -LiteralPath $portal -Raw -Encoding UTF8

# Remove a constante antiga do Lovable, se existir
$texto = [regex]::Replace(
  $texto,
  '(?ms)\r?\nconst LINK_MENTORIA\s*=\s*\r?\n\s*"https://mystic-lunar-flow\.lovable\.app/";\r?\n',
  "`r`n"
)

# Troca apenas o card "Agendamento de Mentoria"
$padraoCard = '(?ms)\{ehDiamante\s*&&\s*\(\s*<a\s+href=\{LINK_MENTORIA\}\s+target="_blank"\s+rel="noreferrer"\s+className="([^"]*)"\s*>\s*<p className="text-3xl">🗓️</p>\s*<h3 className="mt-4 text-xl font-extrabold text-yellow-300">\s*Agendamento de Mentoria\s*</h3>\s*<p className="mt-3 text-sm leading-6 text-purple-50">\s*Escolha o melhor horário para sua mentoria exclusiva\.\s*</p>\s*<p className="mt-5 text-sm font-bold text-yellow-200">\s*Agendar mentoria →\s*</p>\s*</a>\s*\)\}'

$novoCard = @'
{ehDiamante && (
  <Link
    href={`/cliente/${slug}/agenda-mentoria`}
    className="$1"
  >
    <p className="text-3xl">🗓️</p>

    <h3 className="mt-4 text-xl font-extrabold text-yellow-300">
      Agendamento de Mentoria
    </h3>

    <p className="mt-3 text-sm leading-6 text-purple-50">
      Veja os horários individuais e confirme as mentorias em grupo.
    </p>

    <p className="mt-5 text-sm font-bold text-yellow-200">
      Abrir minha agenda →
    </p>
  </Link>
)}
'@

$novoTexto = [regex]::Replace($texto, $padraoCard, $novoCard)

if ($novoTexto -eq $texto) {
  throw "Não consegui localizar o card de Agendamento de Mentoria para substituir."
}

Set-Content -LiteralPath $portal -Value $novoTexto -Encoding UTF8

# =========================
# 2) ADM DA AGENDA
# =========================
$agenda = Join-Path $root "src\app\admin\agenda\page.tsx"
$agendaTexto = Get-Content -LiteralPath $agenda -Raw -Encoding UTF8

if (-not $agendaTexto.Contains('import Link from "next/link";')) {
  $agendaTexto = $agendaTexto.Replace(
    'import { useRouter } from "next/navigation";',
    'import { useRouter } from "next/navigation";' + "`r`n" + 'import Link from "next/link";'
  )
}

# Se o botão já existir, não duplica
if (-not $agendaTexto.Contains('href="/admin/agenda/mentorias"')) {
  $padraoBotao = '(?ms)(\s*)<button\s+type="button"\s+onClick=\{\(\)\s*=>\s*setNovoAtendimentoAberto\(true\)\s*\}\s+className="rounded-xl bg-purple-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-purple-700"\s*>\s*\+ Novo atendimento\s*</button>'

  $substituicao = @'
$1<div className="flex flex-wrap gap-3">
$1  <Link
$1    href="/admin/agenda/mentorias"
$1    className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-3 text-sm font-semibold text-yellow-200 transition hover:bg-yellow-400/20"
$1  >
$1    Agenda de Mentorias
$1  </Link>

$1  <button
$1    type="button"
$1    onClick={() =>
$1      setNovoAtendimentoAberto(true)
$1    }
$1    className="rounded-xl bg-purple-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-purple-700"
$1  >
$1    + Novo atendimento
$1  </button>
$1</div>
'@

  $agendaNovo = [regex]::Replace($agendaTexto, $padraoBotao, $substituicao)

  if ($agendaNovo -eq $agendaTexto) {
    throw "O portal foi atualizado, mas não consegui localizar o botão + Novo atendimento no ADM."
  }

  $agendaTexto = $agendaNovo
}

Set-Content -LiteralPath $agenda -Value $agendaTexto -Encoding UTF8

Write-Host ""
Write-Host "Agenda oficial conectada com sucesso." -ForegroundColor Green
Write-Host "- Portal Diamante agora abre a agenda interna." -ForegroundColor Green
Write-Host "- ADM ganhou o botão Agenda de Mentorias." -ForegroundColor Green
s