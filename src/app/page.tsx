import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { ArrowRight, User, Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4" suppressHydrationWarning>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="font-headline text-2xl">Welcome Back, Designer</CardTitle>
          <CardDescription>
            Sign in to access your design sessions and create new ones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/dashboard/owner" passHref>
            <Button className="w-full" size="lg" variant="default">
              <Shield className="mr-2 h-4 w-4" />
              Login as Owner
            </Button>
          </Link>
          <Link href="/dashboard/employee" passHref>
            <Button className="w-full" size="lg" variant="secondary">
               <User className="mr-2 h-4 w-4" />
              Login as Employee
            </Button>
          </Link>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            For demonstration purposes, authentication is bypassed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
