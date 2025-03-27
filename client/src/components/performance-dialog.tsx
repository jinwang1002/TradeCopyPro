import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PerformanceChart } from "./performance-chart";
import { formatDistanceToNow } from "date-fns";

interface PerformanceDialogProps {
  signalAccount: any;
  performanceData?: any[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isEmbedded?: boolean;
}

export function PerformanceDialog({ 
  signalAccount, 
  performanceData = [], 
  open, 
  onOpenChange,
  isEmbedded = false 
}: PerformanceDialogProps) {
  // Format performance data for the chart
  const chartData = performanceData?.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short' }),
    value: entry.returnPercent
  })) || [];

  const renderContent = () => (
    <>
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
          {signalAccount.nickname?.substring(0, 2).toUpperCase() || "SP"}
        </div>
        <div className="ml-3">
          <h4 className="font-medium">{signalAccount.nickname}</h4>
          <p className="text-sm text-muted-foreground">
            Account active for {signalAccount.createdAt && formatDistanceToNow(new Date(signalAccount.createdAt), { addSuffix: false })}
          </p>
        </div>
      </div>
      
      <div className={`${isEmbedded ? "" : "mb-6 h-64"}`}>
        <PerformanceChart data={chartData} />
      </div>
      
      {!isEmbedded && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Return</p>
              <p className="text-green-500 font-medium text-lg">+{signalAccount.returnPercent}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Win Rate</p>
              <p className="font-medium text-lg">{signalAccount.winRate}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Drawdown</p>
              <p className="text-red-500 font-medium text-lg">{signalAccount.maxDrawdown}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Trades</p>
              <p className="font-medium text-lg">{signalAccount.totalTrades}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );

  // For embedded version, just render the content
  if (isEmbedded) {
    return renderContent();
  }

  // For dialog version, wrap in a dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Performance Details</DialogTitle>
          <DialogDescription>
            Historical performance metrics for {signalAccount.nickname}
          </DialogDescription>
        </DialogHeader>
        
        {renderContent()}
        
        <div className="flex justify-end">
          <Button 
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
