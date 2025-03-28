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
    <Card className="overflow-hidden bg-black border-gray-800 hover:border-gray-700 transition-all">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-12 w-12 rounded-full border border-gray-700 bg-gray-900 flex items-center justify-center text-sm font-medium">
            {providerDetails ? getInitials((providerDetails as any)?.displayName || '') : 'SP'}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-white">{(providerDetails as any)?.displayName || 'Signal Provider'}</h3>
            <p className="text-xs text-gray-400">{provider.nickname}</p>
          </div>
          <div className="flex items-center ml-auto">
            <div className="flex items-center mr-2">
              <div className={`text-${provider.returnPercent >= 0 ? 'green' : 'red'}-500 font-semibold flex items-center`}>
                {provider.returnPercent >= 0 ? '+' : ''}{provider.returnPercent}%
              </div>
            </div>
            {rank && (
              <Badge variant="outline" className="bg-amber-950/30 text-amber-400 border-amber-800">
                Top {rank}
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-4">{provider.description}</p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-900 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Win Rate</span>
              <div className="h-3 w-3 text-gray-400">📊</div>
            </div>
            <p className="text-lg font-semibold text-white">{provider.winRate}%</p>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Drawdown</span>
              <div className="h-3 w-3 text-gray-400">📉</div>
            </div>
            <p className="text-lg font-semibold text-red-500">{provider.maxDrawdown}%</p>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Trades</span>
              <div className="h-3 w-3 text-gray-400">🔄</div>
            </div>
            <p className="text-lg font-semibold text-white">500+</p>
          </div>
        </div>
        
        <div className={`flex items-center ${isProvider ? 'justify-around' : 'justify-between'}`}>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-gray-900"
            onClick={() => setIsPerformanceDialogOpen(true)}
          >
            <LineChart className="mr-1 h-4 w-4" />
            Performance
          </Button>
          
          <Link href={`/providers/${provider.id}`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-green-500 hover:text-green-400 hover:bg-gray-900"
            >
              View More
            </Button>
          </Link>
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
