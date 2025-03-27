import { users, User, InsertUser, signalAccounts, SignalAccount, InsertSignalAccount, 
  tradeAccounts, TradeAccount, InsertTradeAccount, subscriptions, Subscription, InsertSubscription,
  trades, Trade, InsertTrade, copyTrades, CopyTrade, InsertCopyTrade, comments, Comment, InsertComment,
  providerEarnings, ProviderEarning, InsertProviderEarning, performanceHistory, PerformanceHistory, InsertPerformanceHistory } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { addDays } from "date-fns";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateStripeInfo(userId: number, customerId: string, subscriptionId: string): Promise<User>;

  // Signal Accounts
  getSignalAccount(id: number): Promise<SignalAccount | undefined>;
  getSignalAccountsByUserId(userId: number): Promise<SignalAccount[]>;
  getAllSignalAccounts(): Promise<SignalAccount[]>;
  getTopPerformingSignalAccounts(limit: number): Promise<SignalAccount[]>;
  createSignalAccount(account: InsertSignalAccount): Promise<SignalAccount>;
  updateSignalAccountStats(id: number, returnPercent: number, winRate: number, totalTrades: number, maxDrawdown: number): Promise<SignalAccount>;

  // Trade Accounts
  getTradeAccount(id: number): Promise<TradeAccount | undefined>;
  getTradeAccountsByUserId(userId: number): Promise<TradeAccount[]>;
  createTradeAccount(account: InsertTradeAccount): Promise<TradeAccount>;

  // Subscriptions
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionsByTradeAccountId(tradeAccountId: number): Promise<Subscription[]>;
  getSubscriptionsBySignalAccountId(signalAccountId: number): Promise<Subscription[]>;
  getSubscriptionDetails(): Promise<any[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  activateSubscription(id: number): Promise<Subscription>;
  deactivateSubscription(id: number): Promise<Subscription>;
  updateSubscriptionPaymentStatus(id: number, isPaid: boolean): Promise<Subscription>;

  // Trades
  getTrade(id: number): Promise<Trade | undefined>;
  getTradesBySignalAccountId(signalAccountId: number): Promise<Trade[]>;
  getOpenTradesBySignalAccountId(signalAccountId: number): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTradeStatus(id: number, status: string, profit: number, pips: number): Promise<Trade>;

  // Copy Trades
  getCopyTrade(id: number): Promise<CopyTrade | undefined>;
  getCopyTradesByTradeAccountId(tradeAccountId: number): Promise<CopyTrade[]>;
  getOpenCopyTradesByTradeAccountId(tradeAccountId: number): Promise<CopyTrade[]>;
  createCopyTrade(copyTrade: InsertCopyTrade): Promise<CopyTrade>;
  updateCopyTradeStatus(id: number, status: string, profit: number, pips: number): Promise<CopyTrade>;

  // Comments
  getComment(id: number): Promise<Comment | undefined>;
  getCommentsBySignalAccountId(signalAccountId: number): Promise<Comment[]>;
  getGeneralComments(): Promise<Comment[]>;
  getRepliesByParentId(parentId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  incrementCommentLikes(id: number): Promise<Comment>;

  // Provider Earnings
  getProviderEarningsByUserId(userId: number): Promise<ProviderEarning[]>;
  getProviderEarningsBySignalAccountId(signalAccountId: number): Promise<ProviderEarning[]>;
  createProviderEarning(earning: InsertProviderEarning): Promise<ProviderEarning>;
  getTotalEarningsByUserId(userId: number): Promise<number>;

  // Performance History
  getPerformanceHistoryBySignalAccountId(signalAccountId: number): Promise<PerformanceHistory[]>;
  createPerformanceHistory(history: InsertPerformanceHistory): Promise<PerformanceHistory>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private signalAccounts: Map<number, SignalAccount>;
  private tradeAccounts: Map<number, TradeAccount>;
  private subscriptions: Map<number, Subscription>;
  private trades: Map<number, Trade>;
  private copyTrades: Map<number, CopyTrade>;
  private comments: Map<number, Comment>;
  private providerEarnings: Map<number, ProviderEarning>;
  private performanceHistory: Map<number, PerformanceHistory>;
  
  sessionStore: session.SessionStore;
  private currentIds: {
    users: number;
    signalAccounts: number;
    tradeAccounts: number;
    subscriptions: number;
    trades: number;
    copyTrades: number;
    comments: number;
    providerEarnings: number;
    performanceHistory: number;
  };

  constructor() {
    this.users = new Map();
    this.signalAccounts = new Map();
    this.tradeAccounts = new Map();
    this.subscriptions = new Map();
    this.trades = new Map();
    this.copyTrades = new Map();
    this.comments = new Map();
    this.providerEarnings = new Map();
    this.performanceHistory = new Map();
    
    this.currentIds = {
      users: 1,
      signalAccounts: 1,
      tradeAccounts: 1,
      subscriptions: 1,
      trades: 1,
      copyTrades: 1,
      comments: 1,
      providerEarnings: 1,
      performanceHistory: 1
    };

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });

    // Add some sample data
    this.initSampleData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now, stripeCustomerId: null, stripeSubscriptionId: null };
    this.users.set(id, user);
    return user;
  }

  async updateStripeInfo(userId: number, customerId: string, subscriptionId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const updatedUser = {
      ...user,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Signal Accounts
  async getSignalAccount(id: number): Promise<SignalAccount | undefined> {
    return this.signalAccounts.get(id);
  }

  async getSignalAccountsByUserId(userId: number): Promise<SignalAccount[]> {
    return Array.from(this.signalAccounts.values()).filter(
      (account) => account.userId === userId
    );
  }

  async getAllSignalAccounts(): Promise<SignalAccount[]> {
    return Array.from(this.signalAccounts.values());
  }

  async getTopPerformingSignalAccounts(limit: number): Promise<SignalAccount[]> {
    const accounts = Array.from(this.signalAccounts.values());
    return accounts
      .sort((a, b) => b.returnPercent - a.returnPercent)
      .slice(0, limit);
  }

  async createSignalAccount(account: InsertSignalAccount): Promise<SignalAccount> {
    const id = this.currentIds.signalAccounts++;
    const now = new Date();
    const signalAccount: SignalAccount = {
      ...account,
      id,
      returnPercent: 0,
      winRate: 0,
      totalTrades: 0,
      maxDrawdown: 0,
      createdAt: now
    };
    this.signalAccounts.set(id, signalAccount);
    return signalAccount;
  }

  async updateSignalAccountStats(id: number, returnPercent: number, winRate: number, totalTrades: number, maxDrawdown: number): Promise<SignalAccount> {
    const account = await this.getSignalAccount(id);
    if (!account) {
      throw new Error(`Signal account with ID ${id} not found`);
    }
    
    const updatedAccount = {
      ...account,
      returnPercent,
      winRate,
      totalTrades,
      maxDrawdown
    };
    
    this.signalAccounts.set(id, updatedAccount);
    return updatedAccount;
  }

  // Trade Accounts
  async getTradeAccount(id: number): Promise<TradeAccount | undefined> {
    return this.tradeAccounts.get(id);
  }

  async getTradeAccountsByUserId(userId: number): Promise<TradeAccount[]> {
    return Array.from(this.tradeAccounts.values()).filter(
      (account) => account.userId === userId
    );
  }

  async createTradeAccount(account: InsertTradeAccount): Promise<TradeAccount> {
    const id = this.currentIds.tradeAccounts++;
    const now = new Date();
    const tradeAccount: TradeAccount = { ...account, id, createdAt: now };
    this.tradeAccounts.set(id, tradeAccount);
    return tradeAccount;
  }

  // Subscriptions
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionsByTradeAccountId(tradeAccountId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (subscription) => subscription.tradeAccountId === tradeAccountId
    );
  }

  async getSubscriptionsBySignalAccountId(signalAccountId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (subscription) => subscription.signalAccountId === signalAccountId
    );
  }

  async getSubscriptionDetails(): Promise<any[]> {
    const subscriptions = Array.from(this.subscriptions.values());
    const result = [];

    for (const subscription of subscriptions) {
      const tradeAccount = await this.getTradeAccount(subscription.tradeAccountId);
      const signalAccount = await this.getSignalAccount(subscription.signalAccountId);
      const signalProvider = signalAccount ? await this.getUser(signalAccount.userId) : null;
      const subscriber = tradeAccount ? await this.getUser(tradeAccount.userId) : null;

      if (tradeAccount && signalAccount && signalProvider && subscriber) {
        result.push({
          subscription,
          tradeAccount,
          signalAccount,
          signalProvider,
          subscriber
        });
      }
    }

    return result;
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentIds.subscriptions++;
    const now = new Date();
    const trialEndDate = addDays(now, 7); // 7-day trial

    const newSubscription: Subscription = {
      ...subscription,
      id,
      trialStartDate: now,
      trialEndDate,
      isActive: true,
      isPaid: false,
      createdAt: now
    };

    this.subscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async activateSubscription(id: number): Promise<Subscription> {
    const subscription = await this.getSubscription(id);
    if (!subscription) {
      throw new Error(`Subscription with ID ${id} not found`);
    }
    
    const updatedSubscription = {
      ...subscription,
      isActive: true
    };
    
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  async deactivateSubscription(id: number): Promise<Subscription> {
    const subscription = await this.getSubscription(id);
    if (!subscription) {
      throw new Error(`Subscription with ID ${id} not found`);
    }
    
    const updatedSubscription = {
      ...subscription,
      isActive: false
    };
    
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  async updateSubscriptionPaymentStatus(id: number, isPaid: boolean): Promise<Subscription> {
    const subscription = await this.getSubscription(id);
    if (!subscription) {
      throw new Error(`Subscription with ID ${id} not found`);
    }
    
    const updatedSubscription = {
      ...subscription,
      isPaid
    };
    
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  // Trades
  async getTrade(id: number): Promise<Trade | undefined> {
    return this.trades.get(id);
  }

  async getTradesBySignalAccountId(signalAccountId: number): Promise<Trade[]> {
    return Array.from(this.trades.values()).filter(
      (trade) => trade.signalAccountId === signalAccountId
    );
  }

  async getOpenTradesBySignalAccountId(signalAccountId: number): Promise<Trade[]> {
    return Array.from(this.trades.values()).filter(
      (trade) => trade.signalAccountId === signalAccountId && trade.status === "OPEN"
    );
  }

  async createTrade(trade: InsertTrade): Promise<Trade> {
    const id = this.currentIds.trades++;
    const now = new Date();
    const newTrade: Trade = {
      ...trade,
      id,
      profit: null,
      pips: null,
      openedAt: now,
      closedAt: null
    };
    this.trades.set(id, newTrade);
    return newTrade;
  }

  async updateTradeStatus(id: number, status: string, profit: number, pips: number): Promise<Trade> {
    const trade = await this.getTrade(id);
    if (!trade) {
      throw new Error(`Trade with ID ${id} not found`);
    }
    
    const now = new Date();
    const updatedTrade = {
      ...trade,
      status,
      profit,
      pips,
      closedAt: status === "CLOSED" ? now : null
    };
    
    this.trades.set(id, updatedTrade);
    return updatedTrade;
  }

  // Copy Trades
  async getCopyTrade(id: number): Promise<CopyTrade | undefined> {
    return this.copyTrades.get(id);
  }

  async getCopyTradesByTradeAccountId(tradeAccountId: number): Promise<CopyTrade[]> {
    return Array.from(this.copyTrades.values()).filter(
      (copyTrade) => copyTrade.tradeAccountId === tradeAccountId
    );
  }

  async getOpenCopyTradesByTradeAccountId(tradeAccountId: number): Promise<CopyTrade[]> {
    return Array.from(this.copyTrades.values()).filter(
      (copyTrade) => copyTrade.tradeAccountId === tradeAccountId && copyTrade.status === "OPEN"
    );
  }

  async createCopyTrade(copyTrade: InsertCopyTrade): Promise<CopyTrade> {
    const id = this.currentIds.copyTrades++;
    const now = new Date();
    const newCopyTrade: CopyTrade = {
      ...copyTrade,
      id,
      profit: null,
      pips: null,
      openedAt: now,
      closedAt: null
    };
    this.copyTrades.set(id, newCopyTrade);
    return newCopyTrade;
  }

  async updateCopyTradeStatus(id: number, status: string, profit: number, pips: number): Promise<CopyTrade> {
    const copyTrade = await this.getCopyTrade(id);
    if (!copyTrade) {
      throw new Error(`Copy trade with ID ${id} not found`);
    }
    
    const now = new Date();
    const updatedCopyTrade = {
      ...copyTrade,
      status,
      profit,
      pips,
      closedAt: status === "CLOSED" ? now : null
    };
    
    this.copyTrades.set(id, updatedCopyTrade);
    return updatedCopyTrade;
  }

  // Comments
  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async getCommentsBySignalAccountId(signalAccountId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.signalAccountId === signalAccountId && !comment.parentId
    );
  }

  async getGeneralComments(): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.isGeneral && !comment.parentId
    );
  }

  async getRepliesByParentId(parentId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.parentId === parentId
    );
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.currentIds.comments++;
    const now = new Date();
    const newComment: Comment = { ...comment, id, likes: 0, createdAt: now };
    this.comments.set(id, newComment);
    return newComment;
  }

  async incrementCommentLikes(id: number): Promise<Comment> {
    const comment = await this.getComment(id);
    if (!comment) {
      throw new Error(`Comment with ID ${id} not found`);
    }
    
    const updatedComment = {
      ...comment,
      likes: comment.likes + 1
    };
    
    this.comments.set(id, updatedComment);
    return updatedComment;
  }

  // Provider Earnings
  async getProviderEarningsByUserId(userId: number): Promise<ProviderEarning[]> {
    return Array.from(this.providerEarnings.values()).filter(
      (earning) => earning.userId === userId
    );
  }

  async getProviderEarningsBySignalAccountId(signalAccountId: number): Promise<ProviderEarning[]> {
    return Array.from(this.providerEarnings.values()).filter(
      (earning) => earning.signalAccountId === signalAccountId
    );
  }

  async createProviderEarning(earning: InsertProviderEarning): Promise<ProviderEarning> {
    const id = this.currentIds.providerEarnings++;
    const now = new Date();
    const newEarning: ProviderEarning = { ...earning, id, createdAt: now };
    this.providerEarnings.set(id, newEarning);
    return newEarning;
  }

  async getTotalEarningsByUserId(userId: number): Promise<number> {
    const earnings = await this.getProviderEarningsByUserId(userId);
    return earnings.reduce((total, earning) => total + earning.amount, 0);
  }

  // Performance History
  async getPerformanceHistoryBySignalAccountId(signalAccountId: number): Promise<PerformanceHistory[]> {
    return Array.from(this.performanceHistory.values()).filter(
      (history) => history.signalAccountId === signalAccountId
    );
  }

  async createPerformanceHistory(history: InsertPerformanceHistory): Promise<PerformanceHistory> {
    const id = this.currentIds.performanceHistory++;
    const newHistory: PerformanceHistory = { ...history, id };
    this.performanceHistory.set(id, newHistory);
    return newHistory;
  }

  // Initialize sample data for development
  private async initSampleData() {
    // Sample users
    const provider1 = await this.createUser({
      username: "traderryan",
      password: "$2b$10$JfRDnrhUHMZKFRN0Ab7Xz.lxAE5tl5IZsKP.wkTCVE7HhX3cgiA16", // hashed "password123"
      displayName: "TraderRyan",
      email: "ryan@example.com",
      role: "provider"
    });

    const provider2 = await this.createUser({
      username: "forexmaster",
      password: "$2b$10$JfRDnrhUHMZKFRN0Ab7Xz.lxAE5tl5IZsKP.wkTCVE7HhX3cgiA16",
      displayName: "ForexMaster",
      email: "forex@example.com",
      role: "provider"
    });

    const provider3 = await this.createUser({
      username: "tradingpro",
      password: "$2b$10$JfRDnrhUHMZKFRN0Ab7Xz.lxAE5tl5IZsKP.wkTCVE7HhX3cgiA16",
      displayName: "TradingPro",
      email: "pro@example.com",
      role: "provider"
    });

    const subscriber1 = await this.createUser({
      username: "traderjoe",
      password: "$2b$10$JfRDnrhUHMZKFRN0Ab7Xz.lxAE5tl5IZsKP.wkTCVE7HhX3cgiA16",
      displayName: "TraderJoe",
      email: "joe@example.com",
      role: "subscriber"
    });

    // Sample signal accounts
    const signalAccount1 = await this.createSignalAccount({
      userId: provider1.id,
      nickname: "Aggressive Scalper",
      description: "High-risk, short-term trades on EUR/USD",
      accountId: "AS12345",
      brokerName: "IC Markets",
      apiKey: "api_key_1"
    });
    await this.updateSignalAccountStats(signalAccount1.id, 150, 76, 248, 12);

    const signalAccount2 = await this.createSignalAccount({
      userId: provider2.id,
      nickname: "Steady Growth",
      description: "Low-risk, medium-term trades with consistent returns",
      accountId: "SG67890",
      brokerName: "Pepperstone",
      apiKey: "api_key_2"
    });
    await this.updateSignalAccountStats(signalAccount2.id, 125, 81, 189, 8);

    const signalAccount3 = await this.createSignalAccount({
      userId: provider3.id,
      nickname: "Trend Follower",
      description: "Follows major market trends across multiple pairs",
      accountId: "TF24680",
      brokerName: "Oanda",
      apiKey: "api_key_3"
    });
    await this.updateSignalAccountStats(signalAccount3.id, 112, 72, 201, 15);

    // Sample trade accounts
    const tradeAccount1 = await this.createTradeAccount({
      userId: subscriber1.id,
      brokerName: "IC Markets",
      accountId: "12345",
      apiKey: "subscriber_api_key_1"
    });

    const tradeAccount2 = await this.createTradeAccount({
      userId: subscriber1.id,
      brokerName: "Pepperstone",
      accountId: "67890",
      apiKey: "subscriber_api_key_2"
    });

    // Sample subscriptions
    const sub1 = await this.createSubscription({
      tradeAccountId: tradeAccount1.id,
      signalAccountId: signalAccount1.id,
      lotSizeMultiplier: 1,
      reverseCopy: false,
      onlySlTpTrades: true
    });
    
    const sub2 = await this.createSubscription({
      tradeAccountId: tradeAccount1.id,
      signalAccountId: signalAccount2.id,
      lotSizeMultiplier: 1,
      reverseCopy: false,
      onlySlTpTrades: true
    });
    await this.updateSubscriptionPaymentStatus(sub2.id, true);
    
    const sub3 = await this.createSubscription({
      tradeAccountId: tradeAccount2.id,
      signalAccountId: signalAccount3.id,
      lotSizeMultiplier: 0.5,
      reverseCopy: false,
      onlySlTpTrades: false
    });

    // Sample trades
    const trade1 = await this.createTrade({
      signalAccountId: signalAccount1.id,
      pair: "EUR/USD",
      type: "BUY",
      entryPrice: 1.1000,
      stopLoss: 1.0950,
      takeProfit: 1.1100,
      lotSize: 1,
      status: "OPEN"
    });

    const trade2 = await this.createTrade({
      signalAccountId: signalAccount2.id,
      pair: "GBP/USD",
      type: "SELL",
      entryPrice: 1.3000,
      stopLoss: 1.3050,
      takeProfit: 1.2900,
      lotSize: 0.5,
      status: "CLOSED"
    });
    await this.updateTradeStatus(trade2.id, "CLOSED", 50, 30);

    const trade3 = await this.createTrade({
      signalAccountId: signalAccount1.id,
      pair: "USD/JPY",
      type: "BUY",
      entryPrice: 149.50,
      stopLoss: 149.00,
      takeProfit: 150.50,
      lotSize: 0.8,
      status: "OPEN"
    });

    // Sample copy trades
    await this.createCopyTrade({
      tradeId: trade1.id,
      tradeAccountId: tradeAccount1.id,
      subscriptionId: sub1.id,
      type: "BUY",
      entryPrice: 1.1000,
      stopLoss: 1.0950,
      takeProfit: 1.1100,
      lotSize: 1,
      status: "OPEN"
    });

    await this.createCopyTrade({
      tradeId: trade2.id,
      tradeAccountId: tradeAccount1.id,
      subscriptionId: sub2.id,
      type: "SELL",
      entryPrice: 1.3000,
      stopLoss: 1.3050,
      takeProfit: 1.2900,
      lotSize: 0.5,
      status: "CLOSED"
    });

    await this.createCopyTrade({
      tradeId: trade3.id,
      tradeAccountId: tradeAccount1.id,
      subscriptionId: sub1.id,
      type: "BUY",
      entryPrice: 149.50,
      stopLoss: 149.00,
      takeProfit: 150.50,
      lotSize: 0.8,
      status: "OPEN"
    });

    // Sample comments
    const comment1 = await this.createComment({
      userId: provider2.id,
      content: "Just shared my latest analysis on EUR/USD. Check out my Steady Growth signal if you're looking for consistent returns!",
      isGeneral: true,
      signalAccountId: null,
      parentId: null
    });
    await this.incrementCommentLikes(comment1.id);
    await this.incrementCommentLikes(comment1.id);
    await this.incrementCommentLikes(comment1.id);
    await this.incrementCommentLikes(comment1.id);
    await this.incrementCommentLikes(comment1.id);
    await this.incrementCommentLikes(comment1.id);
    await this.incrementCommentLikes(comment1.id);
    await this.incrementCommentLikes(comment1.id);
    await this.incrementCommentLikes(comment1.id);
    await this.incrementCommentLikes(comment1.id);
    await this.incrementCommentLikes(comment1.id);
    await this.incrementCommentLikes(comment1.id);

    const comment2 = await this.createComment({
      userId: provider1.id,
      content: "Great platform! Been using it for 3 months and my subscribers are really happy with the results so far.",
      isGeneral: true,
      signalAccountId: null,
      parentId: null
    });
    await this.incrementCommentLikes(comment2.id);
    await this.incrementCommentLikes(comment2.id);
    await this.incrementCommentLikes(comment2.id);
    await this.incrementCommentLikes(comment2.id);
    await this.incrementCommentLikes(comment2.id);
    await this.incrementCommentLikes(comment2.id);
    await this.incrementCommentLikes(comment2.id);
    await this.incrementCommentLikes(comment2.id);

    await this.createComment({
      userId: subscriber1.id,
      content: "I'm one of your subscribers - the returns have been amazing! Looking forward to what's next.",
      isGeneral: true,
      signalAccountId: null,
      parentId: comment2.id
    });

    // Sample performance history (last 6 months)
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - 5 + i);
      
      await this.createPerformanceHistory({
        signalAccountId: signalAccount1.id,
        date,
        returnPercent: i === 0 ? 0 : 35 + (i - 1) * 25
      });
      
      await this.createPerformanceHistory({
        signalAccountId: signalAccount2.id,
        date,
        returnPercent: i === 0 ? 0 : 20 + (i - 1) * 22
      });
      
      await this.createPerformanceHistory({
        signalAccountId: signalAccount3.id,
        date,
        returnPercent: i === 0 ? 0 : 15 + (i - 1) * 20
      });
    }

    // Sample provider earnings
    await this.createProviderEarning({
      userId: provider1.id,
      signalAccountId: signalAccount1.id,
      amount: 50,
      type: "SUBSCRIPTION"
    });

    await this.createProviderEarning({
      userId: provider1.id,
      signalAccountId: signalAccount1.id,
      amount: 100,
      type: "PERFORMANCE_BONUS"
    });

    await this.createProviderEarning({
      userId: provider2.id,
      signalAccountId: signalAccount2.id,
      amount: 70,
      type: "SUBSCRIPTION"
    });
  }
}

export const storage = new MemStorage();
