import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Session and user management functions
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  return data.session;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error);
    return null;
  }

  // Get the user profile from the users table
  if (data.user) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Error getting user profile:", profileError);
      return { ...data.user, role: "subscriber" }; // Default role if profile not found
    }

    return { ...data.user, ...profile };
  }

  return null;
}

export type Tables = Database["public"]["Tables"];
export type Users = Tables["users"]["Row"];
export type SignalAccounts = Tables["signal_accounts"]["Row"];
export type TradeAccounts = Tables["trade_accounts"]["Row"];
export type Subscriptions = Tables["subscriptions"]["Row"];
export type SubscriptionTradeAccounts =
  Tables["subscription_trade_accounts"]["Row"];
export type Trades = Tables["trades"]["Row"];
export type CopiedTrades = Tables["copied_trades"]["Row"];
export type Comments = Tables["comments"]["Row"];
export type PerformanceStats = Tables["performance_stats"]["Row"];
