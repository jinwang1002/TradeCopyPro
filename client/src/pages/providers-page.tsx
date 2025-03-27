import { MainLayout } from "@/components/main-layout";
import { useQuery } from "@tanstack/react-query";
import { SignalProviderCard } from "@/components/signal-provider-card";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ProvidersPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all signal accounts
  const { data: signalAccounts, isLoading } = useQuery({
    queryKey: ["/api/signal-accounts"],
  });

  // Fetch user's trade accounts
  const { data: tradeAccounts } = useQuery({
    queryKey: ["/api/trade-accounts"],
    enabled: user?.role === "subscriber",
  });

  // Filter accounts based on search query
  const filteredAccounts = signalAccounts?.filter((account: any) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      account.nickname.toLowerCase().includes(lowerCaseQuery) ||
      account.description.toLowerCase().includes(lowerCaseQuery) ||
      account.brokerName.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-heading font-semibold">
            Signal Providers
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and subscribe to top-performing signal providers
          </p>
        </header>
        
        {/* Search and filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Find Signal Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, description, or broker..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Providers List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[350px] w-full" />
            ))}
          </div>
        ) : filteredAccounts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccounts.map((account: any, index: number) => (
              <SignalProviderCard 
                key={account.id} 
                provider={account} 
                rank={index < 3 ? index + 1 : undefined}
                hasTradeAccounts={tradeAccounts?.length > 0}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-lg font-medium mb-2">No signal providers found</p>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "There are no signal providers available at the moment"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
