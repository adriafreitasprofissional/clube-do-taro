type BadgeProps = {
  children: React.ReactNode;
};

export default function Badge({ children }: BadgeProps) {
  return (
    <span
      className="
        inline-flex
        items-center
        rounded-full
        border
        border-yellow-500/30
        bg-yellow-500/10
        px-4
        py-2
        text-xs
        uppercase
        tracking-[0.30em]
        font-semibold
        text-yellow-400
      "
    >
      {children}
    </span>
  );
}