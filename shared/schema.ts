import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  role: true,
});

// Signal Account (for signal providers)
export const signalAccounts = pgTable("signal_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  nickname: text("nickname").notNull(),
  description: text("description").notNull(),
  accountId: text("account_id").notNull(),
  brokerName: text("broker_name").notNull(),
  apiKey: text("api_key").notNull(),
  returnPercent: doublePrecision("return_percent").notNull().default(0),
  winRate: doublePrecision("win_rate").notNull().default(0),
  totalTrades: integer("total_trades").notNull().default(0),
  maxDrawdown: doublePrecision("max_drawdown").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSignalAccountSchema = createInsertSchema(signalAccounts).pick({
  userId: true,
  nickname: true,
  description: true,
  accountId: true,
  brokerName: true,
  apiKey: true,
});

// Trade Account (for subscribers)
export const tradeAccounts = pgTable("trade_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  brokerName: text("broker_name").notNull(),
  accountId: text("account_id").notNull(),
  apiKey: text("api_key").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTradeAccountSchema = createInsertSchema(tradeAccounts).pick({
  userId: true,
  brokerName: true,
  accountId: true,
  apiKey: true,
});

// Subscription (mapping between trade accounts and signal accounts)
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  tradeAccountId: integer("trade_account_id").notNull(),
  signalAccountId: integer("signal_account_id").notNull(),
  lotSizeMultiplier: doublePrecision("lot_size_multiplier").notNull().default(1),
  reverseCopy: boolean("reverse_copy").notNull().default(false),
  onlySlTpTrades: boolean("only_sl_tp_trades").notNull().default(true),
  trialStartDate: timestamp("trial_start_date").notNull().defaultNow(),
  trialEndDate: timestamp("trial_end_date"),
  isActive: boolean("is_active").notNull().default(true),
  isPaid: boolean("is_paid").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  tradeAccountId: true,
  signalAccountId: true,
  lotSizeMultiplier: true,
  reverseCopy: true,
  onlySlTpTrades: true,
});

// Trade
export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  signalAccountId: integer("signal_account_id").notNull(),
  pair: text("pair").notNull(),
  type: text("type").notNull(), // "BUY" or "SELL"
  entryPrice: doublePrecision("entry_price").notNull(),
  stopLoss: doublePrecision("stop_loss"),
  takeProfit: doublePrecision("take_profit"),
  lotSize: doublePrecision("lot_size").notNull(),
  status: text("status").notNull(), // "OPEN" or "CLOSED"
  profit: doublePrecision("profit"),
  pips: doublePrecision("pips"),
  openedAt: timestamp("opened_at").notNull().defaultNow(),
  closedAt: timestamp("closed_at"),
});

export const insertTradeSchema = createInsertSchema(trades).pick({
  signalAccountId: true,
  pair: true,
  type: true,
  entryPrice: true,
  stopLoss: true,
  takeProfit: true,
  lotSize: true,
  status: true,
});

// Copy Trade (mapping between trades and trade accounts)
export const copyTrades = pgTable("copy_trades", {
  id: serial("id").primaryKey(),
  tradeId: integer("trade_id").notNull(),
  tradeAccountId: integer("trade_account_id").notNull(),
  subscriptionId: integer("subscription_id").notNull(),
  type: text("type").notNull(), // "BUY" or "SELL" (could be reversed from original trade)
  entryPrice: doublePrecision("entry_price").notNull(),
  stopLoss: doublePrecision("stop_loss"),
  takeProfit: doublePrecision("take_profit"),
  lotSize: doublePrecision("lot_size").notNull(),
  status: text("status").notNull(), // "OPEN" or "CLOSED"
  profit: doublePrecision("profit"),
  pips: doublePrecision("pips"),
  openedAt: timestamp("opened_at").notNull().defaultNow(),
  closedAt: timestamp("closed_at"),
});

export const insertCopyTradeSchema = createInsertSchema(copyTrades).pick({
  tradeId: true,
  tradeAccountId: true,
  subscriptionId: true,
  type: true,
  entryPrice: true,
  stopLoss: true,
  takeProfit: true,
  lotSize: true,
  status: true,
});

// Comments
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  signalAccountId: integer("signal_account_id"),
  content: text("content").notNull(),
  isGeneral: boolean("is_general").notNull().default(false),
  parentId: integer("parent_id"),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  userId: true,
  signalAccountId: true,
  content: true,
  isGeneral: true,
  parentId: true,
});

// Provider Earnings
export const providerEarnings = pgTable("provider_earnings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  signalAccountId: integer("signal_account_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  type: text("type").notNull(), // "SUBSCRIPTION" or "PERFORMANCE_BONUS"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProviderEarningSchema = createInsertSchema(providerEarnings).pick({
  userId: true,
  signalAccountId: true,
  amount: true,
  type: true,
});

// Historical Performance Data
export const performanceHistory = pgTable("performance_history", {
  id: serial("id").primaryKey(),
  signalAccountId: integer("signal_account_id").notNull(),
  date: timestamp("date").notNull(),
  returnPercent: doublePrecision("return_percent").notNull(),
});

export const insertPerformanceHistorySchema = createInsertSchema(performanceHistory).pick({
  signalAccountId: true,
  date: true,
  returnPercent: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SignalAccount = typeof signalAccounts.$inferSelect;
export type InsertSignalAccount = z.infer<typeof insertSignalAccountSchema>;

export type TradeAccount = typeof tradeAccounts.$inferSelect;
export type InsertTradeAccount = z.infer<typeof insertTradeAccountSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;

export type CopyTrade = typeof copyTrades.$inferSelect;
export type InsertCopyTrade = z.infer<typeof insertCopyTradeSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type ProviderEarning = typeof providerEarnings.$inferSelect;
export type InsertProviderEarning = z.infer<typeof insertProviderEarningSchema>;

export type PerformanceHistory = typeof performanceHistory.$inferSelect;
export type InsertPerformanceHistory = z.infer<typeof insertPerformanceHistorySchema>;
