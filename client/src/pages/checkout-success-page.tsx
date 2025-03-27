import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useLocation } from "wouter";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutSuccessPage() {
  const { subscriptionId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!subscriptionId) {
      setError("No subscription ID provided");
      setIsLoading(false);
      return;
    }

    // Mark the subscription as paid
    apiRequest("POST", `/api/subscriptions/${subscriptionId}/mark-paid`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to update subscription");
        return res.json();
      })
      .then(data => {
        setSubscription(data);
        setIsLoading(false);
        
        toast({
          title: "Payment Successful",
          description: "Your subscription has been activated"
        });
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      });
  }, [subscriptionId, toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Processing Your Payment</CardTitle>
              <CardDescription>Please wait while we confirm your payment</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Payment Error</CardTitle>
              <CardDescription>There was a problem with your payment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Link href="/dashboard">
                <Button>
                  Return to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4 max-w-3xl">
        <Card>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Your subscription to {subscription?.signalAccount?.nickname} has been activated
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6 bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Payment Details</h3>
              <div className="flex justify-between text-sm mb-2">
                <span>Subscription Plan</span>
                <span>Monthly</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Amount</span>
                <span>$30.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Next Billing Date</span>
                <span>{new Date(
                  new Date().setMonth(new Date().getMonth() + 1)
                ).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Link href={`/providers/${subscription?.signalAccount?.id}`}>
                <Button className="w-full">
                  View Signal Provider
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}