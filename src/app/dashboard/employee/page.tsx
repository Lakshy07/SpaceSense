import { getSessions, getUsers } from "@/lib/data";
import { SessionCard } from "@/components/session-card";
import { EmployeeCard } from "@/components/employee-card";
import { Clock, CheckCircle2, XCircle, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EmployeeDashboardPage() {
  const employeeId = 'employee-1';
  const recentProjects = await getSessions({ designerId: employeeId });
  const selectedProjects = await getSessions({ designerId: employeeId, status: 'approved' });
  const rejectedProjects = await getSessions({ designerId: employeeId, status: 'rejected' });
  
  // A simple way to find coworkers is to find other designers on the same projects.
  // This is a mock implementation.
  const allCoworkers = await getUsers({ role: 'employee' });
  const coworkers = allCoworkers.filter(e => e.id !== employeeId);


  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
       <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">My Dashboard</h1>
      </div>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold font-headline mb-4 flex items-center"><Clock className="mr-3 h-6 w-6 text-primary"/>Recent Projects</h2>
            {recentProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentProjects.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">No Projects Found</h2>
                    <p className="text-muted-foreground mt-2 mb-6">You have not been assigned to any projects yet.</p>
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
                    <p className="text-muted-foreground">You have no approved projects yet.</p>
                </div>
            )}
        </section>
        
        <section>
            <h2 className="text-2xl font-semibold font-headline mb-4 flex items-center"><XCircle className="mr-3 h-6 w-6 text-red-500"/>Rejected Projects</h2>
            {rejectedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rejectedProjects.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">You have no rejected projects.</p>
                </div>
            )}
        </section>

        <section>
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold font-headline flex items-center"><Users className="mr-3 h-6 w-6 text-primary"/>My Coworkers</h2>
                <Button asChild variant="outline">
                    <Link href="/dashboard/owner/employees">View All</Link>
                </Button>
            </div>
             {coworkers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {coworkers.map(employee => (
                        <EmployeeCard key={employee.id} employee={employee} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">You have no coworkers to display.</p>
                </div>
            )}
        </section>

      </div>
    </div>
  );
}
