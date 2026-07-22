type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
};

export default function PrimaryButton({
  children,
  onClick,
  href,
  className = "",
}: PrimaryButtonProps) {
  if (href) {
    return (
      <a
        href={href}
        className={`
          inline-flex
          items-center
          justify-center
          rounded-full
          px-8
          py-4
          font-semibold
          text-black
          bg-[#D4AF37]
          hover:bg-[#e6c861]
          transition-all
          duration-300
          shadow-lg
          hover:scale-105
          ${className}
        `}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        px-8
        py-4
        font-semibold
        text-black
        bg-[#D4AF37]
        hover:bg-[#e6c861]
        transition-all
        duration-300
        shadow-lg
        hover:scale-105
        ${className}
      `}
    >
      {children}
    </button>
  );
}