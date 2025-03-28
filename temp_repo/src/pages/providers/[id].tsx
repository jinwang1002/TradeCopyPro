import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ProfileHeader from "@/components/providers/ProfileHeader";
import SignalAccountsList from "@/components/providers/SignalAccountsList";
import PerformanceCharts from "@/components/providers/PerformanceCharts";
import ProviderComments from "@/components/providers/ProviderComments";
import SubscriptionModal from "@/components/subscription/SubscriptionModal";

const ProviderProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedSignalAccount, setSelectedSignalAccount] = useState<{
    id: string;
    nickname: string;
  } | null>(null);

  // Get search params from URL
  const searchParams = new URLSearchParams(location.search);
  const searchValue = searchParams.get("search");

  // Mock provider data - in a real app, this would be fetched from an API
  const provider = {
    id: id || "1",
    name: "TraderJoe",
    avatar: "",
    bio: "Professional forex trader with 10+ years of experience. Specializing in swing trading major pairs with consistent returns.",
    joinDate: "Jan 2023",
    totalSubscribers: 248,
    totalAccounts: 3,
    avgReturn: 87.5,
    avgWinRate: 68,
    avgDrawdown: 12.3,
    verified: true,
  };

  // Mock signal accounts data
  const signalAccounts = [
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
  ];

  // Filter signal accounts if search value is present
  const filteredSignalAccounts = searchValue
    ? signalAccounts.filter(
        (account) =>
          account.nickname.toLowerCase().includes(searchValue.toLowerCase()) ||
          account.description
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          account.broker.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : signalAccounts;

  // Mock performance data
  const performanceData = {
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
  };

  const handleSubscribe = (accountId: string) => {
    const account = filteredSignalAccounts.find((acc) => acc.id === accountId);
    if (account) {
      setSelectedSignalAccount({
        id: account.id,
        nickname: account.nickname,
      });
      setIsSubscriptionModalOpen(true);
    }
  };

  const handleSubscriptionComplete = (data: any) => {
    // In a real app, this would send the subscription data to an API
    console.log("Subscription completed:", data);
    setIsSubscriptionModalOpen(false);
    // You might want to show a success message or update the UI
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Provider Profile Header */}
        <ProfileHeader provider={provider} />

        {/* Display search value if present */}
        {searchValue && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-300">
              Search results for:{" "}
              <span className="font-semibold text-white">"{searchValue}"</span>
            </p>
          </div>
        )}

        {/* Performance Charts */}
        <PerformanceCharts
          providerId={provider.id}
          performanceData={performanceData}
        />

        {/* Signal Accounts List */}
        <SignalAccountsList
          providerId={provider.id}
          accounts={filteredSignalAccounts}
          onSubscribe={handleSubscribe}
          searchTerm={searchValue || ""}
        />

        {/* Provider Comments */}
        <ProviderComments providerId={provider.id} />

        {/* Subscription Modal */}
        {selectedSignalAccount && (
          <SubscriptionModal
            open={isSubscriptionModalOpen}
            onOpenChange={setIsSubscriptionModalOpen}
            providerName={provider.name}
            signalAccountName={selectedSignalAccount.nickname}
            onSubscribe={handleSubscriptionComplete}
          />
        )}
      </div>
    </div>
  );
};

export default ProviderProfilePage;
