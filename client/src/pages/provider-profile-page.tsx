import { MainLayout } from "@/components/main-layout";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PerformanceDialog } from "@/components/performance-dialog";
import { SubscribeDialog } from "@/components/subscribe-dialog";
import { CommentSection } from "@/components/comment-section";
import { ArrowLeft, User, LineChart, TrendingUp, BarChart2, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ProviderProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const isProvider = user?.role === "provider";
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false);
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);

  // Fetch signal account details
  const { data: signalAccount, isLoading } = useQuery({
    queryKey: [`/api/signal-accounts/${id}`],
  });

  // Fetch provider details
  const { data: providerDetails, isLoading: isProviderLoading } = useQuery({
    queryKey: [`/api/users/${signalAccount?.userId}`],
    enabled: !!signalAccount?.userId,
  });

  // Fetch user's trade accounts if they're a subscriber
  const { data: tradeAccounts } = useQuery({
    queryKey: ["/api/trade-accounts"],
    enabled: !isProvider,
  });

  // Fetch performance history
  const { data: performanceHistory } = useQuery({
    queryKey: [`/api/signal-accounts/${id}/performance`],
    enabled: !!id,
  });

  if (isLoading || isProviderLoading) {
    return (
      <MainLayout>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <Skeleton className="h-[500px] w-full mb-6" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!signalAccount) {
    return (
      <MainLayout>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-lg font-medium mb-2">Signal account not found</p>
              <p className="text-muted-foreground mb-4">
                The signal account you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/providers">
                <Button>Back to Providers</Button>
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
        <Link href="/providers">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Providers
          </Button>
        </Link>
        
        {/* Provider header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-medium">
                  {providerDetails?.displayName.substring(0, 2).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">{signalAccount.nickname}</h1>
                  <p className="text-muted-foreground flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    by {providerDetails?.displayName}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsPerformanceDialogOpen(true)}
                >
                  <LineChart className="mr-2 h-4 w-4" />
                  Performance Details
                </Button>
                
                {!isProvider && (
                  <Button
                    onClick={() => setIsSubscribeDialogOpen(true)}
                    disabled={!tradeAccounts || tradeAccounts.length === 0}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Subscribe
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-muted-foreground text-sm mb-4">
                {signalAccount.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">Return</p>
                    <p className="text-green-500 font-medium text-xl">+{signalAccount.returnPercent}%</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="font-medium text-xl">{signalAccount.winRate}%</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">Total Trades</p>
                    <p className="font-medium text-xl">{signalAccount.totalTrades}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">Max Drawdown</p>
                    <p className="text-red-500 font-medium text-xl">{signalAccount.maxDrawdown}%</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Performance History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {performanceHistory ? (
                <PerformanceDialog
                  signalAccount={signalAccount}
                  performanceData={performanceHistory}
                  isEmbedded={true}
                />
              ) : (
                <Skeleton className="h-full w-full" />
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Subscription Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChevronDown className="mr-2 h-5 w-5" />
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Subscription Fee</p>
                <p className="font-medium">$30/month (7-day free trial)</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Trading Since</p>
                <p className="font-medium">
                  {new Date(signalAccount.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Timeframe</p>
                <p className="font-medium">All timeframes</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Trading Style</p>
                <p className="font-medium">Swing & Day Trading</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <CommentSection signalAccountId={parseInt(id as string)} isGeneral={false} />
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Dialog */}
      {performanceHistory && (
        <PerformanceDialog
          signalAccount={signalAccount}
          performanceData={performanceHistory}
          open={isPerformanceDialogOpen}
          onOpenChange={setIsPerformanceDialogOpen}
        />
      )}
      
      {/* Subscribe Dialog */}
      {!isProvider && (
        <SubscribeDialog
          signalAccount={signalAccount}
          tradeAccounts={tradeAccounts || []}
          open={isSubscribeDialogOpen}
          onOpenChange={setIsSubscribeDialogOpen}
        />
      )}
    </MainLayout>
  );
}
