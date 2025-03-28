import React, { useState, useEffect } from "react";
import {
  getCurrentUser,
  getTradeAccounts,
  getSubscriptions,
  getCopiedTradesByUser,
} from "@/lib/api";
import { Helmet } from "react-helmet";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TradeAccountsSection from "@/components/subscriber/TradeAccountsSection";
import SubscriptionsSection from "@/components/subscriber/SubscriptionsSection";
import CopiedTradesSection from "@/components/subscriber/CopiedTradesSection";

interface SubscriberDashboardProps {
  username?: string;
  avatarUrl?: string;
  notificationCount?: number;
  tradeAccounts?: {
    id: string;
    brokerName: string;
    accountId: string;
    apiKey: string;
    nickname?: string;
    dateAdded: string;
  }[];
  subscriptions?: {
    id: string;
    providerName: string;
    signalAccountName: string;
    trialStatus: "active" | "expired" | "none";
    subscriptionStatus: "active" | "inactive";
    trialEndDate?: string;
    tradeAccountName: string;
    lotSize: number;
    reverseMode: boolean;
    onlySlTpTrades: boolean;
  }[];
}

const SubscriberDashboard = ({
  username: initialUsername = "TraderJoe",
  avatarUrl:
    initialAvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=TraderJoe",
  notificationCount = 3,
  tradeAccounts: initialTradeAccounts = [],
  subscriptions: initialSubscriptions = [],
}: SubscriberDashboardProps) => {
  const [username, setUsername] = useState(initialUsername);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [tradeAccounts, setTradeAccounts] = useState(initialTradeAccounts);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);

  useEffect(() => {
    // Fetch user data, trade accounts, and subscriptions
    const fetchUserData = async () => {
      try {
        // Get current user
        const { success: userSuccess, user } = await getCurrentUser();
        if (userSuccess && user) {
          setUsername(user.full_name || initialUsername);
          setAvatarUrl(user.avatar_url || initialAvatarUrl);

          // Get trade accounts
          const { success: accountsSuccess, tradeAccounts: accounts } =
            await getTradeAccounts();
          if (accountsSuccess && accounts) {
            const formattedAccounts = accounts.map((account) => ({
              id: account.id,
              brokerName: account.broker_name,
              accountId: account.account_id,
              apiKey: account.api_key,
              nickname: account.nickname || undefined,
              dateAdded: new Date(account.created_at)
                .toISOString()
                .split("T")[0],
            }));

            setTradeAccounts(formattedAccounts);
          }

          // Get subscriptions
          const { success: subsSuccess, subscriptions: subs } =
            await getSubscriptions();
          if (subsSuccess && subs) {
            const formattedSubs = subs.map((sub) => {
              const tradeAccount =
                sub.subscription_trade_accounts?.[0]?.trade_accounts;
              const signalAccount = sub.signal_accounts;

              return {
                id: sub.id,
                providerName: "Provider", // This would need to be fetched separately
                signalAccountName: signalAccount?.nickname || "Signal Account",
                trialStatus:
                  sub.trial_ends_at && new Date(sub.trial_ends_at) > new Date()
                    ? "active"
                    : "expired",
                subscriptionStatus: sub.status as "active" | "inactive",
                trialEndDate: sub.trial_ends_at,
                tradeAccountName:
                  tradeAccount?.nickname ||
                  tradeAccount?.broker_name ||
                  "Trade Account",
                lotSize: sub.lot_size_multiplier,
                reverseMode: sub.reverse_copy,
                onlySlTpTrades: sub.only_sl_tp_trades,
              };
            });

            setSubscriptions(formattedSubs);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [initialUsername, initialAvatarUrl]);
  // Handlers for trade accounts
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
    <>
      <Helmet>
        <title>Subscriber Dashboard | TradeRiser</title>
      </Helmet>

      <DashboardLayout
        userRole="subscriber"
        username={username}
        avatarUrl={avatarUrl}
        notificationCount={notificationCount}
      >
        <div className="flex flex-col space-y-8 pb-10 bg-black text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Subscriber Dashboard</h1>
            <p className="text-gray-400">Welcome back, {username}</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Trade Accounts Section */}
            <TradeAccountsSection
              accounts={tradeAccounts}
              onAddAccount={handleAddAccount}
              onEditAccount={handleEditAccount}
              onDeleteAccount={handleDeleteAccount}
            />

            {/* Subscriptions Section */}
            <SubscriptionsSection
              subscriptions={subscriptions}
              tradeAccounts={tradeAccounts.map((account) => ({
                id: account.id,
                name: account.nickname || account.brokerName,
              }))}
            />

            {/* Copied Trades Section */}
            <CopiedTradesSection
              tradeAccounts={tradeAccounts.map(
                (account) => account.nickname || account.brokerName,
              )}
              signalAccounts={subscriptions.map((sub) => sub.signalAccountName)}
            />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SubscriberDashboard;
