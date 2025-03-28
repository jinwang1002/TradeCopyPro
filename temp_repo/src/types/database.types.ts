export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: "provider" | "subscriber" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "provider" | "subscriber" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "provider" | "subscriber" | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      signal_accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          broker: string | null;
          account_number: string | null;
          monthly_fee: number | null;
          is_active: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          broker?: string | null;
          account_number?: string | null;
          monthly_fee?: number | null;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          broker?: string | null;
          account_number?: string | null;
          monthly_fee?: number | null;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      trade_accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          broker: string | null;
          account_number: string | null;
          is_active: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          broker?: string | null;
          account_number?: string | null;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          broker?: string | null;
          account_number?: string | null;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          subscriber_id: string;
          signal_account_id: string;
          status: "active" | "trial" | "expired" | "cancelled" | null;
          trial_ends_at: string | null;
          subscription_ends_at: string | null;
          lot_size_multiplier: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subscriber_id: string;
          signal_account_id: string;
          status?: "active" | "trial" | "expired" | "cancelled" | null;
          trial_ends_at?: string | null;
          subscription_ends_at?: string | null;
          lot_size_multiplier?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subscriber_id?: string;
          signal_account_id?: string;
          status?: "active" | "trial" | "expired" | "cancelled" | null;
          trial_ends_at?: string | null;
          subscription_ends_at?: string | null;
          lot_size_multiplier?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscription_trade_accounts: {
        Row: {
          id: string;
          subscription_id: string;
          trade_account_id: string;
          is_active: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subscription_id: string;
          trade_account_id: string;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subscription_id?: string;
          trade_account_id?: string;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      trades: {
        Row: {
          id: string;
          signal_account_id: string;
          symbol: string;
          type: "Buy" | "Sell";
          open_price: number;
          current_price: number | null;
          stop_loss: number | null;
          take_profit: number | null;
          lot_size: number;
          status: "Open" | "Closed" | null;
          profit: number | null;
          open_time: string;
          close_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          signal_account_id: string;
          symbol: string;
          type: "Buy" | "Sell";
          open_price: number;
          current_price?: number | null;
          stop_loss?: number | null;
          take_profit?: number | null;
          lot_size: number;
          status?: "Open" | "Closed" | null;
          profit?: number | null;
          open_time?: string;
          close_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          signal_account_id?: string;
          symbol?: string;
          type?: "Buy" | "Sell";
          open_price?: number;
          current_price?: number | null;
          stop_loss?: number | null;
          take_profit?: number | null;
          lot_size?: number;
          status?: "Open" | "Closed" | null;
          profit?: number | null;
          open_time?: string;
          close_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      copied_trades: {
        Row: {
          id: string;
          trade_id: string;
          subscription_id: string;
          trade_account_id: string;
          lot_size: number;
          status: "Open" | "Closed" | null;
          profit: number | null;
          open_time: string;
          close_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trade_id: string;
          subscription_id: string;
          trade_account_id: string;
          lot_size: number;
          status?: "Open" | "Closed" | null;
          profit?: number | null;
          open_time?: string;
          close_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trade_id?: string;
          subscription_id?: string;
          trade_account_id?: string;
          lot_size?: number;
          status?: "Open" | "Closed" | null;
          profit?: number | null;
          open_time?: string;
          close_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          signal_account_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          signal_account_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          signal_account_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      performance_stats: {
        Row: {
          id: string;
          signal_account_id: string;
          period: "daily" | "weekly" | "monthly" | "yearly" | "all_time";
          return_percentage: number | null;
          win_rate: number | null;
          drawdown: number | null;
          total_trades: number | null;
          winning_trades: number | null;
          losing_trades: number | null;
          calculated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          signal_account_id: string;
          period: "daily" | "weekly" | "monthly" | "yearly" | "all_time";
          return_percentage?: number | null;
          win_rate?: number | null;
          drawdown?: number | null;
          total_trades?: number | null;
          winning_trades?: number | null;
          losing_trades?: number | null;
          calculated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          signal_account_id?: string;
          period?: "daily" | "weekly" | "monthly" | "yearly" | "all_time";
          return_percentage?: number | null;
          win_rate?: number | null;
          drawdown?: number | null;
          total_trades?: number | null;
          winning_trades?: number | null;
          losing_trades?: number | null;
          calculated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
