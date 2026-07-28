import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

type DadosEmail = {
  nome: string;
  email: string;
  senha: string;
};

export async function enviarBoasVindas({
  nome,
  email,
  senha,
}: DadosEmail) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Bem-vindo ao Clube do Tarô",
    html: `
      <h2>Olá, ${nome}!</h2>

      <p>Sua assinatura do <strong>Clube do Tarô</strong> foi confirmada com sucesso.</p>

      <p><strong>Seus dados de acesso:</strong></p>

      <ul>
        <li><strong>E-mail:</strong> ${email}</li>
        <li><strong>Senha:</strong> ${senha}</li>
      </ul>

      <p>Acesse:</p>

      <p>
        <a href="https://www.magiaoriente.com.br/login">
          https://www.magiaoriente.com.br/login
        </a>
      </p>

      <p>Recomendamos que você altere sua senha após o primeiro acesso.</p>

      <br>

      <p>Seja muito bem-vindo(a)!</p>

      <p><strong>Ádria Freitas</strong><br/>
      Clube do Tarô</p>
    `,
  });
}