export default function MapEngineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0F0B1E] text-white">
      {children}
    </main>
  );
}