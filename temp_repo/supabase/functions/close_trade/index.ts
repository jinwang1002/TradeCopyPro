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
    const { tradeId, closePrice, profit } = await req.json();

    if (!tradeId || !closePrice) {
      throw new Error("Trade ID and close price are required");
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

    // Update the original trade
    const { data: updatedTrade, error: updateTradeError } = await supabaseClient
      .from("trades")
      .update({
        status: "Closed",
        current_price: closePrice,
        profit: profit,
        close_time: new Date().toISOString(),
      })
      .eq("id", tradeId)
      .select()
      .single();

    if (updateTradeError) {
      throw new Error(`Error updating trade: ${updateTradeError.message}`);
    }

    // Find all copied trades for this trade
    const { data: copiedTrades, error: copiedTradesError } =
      await supabaseClient
        .from("copied_trades")
        .select("*")
        .eq("trade_id", tradeId);

    if (copiedTradesError) {
      throw new Error(
        `Error fetching copied trades: ${copiedTradesError.message}`,
      );
    }

    const updatedCopiedTrades = [];

    // Update all copied trades
    for (const copiedTrade of copiedTrades) {
      // Calculate profit based on lot size ratio
      const copiedTradeProfit =
        profit * (copiedTrade.lot_size / updatedTrade.lot_size);

      const { data: updatedCopiedTrade, error: updateCopiedTradeError } =
        await supabaseClient
          .from("copied_trades")
          .update({
            status: "Closed",
            profit: copiedTradeProfit,
            close_time: new Date().toISOString(),
          })
          .eq("id", copiedTrade.id)
          .select()
          .single();

      if (updateCopiedTradeError) {
        throw new Error(
          `Error updating copied trade: ${updateCopiedTradeError.message}`,
        );
      }

      updatedCopiedTrades.push(updatedCopiedTrade);
    }

    return new Response(
      JSON.stringify({
        success: true,
        trade: updatedTrade,
        copied_trades: updatedCopiedTrades,
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
