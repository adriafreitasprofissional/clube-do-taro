import TerapiaAdminShell from "./components/TerapiaAdminShell";

export default function TerapiaAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TerapiaAdminShell>
      {children}
    </TerapiaAdminShell>
  );
}
