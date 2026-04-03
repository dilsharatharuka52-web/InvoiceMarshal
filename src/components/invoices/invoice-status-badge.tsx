import { Badge } from "@/components/ui/badge";

export function InvoiceStatusBadge({ status }: { status: string }) {
  const variant =
    status === "PAID"
      ? "success"
      : status === "OVERDUE"
        ? "destructive"
        : status === "PARTIAL"
          ? "warning"
          : "default";

  return <Badge variant={variant}>{status}</Badge>;
}
