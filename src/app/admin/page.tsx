"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, updateDoc, doc, DocumentData } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Subscription extends DocumentData {
  id: string;
  status: 'active' | 'inactive';
}

export default function AdminPanel() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "subscriptions"))
      .then(snapshot => {
        setSubscriptions(
          snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription))
        );
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (id: string, nextStatus: 'active' | 'inactive') => {
    await updateDoc(doc(db, "subscriptions", id), { status: nextStatus });
    setSubscriptions(
      subscriptions.map(sub => sub.id === id ? { ...sub, status: nextStatus } : sub)
    );
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin - Subscriptions</CardTitle>
          <CardDescription>Manage user subscriptions and their statuses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Change Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading subscriptions...</TableCell>
                </TableRow>
              ) : subscriptions.length > 0 ? (
                subscriptions.map(sub => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.username}</TableCell>
                    <TableCell>
                      <Badge variant={sub.status === "active" ? "default" : "destructive"}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{sub.plan}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(sub.id, sub.status === "active" ? "inactive" : "active")
                        }
                      >
                        Set to {sub.status === "active" ? "Inactive" : "Active"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">No subscriptions found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
