"use client";
import { useState } from "react";
import { auth } from "@/firebase";
import { updateProfile, updatePassword, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Note: In a real app, you'd get the user from a context or auth state listener.
  // auth.currentUser can be null on initial load.
  const user = auth.currentUser;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ variant: "destructive", title: "Error", description: "You must be logged in to update your profile." });
        return;
    }
    setLoading(true);
    try {
        if (username) {
            await updateProfile(user, { displayName: username });
        }
        if (password) {
            await updatePassword(user, password);
        }
        setUsername("");
        setPassword("");
        toast({ title: "Success", description: "Your profile has been updated." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container max-w-xl py-12">
        <Card>
            <CardHeader>
                <CardTitle>Update Your Profile</CardTitle>
                <CardDescription>Set a new username or password. Leave fields blank to keep them unchanged.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Set new username"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Set new password"
                        />
                    </div>
                    <Button type="submit" disabled={loading || (!username && !password)}>
                        {loading ? "Updating..." : "Update Profile"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
