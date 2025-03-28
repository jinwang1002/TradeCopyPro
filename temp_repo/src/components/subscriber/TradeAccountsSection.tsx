import React, { useState } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// Form schema for adding/editing trade accounts
const formSchema = z.object({
  brokerName: z.string().min(2, { message: "Broker name is required" }),
  accountId: z.string().min(1, { message: "Account ID is required" }),
  apiKey: z.string().min(1, { message: "API Key/Token is required" }),
  nickname: z.string().optional(),
});

type TradeAccount = {
  id: string;
  brokerName: string;
  accountId: string;
  apiKey: string;
  nickname?: string;
  dateAdded: string;
};

interface TradeAccountsSectionProps {
  accounts?: TradeAccount[];
  onAddAccount?: (account: Omit<TradeAccount, "id" | "dateAdded">) => void;
  onEditAccount?: (id: string, account: Partial<TradeAccount>) => void;
  onDeleteAccount?: (id: string) => void;
}

const TradeAccountsSection = ({
  accounts = [
    {
      id: "1",
      brokerName: "IC Markets",
      accountId: "12345",
      apiKey: "api_key_1",
      dateAdded: "2023-10-15",
    },
    {
      id: "2",
      brokerName: "Pepperstone",
      accountId: "67890",
      apiKey: "api_key_2",
      nickname: "Main Trading",
      dateAdded: "2023-11-20",
    },
  ],
  onAddAccount = () => {},
  onEditAccount = () => {},
  onDeleteAccount = () => {},
}: TradeAccountsSectionProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<TradeAccount | null>(
    null,
  );

  // Form for adding new accounts
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brokerName: "",
      accountId: "",
      apiKey: "",
      nickname: "",
    },
  });

  // Form for editing existing accounts
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brokerName: "",
      accountId: "",
      apiKey: "",
      nickname: "",
    },
  });

  const handleAddSubmit = (values: z.infer<typeof formSchema>) => {
    onAddAccount(values);
    form.reset();
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (values: z.infer<typeof formSchema>) => {
    if (currentAccount) {
      onEditAccount(currentAccount.id, values);
      setIsEditDialogOpen(false);
      setCurrentAccount(null);
    }
  };

  const handleEdit = (account: TradeAccount) => {
    setCurrentAccount(account);
    editForm.reset({
      brokerName: account.brokerName,
      accountId: account.accountId,
      apiKey: account.apiKey,
      nickname: account.nickname || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      onDeleteAccount(id);
    }
  };

  return (
    <Card className="w-full bg-black text-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Trade Accounts</CardTitle>
        <CardDescription>
          Manage your trading accounts for copying signals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 text-white">
              <DialogHeader>
                <DialogTitle>Add New Trading Account</DialogTitle>
                <DialogDescription>
                  Enter your trading account details to start copying signals
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="brokerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Broker Name</FormLabel>
                        <FormControl>
                          <Input placeholder="IC Markets" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the name of your broker
                        </FormDescription>
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
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your trading account ID or number
                        </FormDescription>
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
                            type="password"
                            placeholder="Your API key"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The API key for automated trading
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nickname (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Main Account" {...field} />
                        </FormControl>
                        <FormDescription>
                          A friendly name to identify this account
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Add Account</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {accounts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Broker</TableHead>
                <TableHead>Account ID</TableHead>
                <TableHead>Nickname</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    {account.brokerName}
                  </TableCell>
                  <TableCell>{account.accountId}</TableCell>
                  <TableCell>{account.nickname || "-"}</TableCell>
                  <TableCell>{account.dateAdded}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(account)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(account.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No trading accounts added yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Add your first trading account to start copying signals
            </p>
          </div>
        )}

        {/* Edit Account Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-zinc-900 text-white">
            <DialogHeader>
              <DialogTitle>Edit Trading Account</DialogTitle>
              <DialogDescription>
                Update your trading account details
              </DialogDescription>
            </DialogHeader>

            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(handleEditSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
                  name="brokerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Broker Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key/Token</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nickname (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TradeAccountsSection;
