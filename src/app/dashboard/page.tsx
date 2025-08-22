import { getSessions } from "@/lib/data";
import { SessionCard } from "@/components/session-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const sessions = await getSessions();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Your Design Sessions</h1>
      </div>
      
      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No Sessions Found</h2>
          <p className="text-muted-foreground mt-2 mb-6">Start by creating your first design session.</p>
          <Button asChild>
            <Link href="/dashboard/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Session
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
