import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DollarSign, TrendingUp, Users } from "lucide-react";

interface EarningsSummary {
  totalEarnings: number;
  subscriptionEarnings: number;
  performanceBonuses: number;
  subscriberCount: number;
  monthlyGrowth: number;
}

interface MonthlyEarning {
  month: string;
  subscriptions: number;
  bonuses: number;
  total: number;
}

interface EarningsSectionProps {
  summary?: EarningsSummary;
  monthlyData?: MonthlyEarning[];
}

const EarningsSection = ({
  summary = {
    totalEarnings: 2450,
    subscriptionEarnings: 1800,
    performanceBonuses: 650,
    subscriberCount: 18,
    monthlyGrowth: 12.5,
  },
  monthlyData = [
    { month: "Jan", subscriptions: 300, bonuses: 100, total: 400 },
    { month: "Feb", subscriptions: 320, bonuses: 100, total: 420 },
    { month: "Mar", subscriptions: 350, bonuses: 150, total: 500 },
    { month: "Apr", subscriptions: 380, bonuses: 150, total: 530 },
    { month: "May", subscriptions: 400, bonuses: 200, total: 600 },
  ],
}: EarningsSectionProps) => {
  return (
    <div className="w-full bg-black text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Earnings Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <DollarSign className="h-5 w-5 mr-1 text-green-500" />$
              {summary.totalEarnings.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              ${summary.subscriptionEarnings.toLocaleString()} from
              subscriptions
              <br />${summary.performanceBonuses.toLocaleString()} from
              performance bonuses
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription>Active Subscribers</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Users className="h-5 w-5 mr-1 text-blue-500" />
              {summary.subscriberCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              $
              {(summary.subscriptionEarnings / summary.subscriberCount).toFixed(
                2,
              )}{" "}
              avg. revenue per subscriber
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription>Monthly Growth</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <TrendingUp className="h-5 w-5 mr-1 text-green-500" />
              {summary.monthlyGrowth}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">Compared to previous month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earnings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900">
          <TabsTrigger value="earnings">Monthly Earnings</TabsTrigger>
          <TabsTrigger value="breakdown">Earnings Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="mt-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
              <CardDescription>
                Your earnings over the last 5 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full flex items-end justify-between gap-2 mt-4">
                {monthlyData.map((data) => (
                  <div key={data.month} className="flex flex-col items-center">
                    <div className="flex gap-1 h-[150px] items-end">
                      <div
                        className="w-5 bg-blue-600 rounded-t"
                        style={{
                          height: `${(data.subscriptions / 400) * 100}%`,
                        }}
                        title={`Subscriptions: $${data.subscriptions}`}
                      />
                      <div
                        className="w-5 bg-green-600 rounded-t"
                        style={{ height: `${(data.bonuses / 400) * 100}%` }}
                        title={`Bonuses: $${data.bonuses}`}
                      />
                    </div>
                    <div className="text-xs mt-2">{data.month}</div>
                    <div className="text-xs text-gray-400">${data.total}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="mt-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Earnings Breakdown</CardTitle>
              <CardDescription>
                How your earnings are calculated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Subscription Revenue</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    You earn $10 per subscriber per month
                  </p>
                  <div className="flex justify-between items-center">
                    <span>{summary.subscriberCount} subscribers</span>
                    <span className="text-green-500">
                      ${summary.subscriptionEarnings}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Performance Bonuses</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    You earn a $50 bonus for every 10% return on your signal
                    accounts
                  </p>
                  <div className="flex justify-between items-center">
                    <span>Performance bonuses</span>
                    <span className="text-green-500">
                      ${summary.performanceBonuses}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Earnings</span>
                    <span className="text-green-500">
                      ${summary.totalEarnings}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EarningsSection;
