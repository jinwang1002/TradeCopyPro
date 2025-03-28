import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, TrendingUp, Trophy, Users } from "lucide-react";
import PerformanceCard from "./PerformanceCard";
import { Link } from "react-router-dom";

interface TopPerformer {
  id: string;
  providerName: string;
  accountName: string;
  returnPercentage: number;
  winRate: number;
  drawdown: number;
  totalTrades: number;
  avatarUrl: string;
}

interface TopPerformersSectionProps {
  performers?: TopPerformer[];
}

const TopPerformersSection = ({
  performers = [
    {
      id: "1",
      providerName: "TraderJoe",
      accountName: "Aggressive Scalper",
      returnPercentage: 150,
      winRate: 68,
      drawdown: 12,
      totalTrades: 342,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=TraderJoe",
    },
    {
      id: "2",
      providerName: "ForexMaster",
      accountName: "Steady Growth",
      returnPercentage: 87,
      winRate: 72,
      drawdown: 8,
      totalTrades: 215,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ForexMaster",
    },
    {
      id: "3",
      providerName: "SwingTrader",
      accountName: "Long-Term Trends",
      returnPercentage: 65,
      winRate: 58,
      drawdown: 15,
      totalTrades: 124,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=SwingTrader",
    },
    {
      id: "4",
      providerName: "DayTraderPro",
      accountName: "Intraday Momentum",
      returnPercentage: 112,
      winRate: 63,
      drawdown: 18,
      totalTrades: 456,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=DayTraderPro",
    },
  ],
}: TopPerformersSectionProps) => {
  const [selectedPerformer, setSelectedPerformer] =
    useState<TopPerformer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (performer: TopPerformer) => {
    setSelectedPerformer(performer);
    setIsDetailsOpen(true);
  };

  const handleSubscribe = (performerId: string) => {
    console.log(`Subscribe to performer with ID: ${performerId}`);
    // In a real implementation, this would navigate to subscription flow
  };

  // Mock data for performance chart
  const mockChartData = [
    { month: "Jan", return: 12 },
    { month: "Feb", return: 28 },
    { month: "Mar", return: 45 },
    { month: "Apr", return: 67 },
    { month: "May", return: 95 },
    { month: "Jun", return: 120 },
    { month: "Jul", return: 150 },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 bg-gray-950">
      <div className="mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
            <Trophy className="h-8 w-8 mr-3 text-yellow-500" />
            Top Performing Traders
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our highest-performing signal providers. Subscribe to copy
            their trades automatically with your custom settings.
          </p>
        </motion.div>
      </div>

      <Tabs defaultValue="return" className="w-full mb-8">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger
              value="return"
              className="data-[state=active]:bg-blue-600"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Highest Return
            </TabsTrigger>
            <TabsTrigger
              value="popular"
              className="data-[state=active]:bg-blue-600"
            >
              <Users className="h-4 w-4 mr-2" />
              Most Popular
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="return" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performers.map((performer, index) => (
              <motion.div
                key={performer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <PerformanceCard
                  providerName={performer.providerName}
                  accountName={performer.accountName}
                  returnPercentage={performer.returnPercentage}
                  winRate={performer.winRate}
                  drawdown={performer.drawdown}
                  totalTrades={performer.totalTrades}
                  avatarUrl={performer.avatarUrl}
                  onViewDetails={() => handleViewDetails(performer)}
                  onSubscribe={() => handleSubscribe(performer.id)}
                />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Reordering performers to simulate different sorting */}
            {[...performers]
              .sort((a, b) => b.totalTrades - a.totalTrades)
              .map((performer, index) => (
                <motion.div
                  key={performer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PerformanceCard
                    providerName={performer.providerName}
                    accountName={performer.accountName}
                    returnPercentage={performer.returnPercentage}
                    winRate={performer.winRate}
                    drawdown={performer.drawdown}
                    totalTrades={performer.totalTrades}
                    avatarUrl={performer.avatarUrl}
                    onViewDetails={() => handleViewDetails(performer)}
                    onSubscribe={() => handleSubscribe(performer.id)}
                  />
                </motion.div>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-10">
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link to="/providers">
            View All Providers
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Performance Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              {selectedPerformer?.providerName} -{" "}
              {selectedPerformer?.accountName}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Performance history over the last 6 months
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex justify-between mb-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Return</p>
                <p className="text-2xl font-bold text-green-500">
                  +{selectedPerformer?.returnPercentage}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">
                  {selectedPerformer?.winRate}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Drawdown</p>
                <p className="text-2xl font-bold text-white">
                  {selectedPerformer?.drawdown}%
                </p>
              </div>
            </div>

            {/* Simple chart visualization */}
            <div className="h-[200px] w-full bg-gray-800 rounded-lg p-4 relative">
              <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
                {mockChartData.map((point, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-2 bg-blue-500 rounded-t"
                      style={{ height: `${point.return}px` }}
                    />
                    <span className="text-xs text-gray-500 mt-1">
                      {point.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute top-4 left-4 text-sm text-gray-500">
                Performance chart (placeholder)
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => setIsDetailsOpen(false)}
              >
                Close
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() =>
                  selectedPerformer && handleSubscribe(selectedPerformer.id)
                }
              >
                Subscribe
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TopPerformersSection;
