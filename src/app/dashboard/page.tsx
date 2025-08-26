import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // This page is now a router. It redirects to the correct dashboard.
  // In a real app, you would get the user's role from the session.
  // For now, we'll assume a default role or redirect to login.
  
  // Defaulting to owner for now if someone lands here directly.
  const userRole = 'owner';

  if (userRole === 'owner') {
    redirect('/dashboard/owner');
  } else {
    redirect('/dashboard/employee');
  }

  return (
    <div className="flex h-screen items-center justify-center">
        <p>Redirecting...</p>
    </div>
  )
}
