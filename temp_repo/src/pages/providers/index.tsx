import React, { useState, useEffect } from "react";
import { getCurrentUser, getSignalAccounts } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProvidersList from "@/components/providers/ProvidersList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

interface TradeAccount {
  id: string;
  broker: string;
  accountId: string;
}

const ProvidersPage = () => {
  const navigate = useNavigate();
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null,
  );
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [lotSize, setLotSize] = useState<string>("1x");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"provider" | "subscriber">(
    "subscriber",
  );

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const { success, user } = await getCurrentUser();
        if (success && user) {
          setIsAuthenticated(true);
          setUserRole(user.role as "provider" | "subscriber");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();
  }, []);

  // Mock trade accounts data
  const tradeAccounts: TradeAccount[] = [
    { id: "account-1", broker: "IC Markets", accountId: "12345" },
    { id: "account-2", broker: "Pepperstone", accountId: "67890" },
    { id: "account-3", broker: "FXCM", accountId: "24680" },
  ];

  const handleSubscribe = (providerId: string) => {
    if (!isAuthenticated) {
      // Redirect to auth page if not authenticated
      navigate("/auth");
      return;
    }

    setSelectedProviderId(providerId);
    setIsSubscribeModalOpen(true);
  };

  const handleConfirmSubscription = () => {
    // Here would be the logic to process the subscription
    // For now, we'll just close the modal and show a success message
    setIsSubscribeModalOpen(false);

    // In a real app, you would call an API to create the subscription
    console.log("Subscription created for provider:", selectedProviderId);
    console.log("Trade account:", selectedAccount);
    console.log("Lot size:", lotSize);

    // Reset state
    setSelectedProviderId(null);
    setSelectedAccount("");
    setLotSize("1x");
  };

  return (
    <MainLayout isAuthenticated={isAuthenticated} userRole={userRole}>
      <div className="bg-black text-white min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Signal Providers</h1>
          <p className="text-gray-400">
            Browse and subscribe to top-performing signal providers. Start your
            7-day free trial today.
          </p>
        </div>

        <ProvidersList onSubscribe={handleSubscribe} />

        {/* Subscription Modal */}
        <Dialog
          open={isSubscribeModalOpen}
          onOpenChange={setIsSubscribeModalOpen}
        >
          <DialogContent className="bg-gray-900 text-white border-gray-800 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Subscribe to Signal Provider</DialogTitle>
              <DialogDescription className="text-gray-400">
                Select a trade account and customize your copy settings.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {tradeAccounts.length > 0 ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Select Trade Account
                    </label>
                    <Select
                      value={selectedAccount}
                      onValueChange={setSelectedAccount}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {tradeAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.broker} - {account.accountId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Lot Size Multiplier
                    </label>
                    <Select value={lotSize} onValueChange={setLotSize}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select lot size" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="0.5x">0.5x (Half size)</SelectItem>
                        <SelectItem value="1x">1x (Same size)</SelectItem>
                        <SelectItem value="2x">2x (Double size)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <p className="text-sm text-gray-300">
                    You don't have any trade accounts yet. Please add a trade
                    account in your dashboard first.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsSubscribeModalOpen(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSubscription}
                disabled={!selectedAccount && tradeAccounts.length > 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start 7-Day Free Trial
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ProvidersPage;
