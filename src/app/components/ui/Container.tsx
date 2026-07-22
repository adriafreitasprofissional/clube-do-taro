type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`w-full max-w-7xl mx-auto px-6 lg:px-10 ${className}`}
    >
      {children}
    </div>
  );
}