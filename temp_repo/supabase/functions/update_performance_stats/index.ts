import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      },
    );

    // Get all signal accounts
    const { data: signalAccounts, error: signalAccountsError } =
      await supabaseClient
        .from("signal_accounts")
        .select("id")
        .eq("is_active", true);

    if (signalAccountsError) {
      throw new Error(
        `Error fetching signal accounts: ${signalAccountsError.message}`,
      );
    }

    const results = [];

    // Process each signal account
    for (const account of signalAccounts) {
      // Get all trades for this signal account
      const { data: trades, error: tradesError } = await supabaseClient
        .from("trades")
        .select("*")
        .eq("signal_account_id", account.id);

      if (tradesError) {
        throw new Error(`Error fetching trades: ${tradesError.message}`);
      }

      if (!trades || trades.length === 0) {
        continue;
      }

      // Calculate performance metrics
      const totalTrades = trades.length;
      const winningTrades = trades.filter(
        (trade) => trade.profit && trade.profit > 0,
      ).length;
      const losingTrades = trades.filter(
        (trade) => trade.profit && trade.profit < 0,
      ).length;
      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

      // Calculate return percentage (sum of profits / initial investment)
      const totalProfit = trades.reduce(
        (sum, trade) => sum + (trade.profit || 0),
        0,
      );
      const returnPercentage = totalProfit; // This is simplified, would need actual investment amount

      // Calculate drawdown (simplified version)
      const drawdown = 0; // Would need historical balance data for proper calculation

      // Update performance stats for all_time period
      const { data: updateResult, error: updateError } = await supabaseClient
        .from("performance_stats")
        .upsert({
          signal_account_id: account.id,
          period: "all_time",
          return_percentage: returnPercentage,
          win_rate: winRate,
          drawdown: drawdown,
          total_trades: totalTrades,
          winning_trades: winningTrades,
          losing_trades: losingTrades,
          calculated_at: new Date().toISOString(),
        });

      if (updateError) {
        throw new Error(
          `Error updating performance stats: ${updateError.message}`,
        );
      }

      results.push({
        signal_account_id: account.id,
        stats_updated: true,
      });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
