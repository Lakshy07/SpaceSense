import { getSessions } from "@/lib/data";
import { SessionCard } from "@/components/session-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function EmployeeDashboardPage() {
  // In a real app, you'd get the employeeId from the logged-in user's session
  const employeeId = 'employee-1';
  const sessions = await getSessions({ designerId: employeeId });

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">My Design Projects</h1>
         <Button asChild>
            <Link href="/dashboard/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Project
            </Link>
        </Button>
      </div>
      
      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No Projects Found</h2>
          <p className="text-muted-foreground mt-2 mb-6">You have not been assigned to any projects yet.</p>
        </div>
      )}
    </div>
  );
}
