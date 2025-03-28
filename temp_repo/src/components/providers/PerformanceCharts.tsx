import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";

interface PerformanceData {
  date: string;
  value: number;
}

interface ChartProps {
  data: PerformanceData[];
  color: string;
  height?: number;
}

interface PerformanceChartsProps {
  providerId?: string;
  accountId?: string;
  performanceData?: {
    returns: PerformanceData[];
    winRate: PerformanceData[];
    drawdown: PerformanceData[];
    equity: PerformanceData[];
  };
}

const SimpleChart: React.FC<ChartProps> = ({
  data = [],
  color = "#22c55e",
  height = 100,
}) => {
  if (data.length === 0) {
    return (
      <div className="h-[100px] w-full flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const values = data.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  return (
    <div className="h-[100px] w-full">
      <svg width="100%" height={height} className="overflow-visible">
        <defs>
          <linearGradient
            id={`gradient-${color.replace("#", "")}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <g>
          {/* Area */}
          <path
            d={`
              M ${0},${height - (((data[0]?.value || 0) - min) / (range || 1)) * height} 
              ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100}%,${height - ((d.value - min) / (range || 1)) * height}`).join(" ")} 
              L ${100}%,${height} 
              L ${0},${height} Z
            `}
            fill={`url(#gradient-${color.replace("#", "")})`}
            strokeWidth="0"
          />
          {/* Line */}
          <path
            d={`
              M ${0},${height - (((data[0]?.value || 0) - min) / (range || 1)) * height} 
              ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100}%,${height - ((d.value - min) / (range || 1)) * height}`).join(" ")}
            `}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  change,
  trend,
  chart,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  chart?: React.ReactNode;
}) => {
  return (
    <Card className="bg-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div
              className={cn(
                "flex items-center text-sm",
                trend === "up" ? "text-green-500" : "text-red-500",
              )}
            >
              {trend === "up" ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              {change}
            </div>
          </div>
          <div className="h-12 w-24">{chart}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  providerId = "1",
  accountId = "1",
  performanceData = {
    returns: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: 10 + Math.random() * 20 + i / 2,
    })),
    winRate: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: 50 + Math.random() * 20 + i / 10,
    })),
    drawdown: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: 15 - Math.random() * 10 - i / 15,
    })),
    equity: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value:
        10000 +
        (Math.random() * 1000 + i * 100) * (Math.random() > 0.2 ? 1 : -1),
    })),
  },
}) => {
  const [timeframe, setTimeframe] = useState("30d");

  // Get the last value and calculate change
  const lastReturn =
    performanceData.returns[performanceData.returns.length - 1]?.value || 0;
  const prevReturn =
    performanceData.returns[performanceData.returns.length - 2]?.value || 0;
  const returnChange = (((lastReturn - prevReturn) / prevReturn) * 100).toFixed(
    2,
  );

  const lastWinRate =
    performanceData.winRate[performanceData.winRate.length - 1]?.value || 0;
  const prevWinRate =
    performanceData.winRate[performanceData.winRate.length - 2]?.value || 0;
  const winRateChange = (
    ((lastWinRate - prevWinRate) / prevWinRate) *
    100
  ).toFixed(2);

  const lastDrawdown =
    performanceData.drawdown[performanceData.drawdown.length - 1]?.value || 0;
  const prevDrawdown =
    performanceData.drawdown[performanceData.drawdown.length - 2]?.value || 0;
  const drawdownChange = (
    ((lastDrawdown - prevDrawdown) / Math.abs(prevDrawdown)) *
    100
  ).toFixed(2);

  return (
    <div className="space-y-6 bg-background p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Metrics</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Return %"
          value={`${lastReturn.toFixed(2)}%`}
          change={`${returnChange}%`}
          trend={parseFloat(returnChange) >= 0 ? "up" : "down"}
          chart={<SimpleChart data={performanceData.returns} color="#22c55e" />}
        />
        <StatCard
          title="Win Rate"
          value={`${lastWinRate.toFixed(2)}%`}
          change={`${winRateChange}%`}
          trend={parseFloat(winRateChange) >= 0 ? "up" : "down"}
          chart={<SimpleChart data={performanceData.winRate} color="#3b82f6" />}
        />
        <StatCard
          title="Max Drawdown"
          value={`${Math.abs(lastDrawdown).toFixed(2)}%`}
          change={`${Math.abs(parseFloat(drawdownChange)).toFixed(2)}%`}
          trend={parseFloat(drawdownChange) <= 0 ? "up" : "down"}
          chart={
            <SimpleChart data={performanceData.drawdown} color="#ef4444" />
          }
        />
      </div>

      <Tabs defaultValue="equity">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="equity">Equity Curve</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
        </TabsList>

        <TabsContent value="equity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
              <CardDescription>Account equity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <SimpleChart
                  data={performanceData.equity}
                  color="#22c55e"
                  height={300}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  <div>
                    <div className="text-sm font-medium">Starting Balance</div>
                    <div className="text-lg font-bold">
                      ${performanceData.equity[0]?.value.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
                  <div>
                    <div className="text-sm font-medium">Current Balance</div>
                    <div className="text-lg font-bold">
                      $
                      {performanceData.equity[
                        performanceData.equity.length - 1
                      ]?.value.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns">
          <Card>
            <CardHeader>
              <CardTitle>Returns Over Time</CardTitle>
              <CardDescription>Monthly return percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <SimpleChart
                  data={performanceData.returns}
                  color="#3b82f6"
                  height={300}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drawdown">
          <Card>
            <CardHeader>
              <CardTitle>Drawdown Analysis</CardTitle>
              <CardDescription>
                Maximum drawdown percentage over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <SimpleChart
                  data={performanceData.drawdown}
                  color="#ef4444"
                  height={300}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>Trade Analysis</CardTitle>
              <CardDescription>
                Win/loss ratio and trade performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-[300px] text-muted-foreground">
                Trade analysis data will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceCharts;
