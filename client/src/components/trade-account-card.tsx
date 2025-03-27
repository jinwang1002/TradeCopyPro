import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { TradesTable } from "./trades-table";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

interface TradeAccountCardProps {
  account: {
    id: number;
    brokerName: string;
    accountId: string;
  };
  isProvider?: boolean;
  subscriptions?: any[];
}

export function TradeAccountCard({ account, isProvider = false, subscriptions }: TradeAccountCardProps) {
  // Filter subscriptions for this account if they exist
  const accountSubscriptions = subscriptions?.filter(
    (sub: any) => sub.subscription.tradeAccountId === account.id
  );

  // Get active subscriptions
  const activeSubscriptions = accountSubscriptions?.filter(
    (sub: any) => sub.subscription.isActive
  );

  // Get trial subscriptions
  const trialSubscriptions = activeSubscriptions?.filter(
    (sub: any) => !sub.subscription.isPaid
  );

  // Fetch open trades for this account
  const { data: openTrades, isLoading: isTradesLoading } = useQuery({
    queryKey: [`/api/trade-accounts/${account.id}/open-copy-trades`],
    enabled: !isProvider,
  });

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{account.brokerName} Account</h3>
                <p className="text-sm text-muted-foreground">ID: {account.accountId}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
            {!isProvider && activeSubscriptions && activeSubscriptions.length > 0 && (
              <Badge variant="secondary" className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                <span>{activeSubscriptions.length} Active Subscriptions</span>
              </Badge>
            )}
            
            {!isProvider && trialSubscriptions && trialSubscriptions.length > 0 && (
              <Badge variant="secondary" className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                <span>{trialSubscriptions.length} Trial</span>
              </Badge>
            )}
            
            <Link href={`/trade-accounts/${account.id}`}>
              <Button variant="secondary" size="sm">
                <Settings className="mr-1 h-4 w-4" />
                Manage
              </Button>
            </Link>
          </div>
        </div>
        
        {!isProvider && accountSubscriptions && accountSubscriptions.length > 0 && (
          <div className="border-t border-border px-4 py-3">
            <h4 className="text-sm text-muted-foreground mb-2">Copying From:</h4>
            <div className="space-y-3">
              {accountSubscriptions.map((sub: any) => (
                <div 
                  key={sub.subscription.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between bg-accent rounded p-3 text-sm"
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                      {sub.provider?.displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="ml-2">
                      <p className="font-medium">{sub.signalAccount?.nickname}</p>
                      <p className="text-xs text-muted-foreground">by {sub.provider?.displayName}</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0 space-x-3">
                    {sub.subscription.isPaid ? (
                      <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                        Trial
                      </Badge>
                    )}
                    <div className="text-green-500">+{sub.signalAccount?.returnPercent.toFixed(1)}%</div>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!isProvider && (
          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm text-muted-foreground">Recent Trades</h4>
              <Link href={`/trade-accounts/${account.id}`}>
                <Button variant="link" size="sm" className="text-xs text-primary h-auto p-0">
                  View All
                </Button>
              </Link>
            </div>
            
            {isTradesLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : openTrades && openTrades.length > 0 ? (
              <div className="overflow-x-auto">
                <TradesTable trades={openTrades.slice(0, 3)} />
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4 text-sm">
                No open trades at the moment
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
