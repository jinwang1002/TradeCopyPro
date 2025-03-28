import React, { useState, useEffect } from "react";
import { subscribeToSignalAccount, getTradeAccounts } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreditCard, RefreshCw, Filter } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  tradeAccount: z.string({
    required_error: "Please select a trade account",
  }),
  lotSize: z.string().default("1x"),
  reverseCopy: z.boolean().default(false),
  onlySLTPTrades: z.boolean().default(false),
});

interface SubscriptionModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  providerName?: string;
  providerId?: string;
  signalAccountName?: string;
  onSubscribe?: (data: z.infer<typeof formSchema>) => void;
}

const SubscriptionModal = ({
  open = true,
  onOpenChange,
  providerName = "TraderJoe",
  providerId = "1",
  signalAccountName = "Aggressive Scalper",
  onSubscribe,
}: SubscriptionModalProps) => {
  const [activeTab, setActiveTab] = useState("settings");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tradeAccount: "",
      lotSize: "1x",
      reverseCopy: false,
      onlySLTPTrades: false,
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Convert lot size string to number
      const lotSizeMultiplier = parseFloat(data.lotSize.replace("x", ""));

      // Subscribe to signal account
      const { success, subscription, error } = await subscribeToSignalAccount(
        providerId,
        [data.tradeAccount],
        lotSizeMultiplier,
        data.reverseCopy,
        data.onlySLTPTrades,
      );

      if (success && subscription) {
        console.log("Subscription created:", subscription);
        if (onSubscribe) {
          onSubscribe(data);
        }
      } else {
        console.error("Subscription error:", error);
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  const [tradeAccounts, setTradeAccounts] = useState<
    Array<{
      id: string;
      name: string;
      accountId: string;
    }>
  >([]);

  useEffect(() => {
    // Fetch trade accounts
    const fetchTradeAccounts = async () => {
      try {
        const { success, tradeAccounts } = await getTradeAccounts();
        if (success && tradeAccounts) {
          // Map the trade accounts to the expected format
          const formattedAccounts = tradeAccounts.map((account) => ({
            id: account.id,
            name: account.nickname || account.broker_name,
            accountId: account.account_id,
          }));

          setTradeAccounts(formattedAccounts);
        }
      } catch (error) {
        console.error("Error fetching trade accounts:", error);
      }
    };

    fetchTradeAccounts();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Subscribe to {signalAccountName}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Provider: {providerName} | 7-day free trial, then $30/month
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="settings">
              <CreditCard className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="details">
              <RefreshCw className="mr-2 h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4 py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="tradeAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Trade Account</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a trade account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tradeAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name} (ID: {account.accountId})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose which of your trading accounts will copy trades
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lotSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lot Size Multiplier</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select lot size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0.5x">0.5x (Half size)</SelectItem>
                          <SelectItem value="1x">1x (Same size)</SelectItem>
                          <SelectItem value="2x">2x (Double size)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Adjust the trade size relative to the signal provider
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="reverseCopy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Reverse Copy</FormLabel>
                          <FormDescription>
                            Copy trades in the opposite direction (Buy → Sell,
                            Sell → Buy)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="onlySLTPTrades"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Only SL/TP Trades</FormLabel>
                          <FormDescription>
                            Only copy trades that have Stop Loss and Take Profit
                            levels
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Start 7-Day Free Trial
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">
                  Signal Account Details
                </h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>
                    <span className="font-medium text-white">Provider:</span>{" "}
                    {providerName}
                  </p>
                  <p>
                    <span className="font-medium text-white">Account:</span>{" "}
                    {signalAccountName}
                  </p>
                  <p>
                    <span className="font-medium text-white">Return:</span>{" "}
                    <span className="text-green-500">+150%</span>
                  </p>
                  <p>
                    <span className="font-medium text-white">Win Rate:</span>{" "}
                    68%
                  </p>
                  <p>
                    <span className="font-medium text-white">Drawdown:</span>{" "}
                    <span className="text-red-500">15%</span>
                  </p>
                  <p>
                    <span className="font-medium text-white">
                      Total Trades:
                    </span>{" "}
                    342
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Subscription Terms</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>
                    <span className="font-medium text-white">Free Trial:</span>{" "}
                    7 days
                  </p>
                  <p>
                    <span className="font-medium text-white">Monthly Fee:</span>{" "}
                    $30.00
                  </p>
                  <p>
                    <span className="font-medium text-white">Billing:</span>{" "}
                    Automatic renewal
                  </p>
                  <p>
                    <span className="font-medium text-white">Cancel:</span>{" "}
                    Anytime during trial
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setActiveTab("settings")}
                className="w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Configure Settings
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
