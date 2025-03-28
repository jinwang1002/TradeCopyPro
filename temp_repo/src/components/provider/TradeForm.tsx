import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createTrade } from "@/lib/api";

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
import { Input } from "@/components/ui/input";

const tradeFormSchema = z.object({
  signalAccountId: z.string({
    required_error: "Please select a signal account",
  }),
  symbol: z.string().min(1, { message: "Symbol is required" }),
  direction: z.enum(["buy", "sell"]),
  lotSize: z.coerce.number().positive({ message: "Lot size must be positive" }),
  openPrice: z.coerce
    .number()
    .positive({ message: "Open price must be positive" }),
  stopLoss: z.coerce.number().optional(),
  takeProfit: z.coerce.number().optional(),
});

type TradeFormValues = z.infer<typeof tradeFormSchema>;

interface TradeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signalAccounts: Array<{ id: string; name: string }>;
  onTradeCreated?: () => void;
}

const TradeForm = ({
  open,
  onOpenChange,
  signalAccounts,
  onTradeCreated,
}: TradeFormProps) => {
  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      symbol: "EUR/USD",
      direction: "buy",
      lotSize: 0.1,
      openPrice: 1.1,
    },
  });

  const onSubmit = async (data: TradeFormValues) => {
    try {
      const { success, trade, error } = await createTrade({
        signal_account_id: data.signalAccountId,
        symbol: data.symbol,
        direction: data.direction,
        lot_size: data.lotSize,
        open_price: data.openPrice,
        stop_loss: data.stopLoss,
        take_profit: data.takeProfit,
        status: "open",
      });

      if (success && trade) {
        form.reset();
        onOpenChange(false);
        if (onTradeCreated) {
          onTradeCreated();
        }
      } else {
        console.error("Error creating trade:", error);
      }
    } catch (error) {
      console.error("Error creating trade:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Trade</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new trade that will be copied by your subscribers.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="signalAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signal Account</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a signal account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      {signalAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select which signal account will broadcast this trade
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="EUR/USD"
                      className="bg-gray-900 border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the trading symbol (e.g., EUR/USD, BTC/USD)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direction</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lotSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="bg-gray-900 border-gray-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="openPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00001"
                        className="bg-gray-900 border-gray-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stopLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Loss (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00001"
                        className="bg-gray-900 border-gray-700 text-white"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="takeProfit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Take Profit (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00001"
                        className="bg-gray-900 border-gray-700 text-white"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Create Trade
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TradeForm;
