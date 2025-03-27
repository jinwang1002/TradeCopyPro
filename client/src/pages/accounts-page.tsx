import { MainLayout } from "@/components/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TradeAccountCard } from "@/components/trade-account-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddAccountDialog } from "@/components/add-account-dialog";

export default function AccountsPage() {
  const { user } = useAuth();
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const isProvider = user?.role === "provider";

  // Fetch trade or signal accounts based on user role
  const { data: accounts, isLoading: isAccountsLoading } = useQuery({
    queryKey: [isProvider ? "/api/users/" + user?.id + "/signal-accounts" : "/api/trade-accounts"],
  });

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-semibold">
              {isProvider ? "Signal Accounts" : "Trade Accounts"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isProvider
                ? "Manage your signal accounts to share trading strategies with subscribers"
                : "Manage your trade accounts to copy trades from signal providers"}
            </p>
          </div>
          <Button onClick={() => setIsAddAccountDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add {isProvider ? "Signal" : "Trade"} Account</span>
          </Button>
        </header>

        {/* Accounts List */}
        <div className="mb-8">
          {isAccountsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[250px] w-full" />
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : accounts?.length > 0 ? (
            <div className="space-y-4">
              {accounts.map((account: any) => (
                <TradeAccountCard
                  key={account.id}
                  account={account}
                  isProvider={isProvider}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="mb-4 text-muted-foreground">
                  You haven't added any {isProvider ? "signal" : "trade"} accounts yet.
                </p>
                <Button onClick={() => setIsAddAccountDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add Your First Account</span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <AddAccountDialog
          open={isAddAccountDialogOpen}
          onOpenChange={setIsAddAccountDialogOpen}
          isProvider={isProvider}
        />
      </div>
    </MainLayout>
  );
}