import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isProvider: boolean;
}

export function AddAccountDialog({ open, onOpenChange, isProvider }: AddAccountDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Form schema for signal provider account
  const signalAccountSchema = z.object({
    nickname: z.string().min(3, "Nickname must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    accountId: z.string().min(1, "Account ID is required"),
    brokerName: z.string().min(1, "Broker name is required"),
    apiKey: z.string().min(1, "API key is required"),
  });

  // Form schema for subscriber trade account
  const tradeAccountSchema = z.object({
    brokerName: z.string().min(1, "Broker name is required"),
    accountId: z.string().min(1, "Account ID is required"),
    apiKey: z.string().min(1, "API key is required"),
  });

  // Use correct schema based on user role
  const formSchema = isProvider ? signalAccountSchema : tradeAccountSchema;

  // Set up form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...(isProvider
        ? { nickname: "", description: "", accountId: "", brokerName: "", apiKey: "" }
        : { brokerName: "", accountId: "", apiKey: "" }),
    },
  });

  // Account creation mutation
  const createAccountMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isProvider) {
        const res = await apiRequest("POST", "/api/signal-accounts", {
          ...data,
          userId: user?.id,
        });
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/trade-accounts", {
          ...data,
          userId: user?.id,
        });
        return res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "Account created",
        description: `Your ${isProvider ? "signal" : "trade"} account has been created successfully`,
      });
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: isProvider 
          ? [`/api/users/${user?.id}/signal-accounts`] 
          : ["/api/trade-accounts"],
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createAccountMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {isProvider ? "Signal" : "Trade"} Account</DialogTitle>
          <DialogDescription>
            Enter your {isProvider ? "signal provider" : "trading"} account details here. This information will be 
            used to {isProvider ? "share your trading signals" : "copy trades from signal providers"}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isProvider && (
              <>
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Nickname</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Aggressive Scalper" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., High-risk, short-term trades on EUR/USD" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="brokerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broker Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., IC Markets" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 12345" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key/Token</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your account API key" 
                      type="password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                disabled={createAccountMutation.isPending}
              >
                {createAccountMutation.isPending ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
