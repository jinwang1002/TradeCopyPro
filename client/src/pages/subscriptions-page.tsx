import { MainLayout } from "@/components/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { CreditCard, Calendar, Gauge, Users, Clock, CheckCircle, X, Eye, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { SubscriptionCard } from "@/components/subscription-card";

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const isProvider = user?.role === "provider";

  // Get all subscriptions
  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useQuery({
    queryKey: ["/api/subscriptions/details"],
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: number) => {
      const res = await apiRequest("PUT", `/api/subscriptions/${subscriptionId}/deactivate`, {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/details"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCancelSubscription = (subscriptionId: number) => {
    if (window.confirm("Are you sure you want to cancel this subscription?")) {
      cancelSubscriptionMutation.mutate(subscriptionId);
    }
  };

  // Filter subscriptions based on active tab
  const getFilteredSubscriptions = () => {
    if (!subscriptions) return [];
    
    if (isProvider) {
      // For providers, filter subscribers based on tab
      return subscriptions.filter((sub: any) => {
        if (activeTab === "active") return sub.subscription.isActive;
        if (activeTab === "trial") return sub.subscription.isActive && !sub.subscription.isPaid;
        return !sub.subscription.isActive;
      });
    } else {
      // For subscribers, filter subscriptions based on tab
      return subscriptions.filter((sub: any) => {
        if (activeTab === "active") return sub.subscription.isActive && sub.subscription.isPaid;
        if (activeTab === "trial") return sub.subscription.isActive && !sub.subscription.isPaid;
        return !sub.subscription.isActive;
      });
    }
  };

  const filteredSubscriptions = getFilteredSubscriptions();

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-semibold">
              {isProvider ? "My Subscribers" : "My Subscriptions"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isProvider
                ? "Manage your subscribers and view subscription status"
                : "Manage your subscriptions to signal providers"}
            </p>
          </div>
          {!isProvider && (
            <Link href="/providers">
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Browse Signal Providers</span>
              </Button>
            </Link>
          )}
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="active">
              <CheckCircle className="h-4 w-4 mr-2" />
              Active
            </TabsTrigger>
            <TabsTrigger value="trial">
              <Clock className="h-4 w-4 mr-2" />
              Trial
            </TabsTrigger>
            <TabsTrigger value="expired">
              <X className="h-4 w-4 mr-2" />
              Expired
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {isSubscriptionsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[150px] w-full" />
                <Skeleton className="h-[150px] w-full" />
              </div>
            ) : filteredSubscriptions.length > 0 ? (
              <div className="space-y-4">
                {filteredSubscriptions.map((subscription: any) => (
                  <SubscriptionCard 
                    key={subscription.subscription.id}
                    subscription={subscription}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-muted-foreground">
                    You don't have any active subscriptions.
                  </p>
                  {!isProvider && (
                    <Link href="/providers">
                      <Button>Browse Signal Providers</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trial">
            {isSubscriptionsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[150px] w-full" />
                <Skeleton className="h-[150px] w-full" />
              </div>
            ) : filteredSubscriptions.length > 0 ? (
              <div className="space-y-4">
                {filteredSubscriptions.map((subscription: any) => (
                  <SubscriptionCard 
                    key={subscription.subscription.id}
                    subscription={subscription}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-muted-foreground">
                    You don't have any trial subscriptions.
                  </p>
                  {!isProvider && (
                    <Link href="/providers">
                      <Button>Browse Signal Providers</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="expired">
            {isSubscriptionsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[150px] w-full" />
                <Skeleton className="h-[150px] w-full" />
              </div>
            ) : filteredSubscriptions.length > 0 ? (
              <div className="space-y-4">
                {filteredSubscriptions.map((subscription: any) => (
                  <SubscriptionCard 
                    key={subscription.subscription.id}
                    subscription={subscription}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-muted-foreground">
                    You don't have any expired subscriptions.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {isProvider && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription Statistics</CardTitle>
              <CardDescription>Overview of your subscriber base and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-4 bg-background border rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total Subscribers</p>
                    <p className="text-2xl font-semibold">
                      {isSubscriptionsLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        subscriptions?.filter((sub: any) => sub.subscription.isActive).length || 0
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-background border rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">New This Month</p>
                    <p className="text-2xl font-semibold">
                      {isSubscriptionsLoading ? <Skeleton className="h-8 w-16" /> : "5"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-background border rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                    <Gauge className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Retention Rate</p>
                    <p className="text-2xl font-semibold">
                      {isSubscriptionsLoading ? <Skeleton className="h-8 w-16" /> : "93%"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}