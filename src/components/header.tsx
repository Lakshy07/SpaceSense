// This component is no longer used directly. 
// It has been replaced by role-specific headers in:
// - src/app/dashboard/owner/layout.tsx
// - src/app/dashboard/employee/layout.tsx
// It is kept to avoid breaking imports in files that may not have been updated yet.

import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { LogOut, PlusCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild>
            <Link href="/dashboard/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Session
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
