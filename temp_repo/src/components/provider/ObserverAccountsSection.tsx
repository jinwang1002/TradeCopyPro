import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Edit, Trash2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  nickname: z.string().min(2, {
    message: "Nickname must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  accountId: z.string().min(1, {
    message: "Account ID is required.",
  }),
  brokerName: z.string().min(1, {
    message: "Broker name is required.",
  }),
  apiKey: z.string().min(1, {
    message: "API Key/Token is required.",
  }),
});

type ObserverAccount = {
  id: string;
  nickname: string;
  description: string;
  accountId: string;
  brokerName: string;
  apiKey: string;
  createdAt: string;
};

interface ObserverAccountsSectionProps {
  accounts?: ObserverAccount[];
  onAddAccount?: (account: Omit<ObserverAccount, "id" | "createdAt">) => void;
  onEditAccount?: (id: string, account: Partial<ObserverAccount>) => void;
  onDeleteAccount?: (id: string) => void;
}

const ObserverAccountsSection = ({
  accounts = [
    {
      id: "1",
      nickname: "Aggressive Scalper",
      description: "High-risk, short-term trades on EUR/USD",
      accountId: "MT4-12345",
      brokerName: "IC Markets",
      apiKey: "api_key_123456",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      nickname: "Conservative Swing",
      description: "Low-risk, long-term trades on major pairs",
      accountId: "MT5-67890",
      brokerName: "Pepperstone",
      apiKey: "api_key_789012",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  onAddAccount = () => {},
  onEditAccount = () => {},
  onDeleteAccount = () => {},
}: ObserverAccountsSectionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      description: "",
      accountId: "",
      brokerName: "",
      apiKey: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingAccountId) {
      onEditAccount(editingAccountId, values);
      setEditingAccountId(null);
    } else {
      onAddAccount(values);
      setShowAddForm(false);
    }
    form.reset();
  };

  const startEditing = (account: ObserverAccount) => {
    setEditingAccountId(account.id);
    form.reset({
      nickname: account.nickname,
      description: account.description,
      accountId: account.accountId,
      brokerName: account.brokerName,
      apiKey: account.apiKey,
    });
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingAccountId(null);
    form.reset();
  };

  const toggleApiKeyVisibility = (accountId: string) => {
    setShowApiKey((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  return (
    <div className="w-full bg-black text-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Observer Accounts</h2>
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Add Observer Account
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card className="mb-6 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>
              {editingAccountId ? "Edit" : "Add"} Observer Account
            </CardTitle>
            <CardDescription>
              {editingAccountId
                ? "Update your observer account details"
                : "Add a new observer account to share your trading signals"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Nickname</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Aggressive Scalper"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for this trading strategy
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brokerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Broker Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. IC Markets" {...field} />
                        </FormControl>
                        <FormDescription>
                          The broker where this account is hosted
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. High-risk, short-term trades on EUR/USD"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe your trading strategy to potential subscribers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MT4-12345" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your trading account identifier
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
                            placeholder="Your API key or token"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Secure key to access your trading account
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={cancelForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAccountId ? "Update" : "Add"} Account
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {account.nickname}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {account.brokerName} • Account ID: {account.accountId}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(account)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteAccount(account.id)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{account.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Broker</p>
                    <p className="font-medium">{account.brokerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Account ID</p>
                    <p className="font-medium">{account.accountId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">API Key/Token</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium font-mono">
                        {showApiKey[account.id]
                          ? account.apiKey
                          : "••••••••••••••••"}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleApiKeyVisibility(account.id)}
                      >
                        {showApiKey[account.id] ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Added On</p>
                    <p className="font-medium">
                      {new Date(account.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800 p-8 text-center">
          <p className="text-gray-400 mb-4">No observer accounts added yet</p>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)}>
              Add Your First Observer Account
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default ObserverAccountsSection;
