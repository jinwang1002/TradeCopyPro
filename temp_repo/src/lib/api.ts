import { supabase } from "./supabase";
import type { Tables } from "./supabase";

// Auth functions
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: "provider" | "subscriber",
) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create profile in users table
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role,
      });

      if (profileError) throw profileError;
    }

    return { success: true, user: authData.user };
  } catch (error) {
    console.error("Error signing up:", error);
    return { success: false, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error("Error signing in:", error);
    return { success: false, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error };
  }
}

// User functions
export async function getCurrentUser() {
  try {
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) return { success: false, error: "No user logged in" };

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (userError) throw userError;

    return { success: true, user: userData };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { success: false, error };
  }
}

// Signal account functions
export async function createSignalAccount(
  data: Omit<Tables["signal_accounts"]["Insert"], "id" | "user_id">,
) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: "Not authenticated" };

    const { data: signalAccount, error } = await supabase
      .from("signal_accounts")
      .insert({
        ...data,
        user_id: userData.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, signalAccount };
  } catch (error) {
    console.error("Error creating signal account:", error);
    return { success: false, error };
  }
}

export async function getSignalAccounts() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase
      .from("signal_accounts")
      .select("*")
      .eq("user_id", userData.user.id);

    if (error) throw error;

    return { success: true, signalAccounts: data };
  } catch (error) {
    console.error("Error getting signal accounts:", error);
    return { success: false, error };
  }
}

// Trade account functions
export async function createTradeAccount(
  data: Omit<Tables["trade_accounts"]["Insert"], "id" | "user_id">,
) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: "Not authenticated" };

    const { data: tradeAccount, error } = await supabase
      .from("trade_accounts")
      .insert({
        ...data,
        user_id: userData.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, tradeAccount };
  } catch (error) {
    console.error("Error creating trade account:", error);
    return { success: false, error };
  }
}

export async function getTradeAccounts() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase
      .from("trade_accounts")
      .select("*")
      .eq("user_id", userData.user.id);

    if (error) throw error;

    return { success: true, tradeAccounts: data };
  } catch (error) {
    console.error("Error getting trade accounts:", error);
    return { success: false, error };
  }
}

// Trade functions
export async function createTrade(
  data: Omit<Tables["trades"]["Insert"], "id">,
) {
  try {
    const { data: trade, error } = await supabase
      .from("trades")
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    // Trigger the copy trade function
    const { data: copyResult, error: copyError } =
      await supabase.functions.invoke("supabase-functions-copy-trade", {
        body: { tradeId: trade.id },
      });

    if (copyError) throw copyError;

    return { success: true, trade, copyResult };
  } catch (error) {
    console.error("Error creating trade:", error);
    return { success: false, error };
  }
}

export async function closeTrade(
  tradeId: string,
  closePrice: number,
  profit: number,
) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-close-trade",
      {
        body: { tradeId, closePrice, profit },
      },
    );

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error closing trade:", error);
    return { success: false, error };
  }
}

export async function getTradesBySignalAccount(signalAccountId: string) {
  try {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("signal_account_id", signalAccountId)
      .order("open_time", { ascending: false });

    if (error) throw error;

    return { success: true, trades: data };
  } catch (error) {
    console.error("Error getting trades:", error);
    return { success: false, error };
  }
}

export async function getCopiedTradesByUser() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase
      .from("copied_trades")
      .select(
        `
        *,
        trades!inner(*),
        trade_accounts!inner(*),
        subscriptions!inner(*, signal_accounts!inner(*))
      `,
      )
      .eq("subscriptions.subscriber_id", userData.user.id)
      .order("open_time", { ascending: false });

    if (error) throw error;

    return { success: true, copiedTrades: data };
  } catch (error) {
    console.error("Error getting copied trades:", error);
    return { success: false, error };
  }
}

// Subscription functions
export async function subscribeToSignalAccount(
  signalAccountId: string,
  tradeAccountIds: string[],
  lotSizeMultiplier: number = 1.0,
  reverseCopy: boolean = false,
  onlySlTpTrades: boolean = false,
) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: "Not authenticated" };

    // Create the subscription
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7-day trial

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        subscriber_id: userData.user.id,
        signal_account_id: signalAccountId,
        status: "trial",
        trial_ends_at: trialEndsAt.toISOString(),
        lot_size_multiplier: lotSizeMultiplier,
        reverse_copy: reverseCopy,
        only_sl_tp_trades: onlySlTpTrades,
      })
      .select()
      .single();

    if (subscriptionError) throw subscriptionError;

    // Link trade accounts to the subscription
    const tradeAccountLinks = tradeAccountIds.map((tradeAccountId) => ({
      subscription_id: subscription.id,
      trade_account_id: tradeAccountId,
    }));

    const { error: linkError } = await supabase
      .from("subscription_trade_accounts")
      .insert(tradeAccountLinks);

    if (linkError) throw linkError;

    return { success: true, subscription };
  } catch (error) {
    console.error("Error subscribing to signal account:", error);
    return { success: false, error };
  }
}

export async function getSubscriptions() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase
      .from("subscriptions")
      .select(
        `
        *,
        signal_accounts(*),
        subscription_trade_accounts(*, trade_accounts(*))
      `,
      )
      .eq("subscriber_id", userData.user.id);

    if (error) throw error;

    return { success: true, subscriptions: data };
  } catch (error) {
    console.error("Error getting subscriptions:", error);
    return { success: false, error };
  }
}

// Comment functions
export async function addComment(signalAccountId: string, content: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: "Not authenticated" };

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        user_id: userData.user.id,
        signal_account_id: signalAccountId,
        content,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error };
  }
}

export async function getCommentsBySignalAccount(signalAccountId: string) {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        users!inner(id, full_name, avatar_url)
      `,
      )
      .eq("signal_account_id", signalAccountId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, comments: data };
  } catch (error) {
    console.error("Error getting comments:", error);
    return { success: false, error };
  }
}

// Performance stats functions
export async function updatePerformanceStats() {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-update-performance-stats",
    );

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error updating performance stats:", error);
    return { success: false, error };
  }
}

export async function getPerformanceStatsBySignalAccount(
  signalAccountId: string,
) {
  try {
    const { data, error } = await supabase
      .from("performance_stats")
      .select("*")
      .eq("signal_account_id", signalAccountId);

    if (error) throw error;

    return { success: true, stats: data };
  } catch (error) {
    console.error("Error getting performance stats:", error);
    return { success: false, error };
  }
}
