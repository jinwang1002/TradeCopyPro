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
    const { tradeId } = await req.json();

    if (!tradeId) {
      throw new Error("Trade ID is required");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      },
    );

    // Get the trade details
    const { data: trade, error: tradeError } = await supabaseClient
      .from("trades")
      .select("*")
      .eq("id", tradeId)
      .single();

    if (tradeError || !trade) {
      throw new Error(
        `Error fetching trade: ${tradeError?.message || "Trade not found"}`,
      );
    }

    // Find all subscriptions for this signal account
    const { data: subscriptions, error: subscriptionsError } =
      await supabaseClient
        .from("subscriptions")
        .select(
          `
        id,
        subscriber_id,
        signal_account_id,
        lot_size_multiplier,
        subscription_trade_accounts!inner(trade_account_id)
      `,
        )
        .eq("signal_account_id", trade.signal_account_id)
        .eq("status", "active")
        .eq("subscription_trade_accounts.is_active", true);

    if (subscriptionsError) {
      throw new Error(
        `Error fetching subscriptions: ${subscriptionsError.message}`,
      );
    }

    const copiedTradesResults = [];

    // Create copied trades for each subscription
    for (const subscription of subscriptions) {
      for (const tradeAccount of subscription.subscription_trade_accounts) {
        // Calculate the lot size based on the multiplier
        const lotSize =
          trade.lot_size * (subscription.lot_size_multiplier || 1.0);

        // Create the copied trade
        const { data: copiedTrade, error: copiedTradeError } =
          await supabaseClient
            .from("copied_trades")
            .insert({
              trade_id: trade.id,
              subscription_id: subscription.id,
              trade_account_id: tradeAccount.trade_account_id,
              lot_size: lotSize,
              status: trade.status,
              profit: null, // Will be updated later
              open_time: new Date().toISOString(),
            })
            .select()
            .single();

        if (copiedTradeError) {
          throw new Error(
            `Error creating copied trade: ${copiedTradeError.message}`,
          );
        }

        copiedTradesResults.push(copiedTrade);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        trade,
        copied_trades_count: copiedTradesResults.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
