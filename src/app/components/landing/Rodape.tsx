"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

export default function Rodape() {
  return (
    <footer className="bg-[#08030F] border-t border-yellow-500/10">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-3 gap-12">

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Clube do Tarô
            </h3>

            <p className="text-gray-400 leading-7">
              Um espaço exclusivo para mulheres que desejam viver com mais
              clareza, direcionamento e evolução espiritual.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">
              Navegação
            </h4>

            <div className="flex flex-col gap-3 text-gray-400">
              <Link href="#beneficios" className="hover:text-yellow-400 transition">
                Benefícios
              </Link>

              <Link href="#planos" className="hover:text-yellow-400 transition">
                Planos
              </Link>

              <Link href="#faq" className="hover:text-yellow-400 transition">
                FAQ
              </Link>
            
            </div>
          
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">
              Contato
            </h4>

            <div className="space-y-4">

              <a
  href="mailto:adriafreitasprofissional@gmail.com"
  className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition"
>
  <Mail size={18} />
  adriafreitasprofissional@gmail.com
</a>

<a
  href="https://instagram.com/adriafreitasmentora"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition"
>
  @adriafreitasmentora
</a>

            </div>
          </div>

        </div>

        <div className="border-t border-yellow-500/10 mt-14 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Clube do Tarô • Todos os direitos reservados.
        </div>

      </div>
    </footer>
  );
}