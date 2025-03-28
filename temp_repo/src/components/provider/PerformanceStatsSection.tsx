import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Award,
  AlertTriangle,
} from "lucide-react";
import { Progress } from "../ui/progress";

interface PerformanceStatsProps {
  accounts?: {
    id: string;
    name: string;
    returnPercentage: number;
    winRate: number;
    totalTrades: number;
    profitLoss: number;
    maxDrawdown: number;
  }[];
}

const PerformanceStatsSection = ({
  accounts = [
    {
      id: "1",
      name: "Aggressive Scalper",
      returnPercentage: 87.5,
      winRate: 68,
      totalTrades: 245,
      profitLoss: 8750,
      maxDrawdown: 12.3,
    },
    {
      id: "2",
      name: "Conservative Growth",
      returnPercentage: 42.3,
      winRate: 82,
      totalTrades: 124,
      profitLoss: 4230,
      maxDrawdown: 5.7,
    },
    {
      id: "3",
      name: "Trend Follower",
      returnPercentage: 63.8,
      winRate: 75,
      totalTrades: 187,
      profitLoss: 6380,
      maxDrawdown: 8.9,
    },
  ],
}: PerformanceStatsProps) => {
  return (
    <div className="w-full space-y-4 bg-black text-white p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Statistics</h2>
        <Tabs defaultValue="all" className="w-[300px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{account.name}</CardTitle>
              <CardDescription className="text-zinc-400">
                {account.totalTrades} total trades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Return</span>
                  <div className="flex items-center">
                    <span
                      className={`text-xl font-bold ${account.returnPercentage >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {account.returnPercentage}%
                    </span>
                    {account.returnPercentage >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
                    )}
                  </div>
                </div>
                <Progress
                  value={Math.min(Math.abs(account.returnPercentage), 100)}
                  className={`h-2 ${account.returnPercentage >= 0 ? "bg-zinc-800" : "bg-zinc-800"}`}
                  indicatorClassName={
                    account.returnPercentage >= 0
                      ? "bg-green-500"
                      : "bg-red-500"
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-zinc-400 mr-1" />
                    <span className="text-sm text-zinc-400">Win Rate</span>
                  </div>
                  <p className="text-lg font-semibold">{account.winRate}%</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-zinc-400 mr-1" />
                    <span className="text-sm text-zinc-400">P/L</span>
                  </div>
                  <p
                    className={`text-lg font-semibold ${account.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    ${Math.abs(account.profitLoss).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-zinc-400 mr-1" />
                  <span className="text-sm text-zinc-400">Max Drawdown</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-red-500">
                    {account.maxDrawdown}%
                  </p>
                  <Progress
                    value={Math.min(account.maxDrawdown * 5, 100)}
                    className="h-2 w-[120px] bg-zinc-800"
                    indicatorClassName="bg-red-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PerformanceStatsSection;
