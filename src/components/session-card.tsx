import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Session } from "@/lib/types";
import { ArrowRight, Calendar } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

export function SessionCard({ session }: { session: Session }) {
  return (
    <Link href={`/dashboard/sessions/${session.id}`} className="block hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <Card className="flex flex-col h-full bg-card hover:border-primary/50 transition-colors">
        <CardHeader>
          <CardTitle className="font-headline">{session.name}</CardTitle>
          <CardDescription>{session.overallTheme}</CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</span>
          </div>
          <Button variant="ghost" size="sm">
            View
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
