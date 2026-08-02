interface Props {
  title?: string;
  subtitle?: string;
}

export default function SectionTitle({
  title = "Título da Seção",
  subtitle = "Componente temporário.",
}: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-yellow-400">
        {title}
      </h2>

      <p className="mt-1 text-sm text-purple-300">
        {subtitle}
      </p>
    </div>
  );
}