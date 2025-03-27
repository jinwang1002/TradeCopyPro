import { MainLayout } from "@/components/main-layout";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TradesTable } from "@/components/trades-table";
import { SubscriptionCard } from "@/components/subscription-card";
import { ArrowLeft, Settings, CreditCard, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { PerformanceChart } from "@/components/performance-chart";

export default function TradeAccountPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("1W");

  // Fetch trade account details
  const { data: tradeAccount, isLoading: isAccountLoading } = useQuery({
    queryKey: [`/api/trade-accounts/${id}`],
    enabled: !!id,
  });

  // Fetch subscriptions for this trade account
  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useQuery({
    queryKey: [`/api/trade-accounts/${id}/subscriptions`],
    enabled: !!id,
  });

  // Fetch open trades for this trade account
  const { data: openTrades, isLoading: isTradesLoading } = useQuery({
    queryKey: [`/api/trade-accounts/${id}/open-copy-trades`],
    enabled: !!id,
  });

  // Fetch trade history for this trade account
  const { data: tradeHistory, isLoading: isHistoryLoading } = useQuery({
    queryKey: [`/api/trade-accounts/${id}/copy-trades`],
    enabled: !!id,
  });

  // Fake performance data based on timeframe
  const getPerformanceData = () => {
    if (timeframe === "1W") {
      return [
        { date: "Mon", value: 0 },
        { date: "Tue", value: 1.2 },
        { date: "Wed", value: 2.5 },
        { date: "Thu", value: 1.8 },
        { date: "Fri", value: 3.5 },
        { date: "Sat", value: 4.2 },
        { date: "Sun", value: 3.8 },
      ];
    } else if (timeframe === "1M") {
      return [
        { date: "Week 1", value: 0 },
        { date: "Week 2", value: 3.5 },
        { date: "Week 3", value: 7.2 },
        { date: "Week 4", value: 9.8 },
      ];
    } else if (timeframe === "3M") {
      return [
        { date: "Jan", value: 0 },
        { date: "Feb", value: 5.8 },
        { date: "Mar", value: 12.4 },
      ];
    } else {
      return [
        { date: "Q1", value: 0 },
        { date: "Q2", value: 8.5 },
        { date: "Q3", value: 15.2 },
        { date: "Q4", value: 22.7 },
      ];
    }
  };

  if (isAccountLoading) {
    return (
      <MainLayout>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <Skeleton className="h-[500px] w-full mb-6" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!tradeAccount) {
    return (
      <MainLayout>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-lg font-medium mb-2">Trade account not found</p>
              <p className="text-muted-foreground mb-4">
                The trade account you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/dashboard">
                <Button>Back to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Back link */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        {/* Account Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <Wallet className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">{tradeAccount.brokerName} Account</h1>
                  <p className="text-muted-foreground">ID: {tradeAccount.accountId}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
                <Button variant="default">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Subscriptions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Chart */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Account Performance</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant={timeframe === "1W" ? "default" : "outline"} 
                  size="sm" 
                  className="h-8"
                  onClick={() => setTimeframe("1W")}
                >
                  1W
                </Button>
                <Button 
                  variant={timeframe === "1M" ? "default" : "outline"} 
                  size="sm" 
                  className="h-8"
                  onClick={() => setTimeframe("1M")}
                >
                  1M
                </Button>
                <Button 
                  variant={timeframe === "3M" ? "default" : "outline"} 
                  size="sm" 
                  className="h-8"
                  onClick={() => setTimeframe("3M")}
                >
                  3M
                </Button>
                <Button 
                  variant={timeframe === "1Y" ? "default" : "outline"} 
                  size="sm" 
                  className="h-8"
                  onClick={() => setTimeframe("1Y")}
                >
                  1Y
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <PerformanceChart data={getPerformanceData()} />
            </div>
          </CardContent>
        </Card>
        
        {/* Subscriptions */}
        <div className="mb-6">
          <h2 className="text-xl font-heading font-semibold mb-4">Copying From</h2>
          
          {isSubscriptionsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : subscriptions?.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((subscription: any) => (
                <SubscriptionCard key={subscription.id} subscription={subscription} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="mb-4 text-muted-foreground">
                  You haven't subscribed to any signal providers yet.
                </p>
                <Link href="/providers">
                  <Button>
                    Browse Signal Providers
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Trades */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Open Trades</CardTitle>
              <Badge variant="outline" className="ml-2">
                {isTradesLoading ? "Loading..." : openTrades?.length || 0} trades
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isTradesLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : openTrades?.length > 0 ? (
              <TradesTable trades={openTrades} />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No open trades at the moment
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Trade History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Trade History</CardTitle>
              <Badge variant="outline" className="ml-2">
                {isHistoryLoading ? "Loading..." : tradeHistory?.length || 0} trades
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : tradeHistory?.length > 0 ? (
              <TradesTable trades={tradeHistory} />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No trade history available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
