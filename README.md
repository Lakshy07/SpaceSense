"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase"; // Adjust import if needed
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminPanel() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "subscriptions"))
      .then(snapshot => {
        setSubscriptions(
          snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        );
      });
  }, []);

  const handleStatusChange = async (id, nextStatus) => {
    await updateDoc(doc(db, "subscriptions", id), { status: nextStatus });
    setSubscriptions(
      subscriptions.map(sub => sub.id === id ? { ...sub, status: nextStatus } : sub)
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Admin - Subscriptions</h2>
      <table className="min-w-full border">
        <thead>
          <tr><th>User</th><th>Status</th><th>Plan</th><th>Change</th></tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.username}</td>
              <td>{sub.status}</td>
              <td>{sub.plan}</td>
              <td>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() =>
                    handleStatusChange(sub.id, sub.status === "active" ? "inactive" : "active")
                  }
                >
                  Set {sub.status === "active" ? "Inactive" : "Active"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
