import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Award,
  BarChart2,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface ProviderCardProps {
  id: string;
  name: string;
  accountName: string;
  description: string;
  avatar: string;
  returnPercentage: number;
  winRate: number;
  drawdown: number;
  totalTrades: number;
  onViewProfile: (id: string) => void;
  onSubscribe: (id: string) => void;
}

const ProviderCard = ({
  id = "provider-1",
  name = "TraderJoe",
  accountName = "Aggressive Scalper",
  description = "High-risk, short-term trades on EUR/USD and other major pairs. Focused on quick profits with tight stop losses.",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=TraderJoe",
  returnPercentage = 150,
  winRate = 68,
  drawdown = 12,
  totalTrades = 342,
  onViewProfile = () => {},
  onSubscribe = () => {},
}: ProviderCardProps) => {
  const isPositiveReturn = returnPercentage >= 0;

  return (
    <Card className="w-full bg-black border-gray-800 hover:border-gray-700 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 border border-gray-700">
            <img src={avatar} alt={name} className="object-cover" />
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{name}</h3>
              {returnPercentage > 100 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="outline"
                        className="bg-amber-950/30 text-amber-400 border-amber-800"
                      >
                        <Award className="h-3 w-3 mr-1" /> Top Performer
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This provider is in the top 10% of performers</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-sm text-gray-400">{accountName}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            {isPositiveReturn ? (
              <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500 mr-1" />
            )}
            <span
              className={cn(
                "font-semibold",
                isPositiveReturn ? "text-green-500" : "text-red-500",
              )}
            >
              {isPositiveReturn ? "+" : ""}
              {returnPercentage}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Win Rate</span>
              <BarChart2 className="h-3 w-3 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-white">{winRate}%</p>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Drawdown</span>
              <TrendingDown className="h-3 w-3 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-red-400">{drawdown}%</p>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Trades</span>
              <BarChart2 className="h-3 w-3 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-white">{totalTrades}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
          onClick={() => onViewProfile(id)}
        >
          View Profile
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => onSubscribe(id)}
        >
          Subscribe
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProviderCard;
