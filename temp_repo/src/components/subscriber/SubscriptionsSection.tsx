import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Clock,
  AlertCircle,
  Settings,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface SubscriptionProps {
  id: string;
  providerName: string;
  signalAccountName: string;
  trialStatus: "active" | "expired" | "none";
  subscriptionStatus: "active" | "inactive";
  trialEndDate?: string;
  tradeAccountName: string;
  lotSize: number;
  reverseMode: boolean;
  onlySlTpTrades: boolean;
}

interface SubscriptionsSectionProps {
  subscriptions?: SubscriptionProps[];
  tradeAccounts?: { id: string; name: string }[];
}

const SubscriptionsSection = ({
  subscriptions = [
    {
      id: "sub1",
      providerName: "TraderJoe",
      signalAccountName: "Aggressive Scalper",
      trialStatus: "active" as const,
      subscriptionStatus: "active" as const,
      trialEndDate: "2025-04-02",
      tradeAccountName: "IC Markets",
      lotSize: 0.5,
      reverseMode: false,
      onlySlTpTrades: true,
    },
    {
      id: "sub2",
      providerName: "ForexMaster",
      signalAccountName: "Steady Growth",
      trialStatus: "expired" as const,
      subscriptionStatus: "active" as const,
      tradeAccountName: "IC Markets",
      lotSize: 1,
      reverseMode: false,
      onlySlTpTrades: false,
    },
    {
      id: "sub3",
      providerName: "SwingTrader",
      signalAccountName: "Trend Follower",
      trialStatus: "active" as const,
      subscriptionStatus: "active" as const,
      trialEndDate: "2025-04-10",
      tradeAccountName: "Pepperstone",
      lotSize: 2,
      reverseMode: true,
      onlySlTpTrades: true,
    },
  ],
  tradeAccounts = [
    { id: "acc1", name: "IC Markets" },
    { id: "acc2", name: "Pepperstone" },
    { id: "acc3", name: "FXCM" },
  ],
}: SubscriptionsSectionProps) => {
  const [activeTab, setActiveTab] = React.useState("all");

  const filteredSubscriptions =
    activeTab === "all"
      ? subscriptions
      : subscriptions.filter((sub) => sub.trialStatus === activeTab);

  return (
    <div className="w-full bg-background p-6 rounded-lg border border-border">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Subscriptions</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Subscription</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subscription</DialogTitle>
                <DialogDescription>
                  Select a trade account to add a new signal subscription.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="tradeAccount">Trade Account</Label>
                  <Select>
                    <SelectTrigger id="tradeAccount">
                      <SelectValue placeholder="Select trade account" />
                    </SelectTrigger>
                    <SelectContent>
                      {tradeAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Continue to Providers</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Subscriptions</TabsTrigger>
            <TabsTrigger value="active">Trial Active</TabsTrigger>
            <TabsTrigger value="expired">Trial Expired</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <SubscriptionsList subscriptions={filteredSubscriptions} />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <SubscriptionsList subscriptions={filteredSubscriptions} />
          </TabsContent>
          <TabsContent value="expired" className="mt-4">
            <SubscriptionsList subscriptions={filteredSubscriptions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const SubscriptionsList = ({
  subscriptions,
}: {
  subscriptions: SubscriptionProps[];
}) => {
  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No subscriptions found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          You don't have any subscriptions in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
};

const SubscriptionCard = ({
  subscription,
}: {
  subscription: SubscriptionProps;
}) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [lotSize, setLotSize] = React.useState(subscription.lotSize);
  const [reverseMode, setReverseMode] = React.useState(
    subscription.reverseMode,
  );
  const [onlySlTpTrades, setOnlySlTpTrades] = React.useState(
    subscription.onlySlTpTrades,
  );

  const getTrialBadge = () => {
    if (subscription.trialStatus === "active") {
      return (
        <Badge
          variant="outline"
          className="bg-green-950/20 text-green-400 border-green-800"
        >
          <Clock className="h-3 w-3 mr-1" /> Trial Active
        </Badge>
      );
    } else if (subscription.trialStatus === "expired") {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-950/20 text-yellow-400 border-yellow-800"
        >
          <AlertCircle className="h-3 w-3 mr-1" /> Trial Expired
        </Badge>
      );
    }
    return null;
  };

  const getStatusBadge = () => {
    if (subscription.subscriptionStatus === "active") {
      return (
        <Badge
          variant="outline"
          className="bg-blue-950/20 text-blue-400 border-blue-800"
        >
          <CheckCircle2 className="h-3 w-3 mr-1" /> Active
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-red-950/20 text-red-400 border-red-800"
        >
          <XCircle className="h-3 w-3 mr-1" /> Inactive
        </Badge>
      );
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {subscription.signalAccountName}
            </CardTitle>
            <CardDescription>by {subscription.providerName}</CardDescription>
          </div>
          <div className="flex gap-2">
            {getTrialBadge()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Trade Account:</span>
            <span className="font-medium">{subscription.tradeAccountName}</span>
          </div>
          {subscription.trialEndDate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trial Ends:</span>
              <span className="font-medium">{subscription.trialEndDate}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Lot Size:</span>
            <span className="font-medium">{subscription.lotSize}x</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reverse Mode:</span>
            <span className="font-medium">
              {subscription.reverseMode ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Only SL/TP Trades:</span>
            <span className="font-medium">
              {subscription.onlySlTpTrades ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-4 w-4" /> Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Copy Settings</DialogTitle>
              <DialogDescription>
                Customize how trades are copied from {subscription.providerName}
                's {subscription.signalAccountName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Lot Size Multiplier: {lotSize}x</Label>
                <Slider
                  defaultValue={[lotSize]}
                  min={0.1}
                  max={5}
                  step={0.1}
                  onValueChange={(value) => setLotSize(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Adjust the lot size multiplier for copied trades
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reverse-mode">Reverse Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Copy trades in opposite direction (Buy → Sell, Sell → Buy)
                  </p>
                </div>
                <Switch
                  id="reverse-mode"
                  checked={reverseMode}
                  onCheckedChange={setReverseMode}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sl-tp-only">Only SL/TP Trades</Label>
                  <p className="text-xs text-muted-foreground">
                    Only copy trades that have Stop Loss and Take Profit levels
                  </p>
                </div>
                <Switch
                  id="sl-tp-only"
                  checked={onlySlTpTrades}
                  onCheckedChange={setOnlySlTpTrades}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Cancel
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your subscription to{" "}
                {subscription.providerName}'s {subscription.signalAccountName}?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionsSection;
