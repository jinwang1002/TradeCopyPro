import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface SubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signalAccount: any;
  tradeAccounts: any[];
}

export function SubscribeDialog({ open, onOpenChange, signalAccount, tradeAccounts }: SubscribeDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showWarning, setShowWarning] = useState<boolean>(false);

  // Form schema for subscription settings
  const subscriptionSchema = z.object({
    tradeAccountId: z.string().min(1, "Please select a trade account"),
    lotSizeMultiplier: z.string().min(1, "Please select a lot size multiplier"),
    reverseCopy: z.boolean().default(false),
    onlySlTpTrades: z.boolean().default(true),
  });

  // Set up form
  const form = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      tradeAccountId: "",
      lotSizeMultiplier: "1",
      reverseCopy: false,
      onlySlTpTrades: true,
    },
  });

  // Get location for navigation
  const [, navigate] = useLocation();

  // Subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/subscriptions", {
        ...data,
        tradeAccountId: parseInt(data.tradeAccountId),
        lotSizeMultiplier: parseFloat(data.lotSizeMultiplier),
        signalAccountId: signalAccount.id,
      });
      return res.json();
    },
    onSuccess: (newSubscription) => {
      toast({
        title: "Subscription created",
        description: `You're now in a 7-day free trial. Continue to payment to activate your subscription.`,
      });
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["/api/subscriptions"],
      });
      
      // Redirect to checkout page
      navigate(`/checkout/${newSubscription.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error creating subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof subscriptionSchema>) => {
    createSubscriptionMutation.mutate(values);
  };

  if (tradeAccounts.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Subscribe to Signal</DialogTitle>
            <DialogDescription>
              You need to add a trade account before you can subscribe to signals.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subscribe to Signal</DialogTitle>
          <DialogDescription>
            Configure how you want to copy trades from {signalAccount.nickname}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            {signalAccount.nickname?.substring(0, 2).toUpperCase() || "SP"}
          </div>
          <div className="ml-3">
            <h4 className="font-medium">{signalAccount.nickname}</h4>
            <p className="text-sm text-muted-foreground">{signalAccount.description}</p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tradeAccountId"
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
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.brokerName} (ID: {account.accountId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-accent p-4 rounded-lg space-y-3">
              <h3 className="font-medium text-sm">Copy Settings</h3>
              
              <FormField
                control={form.control}
                name="lotSizeMultiplier"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="text-sm flex-1">Lot Size Multiplier</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Select multiplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0.5">0.5x</SelectItem>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reverseCopy"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Reverse Copy</FormLabel>
                      <FormDescription className="text-xs text-muted-foreground">
                        Reverse the direction of copied trades
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            setShowWarning(true);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="onlySlTpTrades"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Only Copy Trades with SL/TP</FormLabel>
                      <FormDescription className="text-xs text-muted-foreground">
                        Only copy trades that have stop loss and take profit
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {showWarning && (
              <Card className="border-yellow-500/30 bg-yellow-500/10">
                <CardContent className="p-3 text-sm flex items-start">
                  <AlertTriangle className="text-yellow-500 mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-500 font-medium">Warning: Reverse Copy Enabled</p>
                    <p className="text-muted-foreground mt-1">
                      With reverse copy enabled, buy signals will be executed as sells and vice versa. This is an advanced feature and may not be suitable for all traders.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="border-yellow-500/30 bg-yellow-500/10">
              <CardContent className="p-3 text-sm flex items-start">
                <AlertTriangle className="text-yellow-500 mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="text-yellow-500 font-medium">7-Day Free Trial</p>
                  <p className="text-muted-foreground mt-1">
                    After the trial period, you will be charged $30/month unless you cancel.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createSubscriptionMutation.isPending}
              >
                {createSubscriptionMutation.isPending ? "Subscribing..." : "Start Free Trial"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
