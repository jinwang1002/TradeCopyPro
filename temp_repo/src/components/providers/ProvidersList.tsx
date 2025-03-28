import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProviderCard from "./ProviderCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  accountName: string;
  description: string;
  avatar: string;
  returnPercentage: number;
  winRate: number;
  drawdown: number;
  totalTrades: number;
}

interface ProvidersListProps {
  providers?: Provider[];
  onSubscribe?: (providerId: string) => void;
}

const ProvidersList = ({
  providers = [
    {
      id: "provider-1",
      name: "TraderJoe",
      accountName: "Aggressive Scalper",
      description:
        "High-risk, short-term trades on EUR/USD and other major pairs. Focused on quick profits with tight stop losses.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TraderJoe",
      returnPercentage: 150,
      winRate: 68,
      drawdown: 12,
      totalTrades: 342,
    },
    {
      id: "provider-2",
      name: "ForexMaster",
      accountName: "Steady Growth",
      description:
        "Medium-risk strategy focusing on trend following across multiple currency pairs. Consistent returns with managed risk.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ForexMaster",
      returnPercentage: 85,
      winRate: 72,
      drawdown: 8,
      totalTrades: 256,
    },
    {
      id: "provider-3",
      name: "SwingTrader",
      accountName: "Long-Term Trends",
      description:
        "Low-risk strategy focusing on major economic trends. Holds positions for days or weeks to capture significant market moves.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SwingTrader",
      returnPercentage: 65,
      winRate: 62,
      drawdown: 15,
      totalTrades: 124,
    },
    {
      id: "provider-4",
      name: "DayTraderPro",
      accountName: "Intraday Momentum",
      description:
        "Captures intraday momentum on high-volatility pairs. Multiple trades per day with strict risk management.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DayTraderPro",
      returnPercentage: 110,
      winRate: 58,
      drawdown: 18,
      totalTrades: 520,
    },
    {
      id: "provider-5",
      name: "AlgoTrader",
      accountName: "Automated Strategy",
      description:
        "Fully automated trading system based on mathematical models and statistical analysis. Trades multiple instruments.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlgoTrader",
      returnPercentage: 95,
      winRate: 64,
      drawdown: 10,
      totalTrades: 412,
    },
  ],
  onSubscribe = () => {},
}: ProvidersListProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("returnPercentage");
  const [currentPage, setCurrentPage] = useState(1);
  const providersPerPage = 5;

  // Filter providers based on search term
  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort providers based on selected criteria
  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (sortBy === "returnPercentage") {
      return b.returnPercentage - a.returnPercentage;
    } else if (sortBy === "winRate") {
      return b.winRate - a.winRate;
    } else if (sortBy === "drawdown") {
      return a.drawdown - b.drawdown; // Lower drawdown is better
    } else if (sortBy === "totalTrades") {
      return b.totalTrades - a.totalTrades;
    }
    return 0;
  });

  // Calculate pagination
  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = sortedProviders.slice(
    indexOfFirstProvider,
    indexOfLastProvider,
  );
  const totalPages = Math.ceil(sortedProviders.length / providersPerPage);

  const handleViewProfile = (id: string) => {
    navigate(`/providers/${id}`);
  };

  return (
    <div className="w-full bg-black text-white">
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="text-gray-400 h-4 w-4" />
            <span className="text-sm text-gray-400">Sort by:</span>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="returnPercentage">Return %</SelectItem>
              <SelectItem value="winRate">Win Rate</SelectItem>
              <SelectItem value="drawdown">Lowest Drawdown</SelectItem>
              <SelectItem value="totalTrades">Total Trades</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {currentProviders.length > 0 ? (
          currentProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              id={provider.id}
              name={provider.name}
              accountName={provider.accountName}
              description={provider.description}
              avatar={provider.avatar}
              returnPercentage={provider.returnPercentage}
              winRate={provider.winRate}
              drawdown={provider.drawdown}
              totalTrades={provider.totalTrades}
              onViewProfile={handleViewProfile}
              onSubscribe={onSubscribe}
            />
          ))
        ) : (
          <div className="text-center py-10 bg-gray-900 rounded-lg">
            <p className="text-gray-400">
              No providers found matching your search criteria.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                // Show first page, last page, and pages around current page
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNumber);
                        }}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 &&
                    currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ProvidersList;
