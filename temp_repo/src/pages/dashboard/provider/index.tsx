import React, { useState, useEffect } from "react";
import {
  getCurrentUser,
  getSignalAccounts,
  getTradesBySignalAccount,
  updatePerformanceStats,
} from "@/lib/api";
import { Helmet } from "react-helmet";
import ObserverAccountsSection from "@/components/provider/ObserverAccountsSection";
import PerformanceStatsSection from "@/components/provider/PerformanceStatsSection";
import TradesSection from "@/components/provider/TradesSection";
import EarningsSection from "@/components/provider/EarningsSection";

const ProviderDashboard = () => {
  // State for provider dashboard data
  const [providerData, setProviderData] = useState({
    name: "TraderJoe",
    role: "provider",
    // Observer accounts data would be fetched from API in a real implementation
    observerAccounts: [
      {
        id: "1",
        nickname: "Aggressive Scalper",
        description: "High-risk, short-term trades on EUR/USD",
        accountId: "MT4-12345",
        brokerName: "IC Markets",
        apiKey: "api_key_123456",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        nickname: "Conservative Swing",
        description: "Low-risk, long-term trades on major pairs",
        accountId: "MT5-67890",
        brokerName: "Pepperstone",
        apiKey: "api_key_789012",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    // Performance stats data
    performanceStats: {
      accounts: [
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
          name: "Conservative Swing",
          returnPercentage: 42.3,
          winRate: 82,
          totalTrades: 124,
          profitLoss: 4230,
          maxDrawdown: 5.7,
        },
      ],
    },
    // Trades data
    signalAccounts: [
      {
        id: "acc1",
        name: "Aggressive Scalper",
        trades: [
          {
            id: "t1",
            pair: "EUR/USD",
            type: "Buy",
            openPrice: 1.1,
            currentPrice: 1.105,
            stopLoss: 1.095,
            takeProfit: 1.11,
            openTime: "2023-04-01T10:30:00Z",
            status: "Open",
            pips: 50,
          },
          {
            id: "t2",
            pair: "GBP/USD",
            type: "Sell",
            openPrice: 1.3,
            currentPrice: 1.295,
            stopLoss: 1.305,
            takeProfit: 1.29,
            openTime: "2023-04-02T14:15:00Z",
            status: "Open",
            pips: 50,
          },
          {
            id: "t3",
            pair: "USD/JPY",
            type: "Buy",
            openPrice: 110.5,
            openTime: "2023-03-28T09:45:00Z",
            closeTime: "2023-03-29T16:30:00Z",
            profit: 120,
            pips: 30,
            status: "Closed",
          },
        ],
      },
      {
        id: "acc2",
        name: "Conservative Swing",
        trades: [
          {
            id: "t5",
            pair: "EUR/JPY",
            type: "Buy",
            openPrice: 130.75,
            currentPrice: 131.25,
            stopLoss: 130.25,
            takeProfit: 132.0,
            openTime: "2023-04-03T08:20:00Z",
            status: "Open",
            pips: 50,
          },
          {
            id: "t6",
            pair: "USD/CAD",
            type: "Sell",
            openPrice: 1.25,
            openTime: "2023-03-30T13:40:00Z",
            closeTime: "2023-04-01T10:15:00Z",
            profit: 200,
            pips: 40,
            status: "Closed",
          },
        ],
      },
    ],
    // Earnings data
    earnings: {
      summary: {
        totalEarnings: 2450,
        subscriptionEarnings: 1800,
        performanceBonuses: 650,
        subscriberCount: 18,
        monthlyGrowth: 12.5,
      },
      monthlyData: [
        { month: "Jan", subscriptions: 300, bonuses: 100, total: 400 },
        { month: "Feb", subscriptions: 320, bonuses: 100, total: 420 },
        { month: "Mar", subscriptions: 350, bonuses: 150, total: 500 },
        { month: "Apr", subscriptions: 380, bonuses: 150, total: 530 },
        { month: "May", subscriptions: 400, bonuses: 200, total: 600 },
      ],
    },
  });

  useEffect(() => {
    // Fetch provider data, signal accounts, trades, and performance stats
    const fetchProviderData = async () => {
      try {
        // Get current user
        const { success: userSuccess, user } = await getCurrentUser();
        if (userSuccess && user) {
          setProviderData((prev) => ({
            ...prev,
            name: user.full_name || prev.name,
          }));

          // Get signal accounts
          const { success: accountsSuccess, signalAccounts: accounts } =
            await getSignalAccounts();
          if (accountsSuccess && accounts) {
            const formattedAccounts = accounts.map((account) => ({
              id: account.id,
              nickname: account.nickname,
              description: account.description || "",
              accountId: account.account_id,
              brokerName: account.broker_name,
              apiKey: account.api_key,
              createdAt: account.created_at,
            }));

            setProviderData((prev) => ({
              ...prev,
              observerAccounts: formattedAccounts,
            }));

            // Update performance stats
            await updatePerformanceStats();

            // Get trades for each signal account
            const signalAccountsWithTrades = [];
            for (const account of formattedAccounts) {
              const { success: tradesSuccess, trades } =
                await getTradesBySignalAccount(account.id);
              if (tradesSuccess && trades) {
                const formattedTrades = trades.map((trade) => ({
                  id: trade.id,
                  pair: trade.symbol,
                  type: trade.direction === "buy" ? "Buy" : "Sell",
                  openPrice: trade.open_price,
                  currentPrice: trade.close_price || trade.open_price,
                  stopLoss: trade.stop_loss,
                  takeProfit: trade.take_profit,
                  openTime: trade.open_time,
                  closeTime: trade.close_time,
                  status: trade.status === "open" ? "Open" : "Closed",
                  profit: trade.profit,
                  pips: trade.pips,
                }));

                signalAccountsWithTrades.push({
                  id: account.id,
                  name: account.nickname,
                  trades: formattedTrades,
                });
              }
            }

            setProviderData((prev) => ({
              ...prev,
              signalAccounts: signalAccountsWithTrades,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
      }
    };

    fetchProviderData();
  }, []);

  // Handlers for observer accounts actions
  const handleAddAccount = (account: any) => {
    console.log("Adding account:", account);
    // In a real implementation, this would call an API to add the account
  };

  const handleEditAccount = (id: string, account: any) => {
    console.log("Editing account:", id, account);
    // In a real implementation, this would call an API to update the account
  };

  const handleDeleteAccount = (id: string) => {
    console.log("Deleting account:", id);
    // In a real implementation, this would call an API to delete the account
  };

  return (
    <div className="bg-gray-950 min-h-screen">
      <Helmet>
        <title>Provider Dashboard | TradeRiser</title>
      </Helmet>

      <div className="space-y-6 py-6">
        {/* Welcome section */}
        <div className="px-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {providerData.name}
          </h1>
          <p className="text-gray-400">
            Manage your observer accounts, track performance, and monitor your
            earnings
          </p>
        </div>

        {/* Performance Stats Section */}
        <PerformanceStatsSection
          accounts={providerData.performanceStats.accounts}
        />

        {/* Observer Accounts Section */}
        <ObserverAccountsSection
          accounts={providerData.observerAccounts}
          onAddAccount={handleAddAccount}
          onEditAccount={handleEditAccount}
          onDeleteAccount={handleDeleteAccount}
        />

        {/* Trades Section */}
        <TradesSection signalAccounts={providerData.signalAccounts} />

        {/* Earnings Section */}
        <EarningsSection
          summary={providerData.earnings.summary}
          monthlyData={providerData.earnings.monthlyData}
        />
      </div>
    </div>
  );
};

export default ProviderDashboard;
