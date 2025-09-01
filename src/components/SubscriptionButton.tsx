"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubscriptionButton({ user }: { user: { email: string }}) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
      });
      if (!res.ok) {
        throw new Error('Failed to create checkout session');
      }
      const { id } = await res.json();
      window.location.href = `https://checkout.stripe.com/pay/${id}`;
    } catch (error) {
      console.error(error);
      setLoading(false);
      // Optionally, show an error toast to the user
    }
  };

  return (
    <Button
      onClick={handlePay}
      disabled={loading}
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        "Pay ₹25,000/mo & Subscribe"
      )}
    </Button>
  );
}
