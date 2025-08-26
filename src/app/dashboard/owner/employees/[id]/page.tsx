import { getUser, getUsers, getSessions } from "@/lib/data";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Mail, Phone, PlusCircle, Users } from "lucide-react";
import { EmployeeCard } from "@/components/employee-card";
import { SessionCard } from "@/components/session-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function EmployeeOverviewPage({ params }: { params: { id: string }}) {
    const employee = await getUser(params.id);

    if(!employee || employee.role !== 'employee') {
        notFound();
    }
    
    // In a real app, you'd filter by projects this employee is a part of
    const allCoworkers = await getUsers({ role: 'employee', ownerId: employee.ownerId });
    const coworkers = allCoworkers.filter(e => e.id !== employee.id);

    const recentProjects = await getSessions({ designerId: employee.id });
    const selectedProjects = await getSessions({ designerId: employee.id, status: 'approved' });


    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <Card className="mb-8 bg-muted/20 border-0">
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="w-24 h-24 text-4xl border-4 border-background">
                         <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.id}`} />
                         <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow text-center md:text-left">
                        <h1 className="text-3xl font-bold font-headline">{employee.name}</h1>
                        <p className="text-lg text-muted-foreground">Interior Designer</p>
                         <div className="flex gap-4 mt-2 justify-center md:justify-start">
                            <span className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4"/> {employee.email}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                            <p className="text-muted-foreground mt-2 mb-6">{employee.name} has not been assigned to any projects yet.</p>
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
                            <p className="text-muted-foreground">No projects by {employee.name} have been approved yet.</p>
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold font-headline flex items-center"><Users className="mr-3 h-6 w-6 text-primary"/>Coworkers</h2>
                    </div>
                    {coworkers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {coworkers.map(coworker => (
                                <EmployeeCard key={coworker.id} employee={coworker} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">There are no other employees to display.</p>
                        </div>
                    )}
                </section>
            </div>

        </div>
    )

}
