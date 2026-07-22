import Hero from "../components/sections/Hero/Hero";
import Beneficios from "../components/sections/Beneficios/Beneficios";
import PlanosMensais from "../components/sections/PlanosMensais";
import PlanosAnuais from "../components/sections/PlanosAnuais";
import Depoimentos from "../components/landing/Depoimentos";
import FAQ from "../components/landing/FAQ";
import CTAFinal from "../components/landing/CTAFinal";
import Rodape from "../components/landing/Rodape";

export default function LandingPage() {
  return (
    <main className="bg-[#0B0616] text-white overflow-hidden">
      <Hero />
      <Beneficios />
      <PlanosMensais />
      <PlanosAnuais />
      <Depoimentos />
      <FAQ />
      <CTAFinal />
      <Rodape />
    </main>
  );
}