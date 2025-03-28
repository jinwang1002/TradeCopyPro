import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowUpDown, Eye, Filter, RefreshCw } from "lucide-react";

interface Trade {
  id: string;
  pair: string;
  type: "Buy" | "Sell";
  openPrice: number;
  currentPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  openTime: string;
  closeTime?: string;
  profit?: number;
  pips?: number;
  status: "Open" | "Closed";
}

interface SignalAccount {
  id: string;
  name: string;
  trades: Trade[];
}

interface TradesSectionProps {
  signalAccounts?: SignalAccount[];
}

const TradesSection = ({ signalAccounts = [] }: TradesSectionProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string>(
    signalAccounts[0]?.id || "",
  );

  // Default mock data if no props provided
  const defaultAccounts: SignalAccount[] = [
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
        {
          id: "t4",
          pair: "AUD/USD",
          type: "Sell",
          openPrice: 0.75,
          openTime: "2023-03-25T11:20:00Z",
          closeTime: "2023-03-26T22:15:00Z",
          profit: -80,
          pips: -20,
          status: "Closed",
        },
      ],
    },
    {
      id: "acc2",
      name: "Trend Follower",
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
  ];

  const accounts = signalAccounts.length > 0 ? signalAccounts : defaultAccounts;
  const currentAccount =
    accounts.find((acc) => acc.id === selectedAccount) || accounts[0];

  const openTrades =
    currentAccount?.trades.filter((trade) => trade.status === "Open") || [];
  const closedTrades =
    currentAccount?.trades.filter((trade) => trade.status === "Closed") || [];

  return (
    <div className="w-full space-y-4 bg-black text-white p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trades</h2>
        <div className="flex items-center space-x-2">
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-[200px] grid-cols-2">
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Open Trades</CardTitle>
              <CardDescription className="text-zinc-400">
                Currently active trades for {currentAccount?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {openTrades.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pair</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Open Price</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>SL</TableHead>
                      <TableHead>TP</TableHead>
                      <TableHead>Pips</TableHead>
                      <TableHead>Open Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">
                          {trade.pair}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              trade.type === "Buy" ? "success" : "destructive"
                            }
                          >
                            {trade.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.openPrice}</TableCell>
                        <TableCell
                          className={`${trade.currentPrice && trade.currentPrice > trade.openPrice ? "text-green-500" : "text-red-500"}`}
                        >
                          {trade.currentPrice}
                        </TableCell>
                        <TableCell>{trade.stopLoss}</TableCell>
                        <TableCell>{trade.takeProfit}</TableCell>
                        <TableCell
                          className={`${trade.pips && trade.pips > 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {trade.pips && (trade.pips > 0 ? "+" : "")}
                          {trade.pips}
                        </TableCell>
                        <TableCell>
                          {new Date(trade.openTime).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  No open trades for this account
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription className="text-zinc-400">
                Closed trades for {currentAccount?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {closedTrades.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center space-x-1 cursor-pointer">
                          <span>Pair</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Open Price</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Pips</TableHead>
                      <TableHead>Open Time</TableHead>
                      <TableHead>Close Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {closedTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">
                          {trade.pair}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              trade.type === "Buy" ? "success" : "destructive"
                            }
                          >
                            {trade.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.openPrice}</TableCell>
                        <TableCell
                          className={`${trade.profit && trade.profit > 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {trade.profit && (trade.profit > 0 ? "+$" : "-$")}
                          {trade.profit && Math.abs(trade.profit)}
                        </TableCell>
                        <TableCell
                          className={`${trade.pips && trade.pips > 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {trade.pips && (trade.pips > 0 ? "+" : "")}
                          {trade.pips}
                        </TableCell>
                        <TableCell>
                          {new Date(trade.openTime).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {trade.closeTime &&
                            new Date(trade.closeTime).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  No trade history for this account
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradesSection;
