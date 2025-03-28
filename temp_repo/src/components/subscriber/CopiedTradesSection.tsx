import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArrowUpDown, Filter, RefreshCw, Search } from "lucide-react";

interface Trade {
  id: string;
  signalAccount: string;
  tradeAccount: string;
  symbol: string;
  type: "Buy" | "Sell";
  openPrice: number;
  currentPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize: number;
  status: "Open" | "Closed";
  profit?: number;
  openTime: Date;
  closeTime?: Date;
}

interface CopiedTradesSectionProps {
  tradeAccounts?: string[];
  signalAccounts?: string[];
  openTrades?: Trade[];
  tradeHistory?: Trade[];
}

const CopiedTradesSection = ({
  tradeAccounts = ["IC Markets", "Pepperstone"],
  signalAccounts = ["Aggressive Scalper", "Steady Growth", "Trend Follower"],
  openTrades = [
    {
      id: "1",
      signalAccount: "Aggressive Scalper",
      tradeAccount: "IC Markets",
      symbol: "EUR/USD",
      type: "Buy",
      openPrice: 1.1,
      currentPrice: 1.105,
      stopLoss: 1.095,
      takeProfit: 1.11,
      lotSize: 0.5,
      status: "Open",
      profit: 50,
      openTime: new Date(2023, 3, 15, 9, 30),
    },
    {
      id: "2",
      signalAccount: "Steady Growth",
      tradeAccount: "IC Markets",
      symbol: "GBP/USD",
      type: "Sell",
      openPrice: 1.3,
      currentPrice: 1.295,
      stopLoss: 1.305,
      takeProfit: 1.29,
      lotSize: 1.0,
      status: "Open",
      profit: 50,
      openTime: new Date(2023, 3, 16, 10, 15),
    },
    {
      id: "3",
      signalAccount: "Trend Follower",
      tradeAccount: "Pepperstone",
      symbol: "USD/JPY",
      type: "Buy",
      openPrice: 115.0,
      currentPrice: 115.5,
      stopLoss: 114.5,
      takeProfit: 116.0,
      lotSize: 0.75,
      status: "Open",
      profit: 37.5,
      openTime: new Date(2023, 3, 17, 11, 45),
    },
  ],
  tradeHistory = [
    {
      id: "4",
      signalAccount: "Aggressive Scalper",
      tradeAccount: "IC Markets",
      symbol: "EUR/USD",
      type: "Sell",
      openPrice: 1.12,
      stopLoss: 1.125,
      takeProfit: 1.115,
      lotSize: 0.5,
      status: "Closed",
      profit: 25,
      openTime: new Date(2023, 3, 10, 14, 30),
      closeTime: new Date(2023, 3, 10, 16, 45),
    },
    {
      id: "5",
      signalAccount: "Steady Growth",
      tradeAccount: "Pepperstone",
      symbol: "GBP/USD",
      type: "Buy",
      openPrice: 1.28,
      stopLoss: 1.275,
      takeProfit: 1.29,
      lotSize: 1.0,
      status: "Closed",
      profit: -50,
      openTime: new Date(2023, 3, 11, 9, 15),
      closeTime: new Date(2023, 3, 11, 15, 30),
    },
    {
      id: "6",
      signalAccount: "Trend Follower",
      tradeAccount: "IC Markets",
      symbol: "USD/JPY",
      type: "Sell",
      openPrice: 116.5,
      stopLoss: 117.0,
      takeProfit: 116.0,
      lotSize: 0.75,
      status: "Closed",
      profit: 37.5,
      openTime: new Date(2023, 3, 12, 11, 0),
      closeTime: new Date(2023, 3, 13, 10, 15),
    },
  ],
}: CopiedTradesSectionProps) => {
  const [selectedTradeAccount, setSelectedTradeAccount] =
    useState<string>("All");
  const [selectedSignalAccount, setSelectedSignalAccount] =
    useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter trades based on selected accounts and search term
  const filterTrades = (trades: Trade[]) => {
    return trades.filter((trade) => {
      const matchesTradeAccount =
        selectedTradeAccount === "All" ||
        trade.tradeAccount === selectedTradeAccount;
      const matchesSignalAccount =
        selectedSignalAccount === "All" ||
        trade.signalAccount === selectedSignalAccount;
      const matchesSearch =
        searchTerm === "" ||
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.signalAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.tradeAccount.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTradeAccount && matchesSignalAccount && matchesSearch;
    });
  };

  const filteredOpenTrades = filterTrades(openTrades);
  const filteredTradeHistory = filterTrades(tradeHistory);

  // Format date to readable string
  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full bg-gray-950 text-white border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Copied Trades</CardTitle>
        <CardDescription className="text-gray-400">
          View and manage trades copied from signal providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
              <Select
                value={selectedTradeAccount}
                onValueChange={setSelectedTradeAccount}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Trade Account" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="All">All Trade Accounts</SelectItem>
                  {tradeAccounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSignalAccount}
                onValueChange={setSelectedSignalAccount}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Signal Account" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="All">All Signal Accounts</SelectItem>
                  {signalAccounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full sm:w-[250px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search trades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-gray-900 border-gray-700 text-white w-full"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="bg-gray-900 border-gray-700 hover:bg-gray-800"
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-gray-900 border-gray-700 hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="open" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900">
              <TabsTrigger
                value="open"
                className="data-[state=active]:bg-gray-800"
              >
                Open Trades
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-gray-800"
              >
                Trade History
              </TabsTrigger>
            </TabsList>

            {/* Open Trades Tab */}
            <TabsContent value="open" className="mt-4">
              <div className="rounded-md border border-gray-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-900">
                    <TableRow className="hover:bg-gray-900 border-gray-800">
                      <TableHead className="text-gray-400 w-[120px]">
                        <div className="flex items-center">
                          Symbol
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-400">
                        <div className="flex items-center">
                          Signal Account
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-400 hidden md:table-cell">
                        Trade Account
                      </TableHead>
                      <TableHead className="text-gray-400 text-center">
                        Type
                      </TableHead>
                      <TableHead className="text-gray-400 text-right hidden sm:table-cell">
                        Open Price
                      </TableHead>
                      <TableHead className="text-gray-400 text-right hidden lg:table-cell">
                        SL/TP
                      </TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Lot Size
                      </TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Profit
                      </TableHead>
                      <TableHead className="text-gray-400 hidden lg:table-cell">
                        Open Time
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOpenTrades.length > 0 ? (
                      filteredOpenTrades.map((trade) => (
                        <TableRow
                          key={trade.id}
                          className="hover:bg-gray-900 border-gray-800"
                        >
                          <TableCell className="font-medium">
                            {trade.symbol}
                          </TableCell>
                          <TableCell>{trade.signalAccount}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {trade.tradeAccount}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={`${trade.type === "Buy" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}
                            >
                              {trade.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right hidden sm:table-cell">
                            {trade.openPrice.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-right hidden lg:table-cell">
                            {trade.stopLoss?.toFixed(4)}/
                            {trade.takeProfit?.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-right">
                            {trade.lotSize.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                trade.profit && trade.profit >= 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {trade.profit
                                ? `${trade.profit > 0 ? "+" : ""}${trade.profit}`
                                : "0"}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {formatDate(trade.openTime)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="h-24 text-center text-gray-500"
                        >
                          No open trades found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Trade History Tab */}
            <TabsContent value="history" className="mt-4">
              <div className="rounded-md border border-gray-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-900">
                    <TableRow className="hover:bg-gray-900 border-gray-800">
                      <TableHead className="text-gray-400 w-[120px]">
                        <div className="flex items-center">
                          Symbol
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-400">
                        <div className="flex items-center">
                          Signal Account
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-400 hidden md:table-cell">
                        Trade Account
                      </TableHead>
                      <TableHead className="text-gray-400 text-center">
                        Type
                      </TableHead>
                      <TableHead className="text-gray-400 text-right hidden sm:table-cell">
                        Open Price
                      </TableHead>
                      <TableHead className="text-gray-400 text-right hidden lg:table-cell">
                        SL/TP
                      </TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Lot Size
                      </TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Profit
                      </TableHead>
                      <TableHead className="text-gray-400 hidden lg:table-cell">
                        Close Time
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTradeHistory.length > 0 ? (
                      filteredTradeHistory.map((trade) => (
                        <TableRow
                          key={trade.id}
                          className="hover:bg-gray-900 border-gray-800"
                        >
                          <TableCell className="font-medium">
                            {trade.symbol}
                          </TableCell>
                          <TableCell>{trade.signalAccount}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {trade.tradeAccount}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={`${trade.type === "Buy" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}
                            >
                              {trade.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right hidden sm:table-cell">
                            {trade.openPrice.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-right hidden lg:table-cell">
                            {trade.stopLoss?.toFixed(4)}/
                            {trade.takeProfit?.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-right">
                            {trade.lotSize.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                trade.profit && trade.profit >= 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {trade.profit
                                ? `${trade.profit > 0 ? "+" : ""}${trade.profit}`
                                : "0"}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {trade.closeTime
                              ? formatDate(trade.closeTime)
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="h-24 text-center text-gray-500"
                        >
                          No trade history found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default CopiedTradesSection;
