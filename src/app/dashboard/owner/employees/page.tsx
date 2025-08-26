import { getUsers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Trash2 } from "lucide-react";

export default async function EmployeesPage() {
    // In a real app, you'd get the ownerId from the logged-in user's session
    const ownerId = 'owner-1';
    const employees = await getUsers({ role: 'employee', ownerId });

    return (
        <div className="container py-8">
             <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-headline">Manage Employees</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Employee
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Employee List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {employees.map(employee => (
                            <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.id}`} />
                                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{employee.name}</p>
                                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                                    </div>
                                </div>
                                <Button variant="destructive" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete Employee</span>
                                </Button>
                            </div>
                        ))}

                        {employees.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">You haven't added any employees yet.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
