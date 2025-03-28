import React, { useState } from "react";
import {
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  LineChart,
  Info,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SignalAccount {
  id: string;
  nickname: string;
  description: string;
  broker: string;
  accountId: string;
  returnPercentage: number;
  winRate: number;
  totalTrades: number;
  profitLoss: number;
  maxDrawdown: number;
  isSubscribed?: boolean;
  trialEnds?: string;
}

interface SignalAccountsListProps {
  providerId?: string;
  accounts?: SignalAccount[];
  onSubscribe?: (accountId: string) => void;
}

const SignalAccountsList = ({
  providerId = "provider-1",
  accounts = [
    {
      id: "sa-1",
      nickname: "Aggressive Scalper",
      description: "High-risk, short-term trades on EUR/USD",
      broker: "IC Markets",
      accountId: "ICM-12345",
      returnPercentage: 150,
      winRate: 68,
      totalTrades: 245,
      profitLoss: 15000,
      maxDrawdown: 12.5,
    },
    {
      id: "sa-2",
      nickname: "Steady Growth",
      description: "Medium-risk, medium-term trades on major pairs",
      broker: "Pepperstone",
      accountId: "PST-67890",
      returnPercentage: 75,
      winRate: 82,
      totalTrades: 120,
      profitLoss: 7500,
      maxDrawdown: 8.2,
      isSubscribed: true,
      trialEnds: "2025-05-15",
    },
    {
      id: "sa-3",
      nickname: "Trend Follower",
      description: "Low-risk, long-term trades following major market trends",
      broker: "FXCM",
      accountId: "FXCM-54321",
      returnPercentage: 45,
      winRate: 90,
      totalTrades: 60,
      profitLoss: 4500,
      maxDrawdown: 5.5,
    },
  ],
  onSubscribe = () => {},
}: SignalAccountsListProps) => {
  const [selectedAccount, setSelectedAccount] = useState<SignalAccount | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTradeAccount, setSelectedTradeAccount] = useState("");
  const [lotSizeMultiplier, setLotSizeMultiplier] = useState("1x");
  const [onlySlTpTrades, setOnlySlTpTrades] = useState(false);
  const [reverseCopy, setReverseCopy] = useState(false);

  // Mock trade accounts for the demo
  const tradeAccounts = [
    { id: "ta-1", name: "IC Markets", accountId: "ICM-98765" },
    { id: "ta-2", name: "Pepperstone", accountId: "PST-54321" },
  ];

  const handleSubscribeClick = (account: SignalAccount) => {
    setSelectedAccount(account);
    setIsDialogOpen(true);
  };

  const handleConfirmSubscription = () => {
    if (selectedAccount) {
      onSubscribe(selectedAccount.id);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="w-full bg-black text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Signal Accounts</h2>
        <p className="text-gray-400">
          Subscribe to signal accounts to copy trades with your preferred
          settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className="bg-gray-900 border-gray-800 overflow-hidden"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-white">
                    {account.nickname}
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-1">
                    {account.description}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    account.returnPercentage > 100
                      ? "default"
                      : account.returnPercentage > 50
                        ? "secondary"
                        : "outline"
                  }
                  className={`${account.returnPercentage > 0 ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white`}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {account.returnPercentage > 0 ? "+" : ""}
                  {account.returnPercentage}%
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {account.broker} · Account ID: {account.accountId}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center text-gray-400 text-xs mb-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Win Rate
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 cursor-help text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of profitable trades</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-lg font-semibold">
                    {account.winRate}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-gray-400 text-xs mb-1">
                    <LineChart className="h-3 w-3 mr-1" />
                    Max Drawdown
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 cursor-help text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Maximum observed loss from a peak to a trough</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-lg font-semibold">
                    {account.maxDrawdown}%
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center text-gray-400 text-xs mb-1">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Profit/Loss
                  </div>
                  <span
                    className={`text-lg font-semibold ${account.profitLoss > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {account.profitLoss > 0 ? "+" : ""}
                    {account.profitLoss.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-gray-400 text-xs mb-1">
                    Total Trades
                  </div>
                  <span className="text-lg font-semibold">
                    {account.totalTrades}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              {account.isSubscribed ? (
                <div className="w-full">
                  <Badge
                    variant="secondary"
                    className="mb-2 bg-blue-900 text-blue-100 hover:bg-blue-800 w-full justify-center py-1"
                  >
                    {account.trialEnds
                      ? `Trial ends: ${new Date(account.trialEnds).toLocaleDateString()}`
                      : "Active Subscription"}
                  </Badge>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Manage Settings
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleSubscribeClick(account)}
                >
                  Subscribe <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-md">
          <DialogHeader>
            <DialogTitle>Subscribe to {selectedAccount?.nickname}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Start a 7-day free trial to copy trades from this signal account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-300">
                Select Trade Account
              </label>
              <select
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                value={selectedTradeAccount}
                onChange={(e) => setSelectedTradeAccount(e.target.value)}
              >
                <option value="">Select an account...</option>
                {tradeAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.accountId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block text-gray-300">
                Lot Size Multiplier
              </label>
              <div className="flex space-x-2">
                {["0.5x", "1x", "2x"].map((size) => (
                  <Button
                    key={size}
                    variant={lotSizeMultiplier === size ? "default" : "outline"}
                    className={
                      lotSizeMultiplier === size
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-gray-700"
                    }
                    onClick={() => setLotSizeMultiplier(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sltp-trades"
                  className="mr-2 h-4 w-4 rounded border-gray-700 bg-gray-800"
                  checked={onlySlTpTrades}
                  onChange={(e) => setOnlySlTpTrades(e.target.checked)}
                />
                <label htmlFor="sltp-trades" className="text-sm text-gray-300">
                  Only copy trades with Stop Loss/Take Profit
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reverse-copy"
                  className="mr-2 h-4 w-4 rounded border-gray-700 bg-gray-800"
                  checked={reverseCopy}
                  onChange={(e) => setReverseCopy(e.target.checked)}
                />
                <label htmlFor="reverse-copy" className="text-sm text-gray-300">
                  Reverse copy (Buy → Sell, Sell → Buy)
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubscription}
              disabled={!selectedTradeAccount}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Start Free Trial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignalAccountsList;
