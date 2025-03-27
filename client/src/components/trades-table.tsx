import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TradesTableProps {
  trades: any[];
}

export function TradesTable({ trades }: TradesTableProps) {
  if (!trades || trades.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No trades available</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left font-normal">Signal Provider</TableHead>
            <TableHead className="text-left font-normal">Trade</TableHead>
            <TableHead className="text-left font-normal">Entry</TableHead>
            <TableHead className="text-left font-normal">SL/TP</TableHead>
            <TableHead className="text-left font-normal">Status</TableHead>
            <TableHead className="text-left font-normal">P/L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell>
                {trade.signalAccount?.nickname || "Unknown"}
              </TableCell>
              <TableCell>
                <span className={cn(
                  "font-medium",
                  trade.type === "BUY" ? "text-green-500" : "text-red-500"
                )}>
                  {trade.type}
                </span>
                {" "}{trade.pair}
              </TableCell>
              <TableCell className="font-mono">
                {trade.entryPrice.toFixed(4)}
              </TableCell>
              <TableCell className="font-mono">
                {trade.stopLoss?.toFixed(4) || "-"} / {trade.takeProfit?.toFixed(4) || "-"}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn(
                    trade.status === "OPEN" 
                      ? "bg-primary/20 text-primary border-primary/50" 
                      : "bg-green-500/20 text-green-500 border-green-500/50"
                  )}
                >
                  {trade.status}
                </Badge>
              </TableCell>
              <TableCell className={cn(
                "font-mono",
                trade.pips > 0 ? "text-green-500" : trade.pips < 0 ? "text-red-500" : ""
              )}>
                {trade.pips ? `${trade.pips > 0 ? "+" : ""}${trade.pips} pips` : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
