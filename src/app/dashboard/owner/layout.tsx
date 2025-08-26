import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Home, LogOut, PlusCircle, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getUsers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmployeeCard } from '@/components/employee-card';


export async function Header() {
  const ownerId = 'owner-1';
  const employees = await getUsers({ role: 'employee', ownerId });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard/owner" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard/owner"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              <Home className="mr-2 h-4 w-4 inline-block" />
              Dashboard
            </Link>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Link
                  href="/dashboard/owner/employees"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center"
                >
                  <Users className="mr-2 h-4 w-4 inline-block" />
                  Employees
                </Link>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                {employees.map(employee => (
                  <DropdownMenuItem key={employee.id} asChild>
                    <Link href={`/dashboard/owner/employees`}>
                       <div className="flex items-center gap-4">
                          <Avatar>
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.id}`} />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                              <p className="font-semibold">{employee.name}</p>
                              <p className="text-xs text-muted-foreground">{employee.email}</p>
                          </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
                 {employees.length === 0 && (
                   <DropdownMenuItem disabled>No employees found.</DropdownMenuItem>
                 )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          <Button asChild>
            <Link href="/dashboard/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}


export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
