import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Session } from "@/lib/types";
import { ArrowRight, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const statusInfo = {
    pending: { icon: Clock, label: "Pending", color: "bg-yellow-500" },
    approved: { icon: CheckCircle2, label: "Approved", color: "bg-green-500" },
    rejected: { icon: XCircle, label: "Rejected", color: "bg-red-500" },
}

export function SessionCard({ session }: { session: Session }) {
  const status = statusInfo[session.status] || statusInfo.pending;

  return (
    <Link href={`/dashboard/sessions/${session.id}`} className="block hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <Card className="flex flex-col h-full bg-card hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline">{session.name}</CardTitle>
             <Badge variant="secondary" className={cn("capitalize text-xs", status.color)}>
                <status.icon className="mr-1 h-3 w-3" />
                {status.label}
            </Badge>
          </div>
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
