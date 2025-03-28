import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  ArrowUpCircle,
  TrendingUp,
  BarChart2,
  ArrowDownCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceCardProps {
  providerName?: string;
  accountName?: string;
  returnPercentage?: number;
  winRate?: number;
  drawdown?: number;
  totalTrades?: number;
  avatarUrl?: string;
  onSubscribe?: () => void;
  onViewDetails?: () => void;
}

const PerformanceCard = ({
  providerName = "TraderJoe",
  accountName = "Aggressive Scalper",
  returnPercentage = 150,
  winRate = 68,
  drawdown = 12,
  totalTrades = 342,
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=TraderJoe",
  onSubscribe = () => console.log("Subscribe clicked"),
  onViewDetails = () => console.log("View details clicked"),
}: PerformanceCardProps) => {
  const isPositiveReturn = returnPercentage > 0;

  return (
    <Card className="w-full max-w-[320px] h-[400px] overflow-hidden flex flex-col bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10 border border-gray-700">
              <AvatarImage src={avatarUrl} alt={providerName} />
              <AvatarFallback className="bg-gray-800 text-gray-400">
                {providerName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-white">
                {providerName}
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                {accountName}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={isPositiveReturn ? "default" : "destructive"}
            className={cn(
              "font-bold",
              isPositiveReturn
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700",
            )}
          >
            {isPositiveReturn ? "+" : ""}
            {returnPercentage}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Win Rate</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0 ml-1">
                      <Info className="h-3 w-3 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Percentage of profitable trades</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xl font-bold text-white">{winRate}%</p>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1 text-sm">
              <ArrowDownCircle className="h-4 w-4 mr-1" />
              <span>Drawdown</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0 ml-1">
                      <Info className="h-3 w-3 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Maximum account decline from peak</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xl font-bold text-white">{drawdown}%</p>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1 text-sm">
              <BarChart2 className="h-4 w-4 mr-1" />
              <span>Total Trades</span>
            </div>
            <p className="text-xl font-bold text-white">{totalTrades}</p>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1 text-sm">
              <ArrowUpCircle className="h-4 w-4 mr-1" />
              <span>Return</span>
            </div>
            <p
              className={cn(
                "text-xl font-bold",
                isPositiveReturn ? "text-green-500" : "text-red-500",
              )}
            >
              {isPositiveReturn ? "+" : ""}
              {returnPercentage}%
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full",
              isPositiveReturn ? "bg-green-500" : "bg-red-500",
            )}
            style={{
              width: `${Math.min(Math.abs(returnPercentage) / 2, 100)}%`,
            }}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2 pt-2">
        <Button
          variant="outline"
          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          onClick={onViewDetails}
        >
          View Details
        </Button>
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onSubscribe}
        >
          Subscribe
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PerformanceCard;
