type GlowProps = {
  className?: string;
};

export default function Glow({ className = "" }: GlowProps) {
  return (
    <div
      className={`
        absolute
        rounded-full
        bg-violet-600/20
        blur-[140px]
        ${className}
      `}
    />
  );
}