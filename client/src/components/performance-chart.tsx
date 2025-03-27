import { useEffect, useRef } from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface PerformanceChartProps {
  data: { date: string; value: number }[];
  color?: string;
}

export function PerformanceChart({ data, color = "hsl(var(--primary))" }: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis 
          dataKey="date"
          axisLine={{ stroke: "hsl(var(--border))" }}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
        />
        <YAxis 
          tickFormatter={(value) => `${value}%`}
          axisLine={{ stroke: "hsl(var(--border))" }}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: "hsl(var(--popover))", 
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            color: "hsl(var(--popover-foreground))",
            fontSize: "14px"
          }}
          formatter={(value: number) => [`${value}%`, "Return"]}
          labelStyle={{ fontWeight: "bold", marginBottom: "8px" }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          dot={{ fill: color, r: 4, strokeWidth: 0 }}
          activeDot={{ fill: color, r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ChartContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
}
