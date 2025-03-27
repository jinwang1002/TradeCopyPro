import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ subscriptionId }: { subscriptionId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success/${subscriptionId}`,
        },
      });
  
      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
      } 
      // If no error, the page will redirect to the return_url
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!stripe || isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? "Processing..." : "Pay $30.00"}
        </Button>
      </div>
    </form>
  );
};

export default function CheckoutPage() {
  const { subscriptionId = "" } = useParams();
  const [clientSecret, setClientSecret] = useState("");
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!subscriptionId) {
      setErrorMessage("No subscription ID provided");
      setIsLoading(false);
      return;
    }

    // First fetch subscription details
    apiRequest("GET", `/api/subscriptions/${subscriptionId}`)
      .then(res => {
        if (!res.ok) throw new Error("Subscription not found");
        return res.json();
      })
      .then(data => {
        setSubscription(data);
        // Then create payment intent
        return apiRequest("POST", "/api/create-subscription-payment", { subscriptionId })
          .then(res => {
            if (!res.ok) throw new Error("Failed to create payment");
            return res.json();
          });
      })
      .then(data => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch(error => {
        setErrorMessage(error.message);
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
          <div className="mb-6">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Loading Payment...</CardTitle>
              <CardDescription>Preparing your payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (errorMessage) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 max-w-3xl">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Payment Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{errorMessage}</p>
              <div className="mt-6">
                <Link href="/dashboard">
                  <Button>Return to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Subscription</CardTitle>
            <CardDescription>
              You're subscribing to {subscription?.signalAccount?.nickname}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p>Monthly Subscription</p>
                <p className="font-medium">$30.00</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Your subscription will renew automatically each month</p>
                <p>You can cancel anytime from your dashboard</p>
              </div>
            </div>

            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm subscriptionId={subscriptionId} />
              </Elements>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}