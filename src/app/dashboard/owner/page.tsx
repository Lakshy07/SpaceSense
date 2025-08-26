import { getAllSessionsForOwner, getUsers } from "@/lib/data";
import { SessionCard } from "@/components/session-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";
import { EmployeeCard } from "@/components/employee-card";

export default async function OwnerDashboardPage() {
  const ownerId = 'owner-1';
  const allSessions = await getAllSessionsForOwner(ownerId);
  const employees = await getUsers({ role: 'employee', ownerId });

  const recentProjects = allSessions.slice(0, 6);
  const selectedProjects = allSessions.filter(session => session.status === 'approved');

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Owner Dashboard</h1>
        <Button asChild>
            <Link href="/dashboard/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
            </Link>
        </Button>
      </div>

      <div className="space-y-12">
        <section>
            <h2 className="text-2xl font-semibold font-headline mb-4 flex items-center"><PlusCircle className="mr-3 h-6 w-6 text-primary"/>Recent Projects</h2>
            {recentProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentProjects.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">No Projects Found</h2>
                    <p className="text-muted-foreground mt-2 mb-6">Start by creating the first project.</p>
                    <Button asChild>
                        <Link href="/dashboard/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create New Project
                        </Link>
                    </Button>
                </div>
            )}
        </section>

        <section>
            <h2 className="text-2xl font-semibold font-headline mb-4 flex items-center"><CheckCircle2 className="mr-3 h-6 w-6 text-green-500"/>Selected Projects</h2>
            {selectedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {selectedProjects.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No projects have been approved yet.</p>
                </div>
            )}
        </section>

        <section>
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold font-headline flex items-center"><Users className="mr-3 h-6 w-6 text-primary"/>Employees</h2>
                <Button asChild variant="outline">
                    <Link href="/dashboard/owner/employees">View All</Link>
                </Button>
            </div>
             {employees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {employees.map(employee => (
                        <EmployeeCard key={employee.id} employee={employee} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">You haven't added any employees yet.</p>
                </div>
            )}
        </section>

      </div>
    </div>
  );
}
