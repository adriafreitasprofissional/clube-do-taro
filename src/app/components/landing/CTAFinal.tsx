"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function CTAFinal() {
  return (
    <section className="py-28 px-6 bg-gradient-to-b from-[#12061E] to-[#09030F]">
      <div className="max-w-5xl mx-auto">

        <div className="rounded-[32px] border border-yellow-500/20 bg-[#1A0D2B] p-12 md:p-16 text-center shadow-2xl">

          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            O próximo direcionamento pode mudar a forma como você enxerga sua vida.
          </h2>

          <p className="mt-8 text-lg text-gray-300 leading-8 max-w-3xl mx-auto">
            Faça parte de uma comunidade exclusiva de mulheres que buscam
            clareza, evolução e direcionamento através do Tarô com
            responsabilidade, acolhimento e espiritualidade.
          </p>

          <Link
            href="#planos"
            className="inline-flex items-center mt-12 bg-yellow-400 hover:bg-yellow-300 text-[#2B1245] font-bold px-10 py-5 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Quero fazer parte do Clube
          </Link>

          <p className="mt-8 text-sm text-gray-400">
            Acesso imediato após a confirmação da assinatura.
          </p>

        </div>

      </div>
    </section>
  );
}