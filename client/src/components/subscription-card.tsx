import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SubscriptionCardProps {
  subscription: {
    subscription: {
      id: number;
      trialEndDate: string;
      isActive: boolean;
      isPaid: boolean;
      lotSizeMultiplier: number;
      reverseCopy: boolean;
      onlySlTpTrades: boolean;
    };
    signalAccount: {
      id: number;
      nickname: string;
      returnPercent: number;
    };
    provider: {
      id: number;
      displayName: string;
    };
  };
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const { subscription: sub, signalAccount, provider } = subscription;
  
  // Calculate trial days left
  const trialEndsAt = new Date(sub.trialEndDate);
  const now = new Date();
  const isTrialActive = trialEndsAt > now && !sub.isPaid;
  const trialTimeLeft = formatDistanceToNow(trialEndsAt, { addSuffix: true });
  
  // Get status badge details
  const getStatusBadge = () => {
    if (!sub.isActive) {
      return {
        text: "Inactive",
        className: "bg-red-500/20 text-red-500 border-red-500/50"
      };
    } else if (isTrialActive) {
      return {
        text: `Trial: Ends ${trialTimeLeft}`,
        className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
      };
    } else if (sub.isPaid) {
      return {
        text: "Active",
        className: "bg-green-500/20 text-green-500 border-green-500/50"
      };
    } else {
      return {
        text: "Payment Required",
        className: "bg-red-500/20 text-red-500 border-red-500/50"
      };
    }
  };
  
  const statusBadge = getStatusBadge();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {provider.displayName.substring(0, 2).toUpperCase()}
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <h3 className="font-medium">{signalAccount.nickname}</h3>
                <Badge 
                  variant="outline" 
                  className={`ml-2 ${statusBadge.className}`}
                >
                  {statusBadge.text}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">by {provider.displayName}</p>
            </div>
          </div>
          
          <div className="flex items-center mt-3 md:mt-0 space-x-4">
            <div className="flex items-center">
              <p className="text-sm mr-2">Performance:</p>
              <span className="text-green-500 font-medium">+{signalAccount.returnPercent}%</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Link href={`/providers/${signalAccount.id}`}>
                <Button variant="outline" size="sm">
                  View Provider
                </Button>
              </Link>
              
              <Button variant="default" size="sm">
                <Settings className="mr-1 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-accent p-2 rounded text-center">
            <p className="text-xs text-muted-foreground">Lot Size Multiplier</p>
            <p className="font-medium">{sub.lotSizeMultiplier}x</p>
          </div>
          
          <div className="bg-accent p-2 rounded text-center">
            <p className="text-xs text-muted-foreground">Reverse Copy</p>
            <p className="font-medium">{sub.reverseCopy ? "Yes" : "No"}</p>
          </div>
          
          <div className="bg-accent p-2 rounded text-center">
            <p className="text-xs text-muted-foreground">Only SL/TP Trades</p>
            <p className="font-medium">{sub.onlySlTpTrades ? "Yes" : "No"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
