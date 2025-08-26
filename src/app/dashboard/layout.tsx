// This layout is now a placeholder and role-specific layouts are used.
// We keep it to avoid breaking Next.js routing structure.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
