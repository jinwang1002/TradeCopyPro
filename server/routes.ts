import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertSignalAccountSchema, insertTradeAccountSchema, insertSubscriptionSchema, insertCommentSchema } from "@shared/schema";
import { addDays, isPast } from "date-fns";
import { z } from "zod";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Signal Accounts API
  app.get("/api/signal-accounts", async (req, res) => {
    try {
      const accounts = await storage.getAllSignalAccounts();
      res.json(accounts);
    } catch (err) {
      res.status(500).json({ message: "Error fetching signal accounts" });
    }
  });
  
  // Provider-specific APIs
  app.get("/api/users/:userId/signal-accounts", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = parseInt(req.params.userId);
      
      // Verify user has access to this data
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const accounts = await storage.getSignalAccountsByUserId(userId);
      res.json(accounts);
    } catch (err) {
      res.status(500).json({ message: "Error fetching user signal accounts" });
    }
  });
  
  app.get("/api/users/:userId/trades", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = parseInt(req.params.userId);
      
      // Verify user has access to this data
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get signal accounts for this user
      const accounts = await storage.getSignalAccountsByUserId(userId);
      
      // Get trades for each signal account
      const trades = [];
      for (const account of accounts) {
        const accountTrades = await storage.getTradesBySignalAccountId(account.id);
        trades.push(...accountTrades);
      }
      
      // Sort trades by date (newest first)
      trades.sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());
      
      res.json(trades);
    } catch (err) {
      res.status(500).json({ message: "Error fetching user trades" });
    }
  });
  
  app.get("/api/users/:userId/subscribers", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = parseInt(req.params.userId);
      
      // Verify user has access to this data
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get signal accounts for this user
      const accounts = await storage.getSignalAccountsByUserId(userId);
      
      // Get subscriptions for each signal account
      const subscribers = [];
      for (const account of accounts) {
        const subscriptions = await storage.getSubscriptionsBySignalAccountId(account.id);
        // Get additional data for each subscription
        for (const subscription of subscriptions) {
          const tradeAccount = await storage.getTradeAccount(subscription.tradeAccountId);
          if (tradeAccount) {
            subscribers.push({
              ...subscription,
              signalAccountId: account.id,
              signalAccountName: account.nickname,
              accountBalance: Math.floor(Math.random() * 10000) + 5000, // Simulated balance
              tradeAccount
            });
          }
        }
      }
      
      res.json(subscribers);
    } catch (err) {
      res.status(500).json({ message: "Error fetching subscribers" });
    }
  });
  
  app.get("/api/users/:userId/earnings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = parseInt(req.params.userId);
      
      // Verify user has access to this data
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const earnings = await storage.getProviderEarningsByUserId(userId);
      res.json(earnings);
    } catch (err) {
      res.status(500).json({ message: "Error fetching provider earnings" });
    }
  });
  
  app.get("/api/users/:userId/performance", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = parseInt(req.params.userId);
      
      // Verify user has access to this data
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get signal accounts for this user
      const accounts = await storage.getSignalAccountsByUserId(userId);
      
      // Get performance data for each account
      const performanceData = [];
      for (const account of accounts) {
        const history = await storage.getPerformanceHistoryBySignalAccountId(account.id);
        performanceData.push(...history);
      }
      
      // Average the performance data by date
      const performanceByDate = {};
      
      for (const entry of performanceData) {
        const dateStr = new Date(entry.date).toLocaleDateString();
        if (!performanceByDate[dateStr]) {
          performanceByDate[dateStr] = { date: dateStr, total: 0, count: 0 };
        }
        performanceByDate[dateStr].total += entry.value;
        performanceByDate[dateStr].count += 1;
      }
      
      // Convert to array and calculate averages
      const result = Object.values(performanceByDate).map((entry: any) => ({
        date: entry.date,
        value: entry.total / entry.count
      }));
      
      // Sort by date
      result.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Error fetching performance data" });
    }
  });

  app.get("/api/signal-accounts/top", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const accounts = await storage.getTopPerformingSignalAccounts(limit);
      res.json(accounts);
    } catch (err) {
      res.status(500).json({ message: "Error fetching top signal accounts" });
    }
  });

  app.get("/api/signal-accounts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const account = await storage.getSignalAccount(id);
      
      if (!account) {
        return res.status(404).json({ message: "Signal account not found" });
      }
      
      res.json(account);
    } catch (err) {
      res.status(500).json({ message: "Error fetching signal account" });
    }
  });



  app.post("/api/signal-accounts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validation = insertSignalAccountSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.format() });
      }
      
      const data = validation.data;
      const account = await storage.createSignalAccount({
        ...data,
        userId: req.user.id
      });
      
      res.status(201).json(account);
    } catch (err) {
      res.status(500).json({ message: "Error creating signal account" });
    }
  });

  // Trade Accounts API
  app.get("/api/trade-accounts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const accounts = await storage.getTradeAccountsByUserId(req.user.id);
      res.json(accounts);
    } catch (err) {
      res.status(500).json({ message: "Error fetching trade accounts" });
    }
  });

  app.post("/api/trade-accounts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validation = insertTradeAccountSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.format() });
      }
      
      const data = validation.data;
      const account = await storage.createTradeAccount({
        ...data,
        userId: req.user.id
      });
      
      res.status(201).json(account);
    } catch (err) {
      res.status(500).json({ message: "Error creating trade account" });
    }
  });

  // Subscriptions API
  app.get("/api/subscriptions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Find all trade accounts for this user
      const tradeAccounts = await storage.getTradeAccountsByUserId(req.user.id);
      const tradeAccountIds = tradeAccounts.map(account => account.id);
      
      // Get all subscriptions for these trade accounts
      const results = [];
      for (const accountId of tradeAccountIds) {
        const subs = await storage.getSubscriptionsByTradeAccountId(accountId);
        results.push(...subs);
      }
      
      // Fetch additional data for each subscription
      const detailedSubscriptions = await Promise.all(
        results.map(async sub => {
          const signalAccount = await storage.getSignalAccount(sub.signalAccountId);
          const provider = signalAccount ? await storage.getUser(signalAccount.userId) : null;
          const tradeAccount = await storage.getTradeAccount(sub.tradeAccountId);
          
          return {
            subscription: sub,
            signalAccount,
            provider: provider ? {
              id: provider.id,
              username: provider.username,
              displayName: provider.displayName
            } : null,
            tradeAccount
          };
        })
      );
      
      res.json(detailedSubscriptions);
    } catch (err) {
      res.status(500).json({ message: "Error fetching subscriptions" });
    }
  });

  app.post("/api/subscriptions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validation = insertSubscriptionSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.format() });
      }
      
      const data = validation.data;
      
      // Verify that the trade account belongs to the current user
      const tradeAccount = await storage.getTradeAccount(data.tradeAccountId);
      if (!tradeAccount || tradeAccount.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this trade account" });
      }
      
      // Check if a subscription already exists
      const existingSubscriptions = await storage.getSubscriptionsByTradeAccountId(data.tradeAccountId);
      const existingSub = existingSubscriptions.find(sub => sub.signalAccountId === data.signalAccountId);
      
      if (existingSub) {
        return res.status(400).json({ message: "Subscription already exists for this signal account" });
      }
      
      const subscription = await storage.createSubscription(data);
      res.status(201).json(subscription);
    } catch (err) {
      res.status(500).json({ message: "Error creating subscription" });
    }
  });

  app.put("/api/subscriptions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const { isActive } = req.body;
      
      // Verify subscription exists and belongs to user
      const subscription = await storage.getSubscription(id);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      const tradeAccount = await storage.getTradeAccount(subscription.tradeAccountId);
      if (!tradeAccount || tradeAccount.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this subscription" });
      }
      
      let updatedSubscription;
      if (isActive) {
        updatedSubscription = await storage.activateSubscription(id);
      } else {
        updatedSubscription = await storage.deactivateSubscription(id);
      }
      
      res.json(updatedSubscription);
    } catch (err) {
      res.status(500).json({ message: "Error updating subscription" });
    }
  });

  // Trades API
  app.get("/api/signal-accounts/:id/trades", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trades = await storage.getTradesBySignalAccountId(id);
      res.json(trades);
    } catch (err) {
      res.status(500).json({ message: "Error fetching trades" });
    }
  });

  app.get("/api/signal-accounts/:id/open-trades", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trades = await storage.getOpenTradesBySignalAccountId(id);
      res.json(trades);
    } catch (err) {
      res.status(500).json({ message: "Error fetching open trades" });
    }
  });

  // Copy Trades API
  app.get("/api/trade-accounts/:id/copy-trades", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      
      // Verify trade account belongs to user
      const tradeAccount = await storage.getTradeAccount(id);
      if (!tradeAccount || tradeAccount.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this trade account" });
      }
      
      const trades = await storage.getCopyTradesByTradeAccountId(id);
      
      // Fetch additional data for each trade
      const detailedTrades = await Promise.all(
        trades.map(async copyTrade => {
          const subscription = await storage.getSubscription(copyTrade.subscriptionId);
          const signalAccount = subscription ? await storage.getSignalAccount(subscription.signalAccountId) : null;
          
          return {
            ...copyTrade,
            signalAccount: signalAccount ? {
              id: signalAccount.id,
              nickname: signalAccount.nickname
            } : null
          };
        })
      );
      
      res.json(detailedTrades);
    } catch (err) {
      res.status(500).json({ message: "Error fetching copy trades" });
    }
  });

  app.get("/api/trade-accounts/:id/open-copy-trades", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      
      // Verify trade account belongs to user
      const tradeAccount = await storage.getTradeAccount(id);
      if (!tradeAccount || tradeAccount.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this trade account" });
      }
      
      const trades = await storage.getOpenCopyTradesByTradeAccountId(id);
      
      // Fetch additional data for each trade
      const detailedTrades = await Promise.all(
        trades.map(async copyTrade => {
          const subscription = await storage.getSubscription(copyTrade.subscriptionId);
          const signalAccount = subscription ? await storage.getSignalAccount(subscription.signalAccountId) : null;
          
          return {
            ...copyTrade,
            signalAccount: signalAccount ? {
              id: signalAccount.id,
              nickname: signalAccount.nickname
            } : null
          };
        })
      );
      
      res.json(detailedTrades);
    } catch (err) {
      res.status(500).json({ message: "Error fetching open copy trades" });
    }
  });

  // Comments API
  app.get("/api/comments/general", async (req, res) => {
    try {
      const comments = await storage.getGeneralComments();
      
      // Fetch user data and replies for each comment
      const detailedComments = await Promise.all(
        comments.map(async comment => {
          const user = await storage.getUser(comment.userId);
          const replies = await storage.getRepliesByParentId(comment.id);
          
          // Get user data for each reply
          const detailedReplies = await Promise.all(
            replies.map(async reply => {
              const replyUser = await storage.getUser(reply.userId);
              return {
                ...reply,
                user: replyUser ? {
                  id: replyUser.id,
                  username: replyUser.username,
                  displayName: replyUser.displayName
                } : null
              };
            })
          );
          
          return {
            ...comment,
            user: user ? {
              id: user.id,
              username: user.username,
              displayName: user.displayName
            } : null,
            replies: detailedReplies
          };
        })
      );
      
      res.json(detailedComments);
    } catch (err) {
      res.status(500).json({ message: "Error fetching comments" });
    }
  });

  app.get("/api/signal-accounts/:id/comments", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const comments = await storage.getCommentsBySignalAccountId(id);
      
      // Fetch user data and replies for each comment
      const detailedComments = await Promise.all(
        comments.map(async comment => {
          const user = await storage.getUser(comment.userId);
          const replies = await storage.getRepliesByParentId(comment.id);
          
          // Get user data for each reply
          const detailedReplies = await Promise.all(
            replies.map(async reply => {
              const replyUser = await storage.getUser(reply.userId);
              return {
                ...reply,
                user: replyUser ? {
                  id: replyUser.id,
                  username: replyUser.username,
                  displayName: replyUser.displayName
                } : null
              };
            })
          );
          
          return {
            ...comment,
            user: user ? {
              id: user.id,
              username: user.username,
              displayName: user.displayName
            } : null,
            replies: detailedReplies
          };
        })
      );
      
      res.json(detailedComments);
    } catch (err) {
      res.status(500).json({ message: "Error fetching comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validation = insertCommentSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.format() });
      }
      
      const data = validation.data;
      const comment = await storage.createComment({
        ...data,
        userId: req.user.id
      });
      
      // Fetch user data for the response
      const user = await storage.getUser(comment.userId);
      
      res.status(201).json({
        ...comment,
        user: user ? {
          id: user.id,
          username: user.username,
          displayName: user.displayName
        } : null,
        replies: []
      });
    } catch (err) {
      res.status(500).json({ message: "Error creating comment" });
    }
  });

  app.post("/api/comments/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const comment = await storage.incrementCommentLikes(id);
      res.json(comment);
    } catch (err) {
      res.status(500).json({ message: "Error liking comment" });
    }
  });

  // Performance History API
  app.get("/api/signal-accounts/:id/performance", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const history = await storage.getPerformanceHistoryBySignalAccountId(id);
      
      // Sort by date ascending
      history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      res.json(history);
    } catch (err) {
      res.status(500).json({ message: "Error fetching performance history" });
    }
  });

  // Provider Earnings API
  app.get("/api/provider/earnings", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "provider") {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      const earnings = await storage.getProviderEarningsByUserId(req.user.id);
      const total = await storage.getTotalEarningsByUserId(req.user.id);
      
      // Group by signal account and type
      const signalAccounts = await storage.getSignalAccountsByUserId(req.user.id);
      
      const detailedEarnings = await Promise.all(
        signalAccounts.map(async account => {
          const accountEarnings = earnings.filter(e => e.signalAccountId === account.id);
          const subscriptionEarnings = accountEarnings.filter(e => e.type === "SUBSCRIPTION");
          const bonusEarnings = accountEarnings.filter(e => e.type === "PERFORMANCE_BONUS");
          
          return {
            signalAccount: account,
            subscriptionTotal: subscriptionEarnings.reduce((sum, e) => sum + e.amount, 0),
            bonusTotal: bonusEarnings.reduce((sum, e) => sum + e.amount, 0),
            total: accountEarnings.reduce((sum, e) => sum + e.amount, 0)
          };
        })
      );
      
      res.json({
        total,
        accounts: detailedEarnings
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching earnings" });
    }
  });

  // Stripe Payment API
  app.post("/api/create-subscription-session", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { subscriptionId } = req.body;
      
      if (!subscriptionId) {
        return res.status(400).json({ message: "Subscription ID is required" });
      }
      
      // Get subscription details
      const subscription = await storage.getSubscription(parseInt(subscriptionId));
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      // Check if trial has expired
      const now = new Date();
      const trialHasExpired = subscription.trialEndDate && isPast(new Date(subscription.trialEndDate));
      
      // If paid, no need to charge again
      if (subscription.isPaid) {
        return res.status(400).json({ message: "Subscription is already paid" });
      }
      
      // If trial hasn't expired, don't charge yet
      if (!trialHasExpired) {
        return res.status(400).json({ 
          message: "Trial period is still active", 
          trialEndDate: subscription.trialEndDate 
        });
      }
      
      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "TradeRiser Subscription",
                description: "Monthly subscription to trade signals"
              },
              unit_amount: 3000, // $30.00
              recurring: {
                interval: "month"
              }
            },
            quantity: 1
          }
        ],
        mode: "subscription",
        success_url: `${req.headers.referer || "http://localhost:5000"}?success=true&subscription_id=${subscription.id}`,
        cancel_url: `${req.headers.referer || "http://localhost:5000"}?canceled=true`
      });
      
      res.json({ url: session.url });
    } catch (err) {
      console.error("Stripe error:", err);
      res.status(500).json({ message: "Error creating checkout session" });
    }
  });

  // Handle Stripe webhook (for subscription status updates)
  app.post("/api/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook error:", err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    if (event.type === "checkout.session.completed") {
      console.log("Checkout session completed event received");
      const session = event.data.object;
      
      // Extract subscription ID from success URL
      const url = new URL(session.success_url);
      const subscriptionId = url.searchParams.get("subscription_id");
      
      if (subscriptionId) {
        console.log(`Processing subscription ID: ${subscriptionId}`);
        
        // Update subscription status to paid
        await storage.updateSubscriptionPaymentStatus(parseInt(subscriptionId), true);
        
        // Ensure subscription is active
        await storage.activateSubscription(parseInt(subscriptionId));
        
        // Create provider earning
        const subscription = await storage.getSubscription(parseInt(subscriptionId));
        if (subscription) {
          const signalAccount = await storage.getSignalAccount(subscription.signalAccountId);
          if (signalAccount) {
            await storage.createProviderEarning({
              userId: signalAccount.userId,
              signalAccountId: signalAccount.id,
              amount: 10, // $10 per subscriber
              type: "SUBSCRIPTION"
            });
            
            // Check if performance bonus is due (if return > 10%)
            if (signalAccount.returnPercent >= 10) {
              await storage.createProviderEarning({
                userId: signalAccount.userId,
                signalAccountId: signalAccount.id,
                amount: 50, // $50 bonus
                type: "PERFORMANCE_BONUS"
              });
            }
          }
        }
      }
    } else if (event.type === "payment_intent.succeeded") {
      console.log("Payment intent succeeded event received");
      const paymentIntent = event.data.object;
      const subscriptionId = paymentIntent.metadata?.subscriptionId;
      
      if (subscriptionId) {
        console.log(`Processing subscription ID: ${subscriptionId}`);
        
        // Update subscription status to paid
        await storage.updateSubscriptionPaymentStatus(parseInt(subscriptionId), true);
        
        // Ensure subscription is active
        await storage.activateSubscription(parseInt(subscriptionId));
        
        // Create provider earning
        const subscription = await storage.getSubscription(parseInt(subscriptionId));
        if (subscription) {
          const signalAccount = await storage.getSignalAccount(subscription.signalAccountId);
          if (signalAccount) {
            await storage.createProviderEarning({
              userId: signalAccount.userId,
              signalAccountId: signalAccount.id,
              amount: 10, // $10 per subscriber
              type: "SUBSCRIPTION"
            });
            
            // Check if performance bonus is due (if return > 10%)
            if (signalAccount.returnPercent >= 10) {
              await storage.createProviderEarning({
                userId: signalAccount.userId,
                signalAccountId: signalAccount.id,
                amount: 50, // $50 bonus
                type: "PERFORMANCE_BONUS"
              });
            }
          }
        }
      }
    }
    
    res.json({ received: true });
  });

  // Stripe Payment API
  app.get("/api/subscriptions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const subscription = await storage.getSubscription(id);
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      // Verify that the trade account belongs to the current user
      const tradeAccount = await storage.getTradeAccount(subscription.tradeAccountId);
      if (!tradeAccount || tradeAccount.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this subscription" });
      }
      
      // Get signal account details
      const signalAccount = await storage.getSignalAccount(subscription.signalAccountId);
      
      res.json({
        subscription,
        signalAccount,
        tradeAccount
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching subscription" });
    }
  });

  app.post("/api/create-subscription-payment", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { subscriptionId } = req.body;
      
      if (!subscriptionId) {
        return res.status(400).json({ message: "Subscription ID is required" });
      }
      
      const id = parseInt(subscriptionId);
      const subscription = await storage.getSubscription(id);
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      // Verify that the trade account belongs to the current user
      const tradeAccount = await storage.getTradeAccount(subscription.tradeAccountId);
      if (!tradeAccount || tradeAccount.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this subscription" });
      }
      
      // Check if subscription is already paid
      if (subscription.isPaid) {
        return res.status(400).json({ message: "Subscription is already paid" });
      }
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 3000, // $30.00 in cents
        currency: "usd",
        metadata: {
          subscriptionId: id.toString(),
          userId: req.user.id.toString()
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (err: any) {
      res.status(500).json({ message: `Error creating payment intent: ${err.message}` });
    }
  });
  
  // Test endpoint to activate a subscription without payment
  app.post("/api/activate-subscription-test", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { subscriptionId } = req.body;
      
      if (!subscriptionId) {
        return res.status(400).json({ message: "Subscription ID is required" });
      }
      
      const id = parseInt(subscriptionId);
      const subscription = await storage.getSubscription(id);
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      // Verify that the trade account belongs to the current user
      const tradeAccount = await storage.getTradeAccount(subscription.tradeAccountId);
      if (!tradeAccount || tradeAccount.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this subscription" });
      }
      
      // Check if subscription is already paid
      if (subscription.isPaid) {
        return res.status(400).json({ message: "Subscription is already paid" });
      }
      
      // Activate subscription without payment (for testing only)
      await storage.updateSubscriptionPaymentStatus(id, true);
      
      // Activate the subscription
      await storage.activateSubscription(id);
      
      // Create provider earning (similar to the webhook handler)
      const signalAccount = await storage.getSignalAccount(subscription.signalAccountId);
      if (signalAccount) {
        await storage.createProviderEarning({
          userId: signalAccount.userId,
          signalAccountId: signalAccount.id,
          amount: 10, // $10 per subscriber
          type: "SUBSCRIPTION"
        });
      }

      res.status(200).json({ message: "Subscription activated successfully" });
    } catch (err: any) {
      res.status(500).json({ message: `Error activating subscription: ${err.message}` });
    }
  });

  app.post("/api/subscriptions/:id/mark-paid", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const subscription = await storage.getSubscription(id);
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      // Verify that the trade account belongs to the current user
      const tradeAccount = await storage.getTradeAccount(subscription.tradeAccountId);
      if (!tradeAccount || tradeAccount.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this subscription" });
      }
      
      // Mark subscription as paid and active
      const updatedSubscription = await storage.updateSubscriptionPaymentStatus(id, true);
      await storage.activateSubscription(id);

      // Get signal account details
      const signalAccount = await storage.getSignalAccount(subscription.signalAccountId);
      
      res.json({
        subscription: updatedSubscription,
        signalAccount,
        tradeAccount
      });
    } catch (err) {
      res.status(500).json({ message: "Error updating subscription" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
