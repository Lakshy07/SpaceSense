import { getAllSessionsForOwner } from "@/lib/data";
import { SessionCard } from "@/components/session-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function OwnerDashboardPage() {
  // In a real app, you'd get the ownerId from the logged-in user's session
  const ownerId = 'owner-1';
  const sessions = await getAllSessionsForOwner(ownerId);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Owner Dashboard</h1>
        <Button asChild>
            <Link href="/dashboard/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
            </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold font-headline mb-4">All Projects</h2>
         {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map(session => (
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
      </div>
    </div>
  );
}
