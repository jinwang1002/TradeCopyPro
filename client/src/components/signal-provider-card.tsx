import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { LineChart } from "lucide-react";
import { SubscribeDialog } from "./subscribe-dialog";
import { PerformanceDialog } from "./performance-dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface SignalProviderCardProps {
  provider: {
    id: number;
    nickname: string;
    description: string;
    returnPercent: number;
    winRate: number;
    maxDrawdown: number;
    userId: number;
  };
  rank?: number;
  hasTradeAccounts?: boolean;
}

export function SignalProviderCard({ provider, rank, hasTradeAccounts = false }: SignalProviderCardProps) {
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false);
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);

  // Fetch provider details
  const { data: providerDetails } = useQuery({
    queryKey: [`/api/users/${provider.userId}`],
    enabled: !!provider.userId,
  });

  // Fetch trade accounts
  const { data: tradeAccounts } = useQuery({
    queryKey: ["/api/trade-accounts"],
    enabled: hasTradeAccounts,
  });

  // Fetch performance history
  const { data: performanceHistory } = useQuery({
    queryKey: [`/api/signal-accounts/${provider.id}/performance`],
    enabled: !!provider.id,
  });

  // Get provider initials for the avatar
  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || 'SP';
  };

  // Check if user is a provider (will hide Subscribe button)
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });
  const isProvider = userData && (userData as any)?.role === 'provider';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            {providerDetails ? getInitials((providerDetails as any)?.displayName || '') : 'SP'}
          </div>
          <div className="ml-3">
            <h3 className="font-medium">{(providerDetails as any)?.displayName || 'Signal Provider'}</h3>
            <p className="text-xs text-muted-foreground">Signal Provider</p>
          </div>
          {rank && (
            <div className="ml-auto">
              <Badge variant="outline" className="bg-purple-500/20 text-purple-500 border-purple-500/50">
                Top {rank}
              </Badge>
            </div>
          )}
        </div>
        
        <h4 className="text-sm font-medium mb-1">{provider.nickname}</h4>
        <p className="text-xs text-muted-foreground mb-3">{provider.description}</p>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-accent rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">Return</p>
            <p className="text-green-500 font-medium">+{provider.returnPercent}%</p>
          </div>
          <div className="bg-accent rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="font-medium">{provider.winRate}%</p>
          </div>
          <div className="bg-accent rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">Drawdown</p>
            <p className="text-red-500 font-medium">{provider.maxDrawdown}%</p>
          </div>
        </div>
        
        <div className={`flex items-center ${isProvider ? 'justify-around' : 'justify-between'}`}>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setIsPerformanceDialogOpen(true)}
          >
            <LineChart className="mr-1 h-4 w-4" />
            Performance
          </Button>
          
          <Link href={`/providers/${provider.id}`}>
            <Button variant="outline" size="sm">
              View More
            </Button>
          </Link>
          
          {!isProvider && (
            <Button 
              size="sm"
              onClick={() => setIsSubscribeDialogOpen(true)}
              disabled={!hasTradeAccounts}
            >
              Subscribe
            </Button>
          )}
        </div>
      </CardContent>
      
      {/* Performance Dialog */}
      {performanceHistory && Array.isArray(performanceHistory) && (
        <PerformanceDialog
          signalAccount={provider}
          performanceData={performanceHistory}
          open={isPerformanceDialogOpen}
          onOpenChange={setIsPerformanceDialogOpen}
        />
      )}
      
      {/* Subscribe Dialog */}
      <SubscribeDialog
        signalAccount={provider}
        tradeAccounts={(tradeAccounts && Array.isArray(tradeAccounts)) ? tradeAccounts : []}
        open={isSubscribeDialogOpen}
        onOpenChange={setIsSubscribeDialogOpen}
      />
    </Card>
  );
}
