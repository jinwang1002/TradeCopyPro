import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/components/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddAccountDialog } from "@/components/add-account-dialog";
import { PerformanceChart } from "@/components/performance-chart";
import { TradesTable } from "@/components/trades-table";
import { useState } from "react";
import { RefreshCw, Plus, BarChart, CreditCard, Users, DollarSign, Landmark, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("1W");

  // Get signal accounts
  const { data: signalAccounts, isLoading: isSignalAccountsLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/signal-accounts`],
    enabled: !!user,
  });
  
  // Get trades
  const { data: trades, isLoading: isTradesLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/trades`],
    enabled: !!user,
  });

  // Get subscribers
  const { data: subscribers, isLoading: isSubscribersLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/subscribers`],
    enabled: !!user,
  });
  
  // Get provider earnings
  const { data: earnings, isLoading: isEarningsLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/earnings`],
    enabled: !!user,
  });
  
  // Get performance data
  const { data: performanceData, isLoading: isPerformanceLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/performance`],
    enabled: !!user,
  });

  // Calculate metrics
  const totalSubscribers = subscribers?.length || 0;
  const totalCopiedCapital = subscribers?.reduce((acc: number, sub: any) => acc + (sub.accountBalance || 0), 0) || 0;
  const totalEarnings = earnings?.reduce((acc: number, earn: any) => acc + (earn.amount || 0), 0) || 0;
  const totalTrades = trades?.length || 0;
  const openTrades = trades?.filter((trade: any) => trade.status === "open").length || 0;
  const winRate = signalAccounts?.reduce((acc: number, account: any) => acc + (account.winRate || 0), 0) / (signalAccounts?.length || 1);
  const overallPerformance = signalAccounts?.reduce((acc: number, account: any) => acc + (account.returnPercent || 0), 0) / (signalAccounts?.length || 1);

  return (
    <MainLayout>
      <div className="container max-w-screen-xl mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Provider Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  Active Subscribers
                </h3>
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2">{totalSubscribers}</p>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <span>From {subscribers?.length || 0} countries</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  Copied Capital
                </h3>
                <Landmark className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2">$ {totalCopiedCapital.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Average: $ {totalSubscribers ? Math.round(totalCopiedCapital / totalSubscribers).toLocaleString() : 0}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  Total Earnings
                </h3>
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2">$ {totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                This month: $ {earnings?.filter((e: any) => {
                  const date = new Date(e.createdAt);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).reduce((acc: number, earn: any) => acc + earn.amount, 0).toLocaleString() || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm">
                  Average Performance
                </h3>
                <BarChart className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold mt-2 text-green-500">+{overallPerformance.toFixed(1)}%</p>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Win Rate: {winRate.toFixed(1)}%</span>
                <span className="text-muted-foreground">{openTrades} Open</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Chart */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Performance</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant={selectedPeriod === "1W" ? "default" : "outline"} 
                  size="sm" 
                  className="h-8"
                  onClick={() => setSelectedPeriod("1W")}
                >1W</Button>
                <Button 
                  variant={selectedPeriod === "1M" ? "default" : "outline"} 
                  size="sm" 
                  className="h-8"
                  onClick={() => setSelectedPeriod("1M")}
                >1M</Button>
                <Button 
                  variant={selectedPeriod === "3M" ? "default" : "outline"} 
                  size="sm" 
                  className="h-8"
                  onClick={() => setSelectedPeriod("3M")}
                >3M</Button>
                <Button 
                  variant={selectedPeriod === "1Y" ? "default" : "outline"} 
                  size="sm" 
                  className="h-8"
                  onClick={() => setSelectedPeriod("1Y")}
                >1Y</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {isPerformanceLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <PerformanceChart 
                  data={performanceData || [
                    { date: "Apr 1", value: 0 },
                    { date: "Apr 5", value: 4.2 },
                    { date: "Apr 9", value: 3.5 },
                    { date: "Apr 13", value: 7.1 },
                    { date: "Apr 17", value: 8.9 },
                    { date: "Apr 21", value: 10.5 },
                    { date: "Apr 25", value: 12.4 }
                  ]}
                />
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Signal Accounts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">
              Signal Accounts
            </h2>
            <Button onClick={() => setIsAddAccountDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Signal Account</span>
            </Button>
          </div>
          
          {isSignalAccountsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[250px] w-full" />
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : signalAccounts?.length > 0 ? (
            <div className="space-y-4">
              {signalAccounts.map((account: any) => (
                <Card key={account.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{account.nickname}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{account.description}</p>
                        <div className="flex space-x-4 mt-2">
                          <div>
                            <span className="text-xs text-muted-foreground block">Return</span>
                            <span className="text-green-500 font-medium">+{account.returnPercent?.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">Win Rate</span>
                            <span className="font-medium">{account.winRate?.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">Subscribers</span>
                            <span className="font-medium">{subscribers?.filter((s: any) => s.signalAccountId === account.id).length || 0}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">Total Trades</span>
                            <span className="font-medium">{trades?.filter((t: any) => t.signalAccountId === account.id).length || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/signal-accounts/${account.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="mb-4 text-muted-foreground">
                  You haven't added any signal accounts yet.
                </p>
                <Button onClick={() => setIsAddAccountDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add Your First Signal Account</span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Recent Trades Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">Recent Trades</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Filter by Date
              </Button>
              <Button variant="link" className="text-primary" asChild>
                <Link href="/trades">View All</Link>
              </Button>
            </div>
          </div>
          
          {isTradesLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : trades?.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <TradesTable trades={trades.slice(0, 10)} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No trades found for your signal accounts.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <AddAccountDialog 
        open={isAddAccountDialogOpen} 
        onOpenChange={setIsAddAccountDialogOpen} 
        isProvider={true} 
      />
    </MainLayout>
  );
}