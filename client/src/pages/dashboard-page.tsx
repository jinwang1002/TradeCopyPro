import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/components/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TradeAccountCard } from "@/components/trade-account-card";
import { SignalProviderCard } from "@/components/signal-provider-card";
import { CommentSection } from "@/components/comment-section";
import { AddAccountDialog } from "@/components/add-account-dialog";
import { useState } from "react";
import { Plus, CreditCard, RefreshCw, BarChart, Activity, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);

  // Fetch trade accounts
  const { data: accounts, isLoading: isAccountsLoading } = useQuery({
    queryKey: ["/api/trade-accounts"],
  });

  // Fetch top performing signal accounts
  const { data: topProviders, isLoading: isTopProvidersLoading } = useQuery({
    queryKey: ["/api/signal-accounts/top?limit=3"],
  });

  // Fetch subscriptions
  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useQuery({
    queryKey: ["/api/subscriptions"],
  });

  // Summary stats
  let activeSubs = 0;
  let trialSubs = 0;
  let openTrades = 0;
  let performance = 0;

  if (subscriptions) {
    subscriptions.forEach((sub: any) => {
      if (sub.subscription.isActive) {
        activeSubs++;
      }
      if (sub.subscription.isActive && !sub.subscription.isPaid) {
        trialSubs++;
      }
    });
  }

  // Calculate portfolio balance
  const portfolioBalance = accounts?.reduce((total: number, account: any) => {
    return total + (account.balance || 0);
  }, 0) || 0;

  const totalAccounts = accounts?.length || 0;

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-heading font-semibold mb-4 sm:mb-0">
            Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Subscriber Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  Trade Accounts
                </h3>
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2">{totalAccounts}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Across multiple brokers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  Active Subscriptions
                </h3>
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2">{activeSubs}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {trialSubs} in trial period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  Open Positions
                </h3>
                <BarChart className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2">{openTrades}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Across all copied providers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  Portfolio Balance
                </h3>
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2">${portfolioBalance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Combined from all accounts
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Trade Accounts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">
              My Trade Accounts
            </h2>
            <Button onClick={() => setIsAddAccountDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Trade Account</span>
            </Button>
          </div>
          
          {isAccountsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : accounts && accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account: any) => (
                <TradeAccountCard 
                  key={account.id} 
                  account={account} 
                  subscriptions={
                    (subscriptions || []).filter((s: any) => s.subscription.tradeAccountId === account.id)
                  } 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="mb-4 text-muted-foreground">
                  You haven't added any trade accounts yet.
                </p>
                <Button onClick={() => setIsAddAccountDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add Your First Trade Account</span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Top Providers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">
              Top Performing Providers
            </h2>
            <Button variant="link" className="text-primary" asChild>
              <Link href="/providers">View All Providers</Link>
            </Button>
          </div>
          
          {isTopProvidersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">
              Community Discussion
            </h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <CommentSection isGeneral={true} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AddAccountDialog 
        open={isAddAccountDialogOpen} 
        onOpenChange={setIsAddAccountDialogOpen} 
        isProvider={false} 
      />
    </MainLayout>
  );
}