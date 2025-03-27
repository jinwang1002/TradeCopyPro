import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/components/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceChart } from "@/components/performance-chart";
import { TradeAccountCard } from "@/components/trade-account-card";
import { SignalProviderCard } from "@/components/signal-provider-card";
import { CommentSection } from "@/components/comment-section";
import { AddAccountDialog } from "@/components/add-account-dialog";
import { useState } from "react";
import { ArrowUp, ArrowDown, Plus, CreditCard, RefreshCw, BarChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const isProvider = user?.role === "provider";

  // Fetch trade or signal accounts based on user role
  const { data: accounts, isLoading: isAccountsLoading } = useQuery({
    queryKey: [isProvider ? "/api/users/" + user?.id + "/signal-accounts" : "/api/trade-accounts"],
  });

  // Fetch top performing signal accounts
  const { data: topProviders, isLoading: isTopProvidersLoading } = useQuery({
    queryKey: ["/api/signal-accounts/top?limit=3"],
  });

  // Fetch subscriptions for subscriber view
  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useQuery({
    queryKey: ["/api/subscriptions"],
    enabled: !isProvider,
  });

  // Provider page data
  const { data: earnings, isLoading: isEarningsLoading } = useQuery({
    queryKey: ["/api/provider/earnings"],
    enabled: isProvider,
  });

  // Summary stats
  let activeSubs = 0;
  let trialSubs = 0;
  let openTrades = 0;
  let performance = 0;

  if (!isProvider && subscriptions) {
    // Calculate subscriber stats
    subscriptions.forEach((sub: any) => {
      if (sub.subscription.isActive) {
        if (sub.subscription.isPaid) {
          activeSubs++;
        } else {
          trialSubs++;
        }
      }
      
      // This is simplified - in a real app we'd need to get actual open trades
      // for each subscription
      openTrades += 2; // Assuming an average of 2 open trades per subscription
    });
    
    // This is also simplified - would be calculated from actual performance data
    performance = 12.4;
  } else if (isProvider && earnings) {
    // Provider stats
    activeSubs = earnings.accounts.reduce((total: number, account: any) => {
      return total + (account.subscriptionTotal / 10); // $10 per subscriber per month
    }, 0);
    
    performance = accounts ? accounts.reduce((avg: number, account: any) => {
      return avg + account.returnPercent;
    }, 0) / accounts.length : 0;
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-heading font-semibold">
            {isProvider ? "Signal Provider Dashboard" : "Subscriber Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isProvider 
              ? "Manage your signal accounts and monitor performance" 
              : "Manage your trade accounts and subscriptions"}
          </p>
        </header>
        
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  {isProvider ? "Active Subscribers" : "Active Subscriptions"}
                </h3>
                <RefreshCw className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2">{activeSubs}</p>
              {!isProvider && (
                <div className="text-xs text-green-500 mt-1 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span>+1 this month</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  {isProvider ? "Signal Accounts" : "Trade Accounts"}
                </h3>
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2">{accounts?.length || 0}</p>
              {!isProvider && accounts?.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {accounts.map((acc: any) => acc.brokerName).join(", ")}
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  {isProvider ? "Total Trades" : "Active Trades"}
                </h3>
                <BarChart className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2">{openTrades}</p>
              {!isProvider && (
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-3 w-3" /> 5 Buy
                  </span>
                  <span className="text-red-500 flex items-center">
                    <ArrowDown className="mr-1 h-3 w-3" /> 2 Sell
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  {isProvider ? "Average Performance" : "Overall Performance"}
                </h3>
                <BarChart className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2 text-green-500">+{performance.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Chart */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Portfolio Performance</CardTitle>
              <div className="flex space-x-2">
                <Button variant="default" size="sm" className="h-8">1W</Button>
                <Button variant="outline" size="sm" className="h-8">1M</Button>
                <Button variant="outline" size="sm" className="h-8">3M</Button>
                <Button variant="outline" size="sm" className="h-8">1Y</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <PerformanceChart 
                data={[
                  { date: "Apr 1", value: 0 },
                  { date: "Apr 5", value: 4.2 },
                  { date: "Apr 9", value: 3.5 },
                  { date: "Apr 13", value: 7.1 },
                  { date: "Apr 17", value: 8.9 },
                  { date: "Apr 21", value: 10.5 },
                  { date: "Apr 25", value: 12.4 }
                ]}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Accounts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">
              {isProvider ? "Your Signal Accounts" : "Trade Accounts"}
            </h2>
            <Button onClick={() => setIsAddAccountDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Account</span>
            </Button>
          </div>
          
          {isAccountsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[250px] w-full" />
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : accounts?.length > 0 ? (
            <div className="space-y-4">
              {accounts.map((account: any) => (
                <TradeAccountCard 
                  key={account.id} 
                  account={account} 
                  isProvider={isProvider} 
                  subscriptions={subscriptions}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="mb-4 text-muted-foreground">
                  You haven't added any {isProvider ? "signal" : "trade"} accounts yet.
                </p>
                <Button onClick={() => setIsAddAccountDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add Your First Account</span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Top Performers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">Top Performers</h2>
            <Link href="/providers">
              <Button variant="link" className="text-primary">View All Providers</Button>
            </Link>
          </div>
          
          {isTopProvidersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topProviders?.map((provider: any, index: number) => (
                <SignalProviderCard 
                  key={provider.id} 
                  provider={provider} 
                  rank={index + 1} 
                  hasTradeAccounts={accounts?.length > 0}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Community Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">Community</h2>
          </div>
          
          <CommentSection isGeneral={true} />
        </div>
      </div>
      
      <AddAccountDialog 
        open={isAddAccountDialogOpen} 
        onOpenChange={setIsAddAccountDialogOpen} 
        isProvider={isProvider} 
      />
    </MainLayout>
  );
}
