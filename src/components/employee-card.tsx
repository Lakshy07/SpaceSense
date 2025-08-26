'use client';

import type { User } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";


export function EmployeeCard({ employee }: { employee: User }) {
  return (
     <Link href={`/dashboard/owner/employees`} className="block hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <Card className="h-full">
        <CardContent className="p-4 flex flex-col items-center text-center gap-4">
           <Avatar className="w-20 h-20 border-4 border-primary/20">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.id}`} />
                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{employee.name}</p>
                <p className="text-sm text-muted-foreground">{employee.email}</p>
            </div>
        </CardContent>
      </Card>
    </Link>
  );
}
