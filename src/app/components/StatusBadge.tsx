// ============================================================
// ORDERPILOT — STATUS BADGE
// File: src/app/components/StatusBadge.tsx
// Purpose: Displays the current status of an order
// ============================================================


// ============================================================
// 1. ORDER STATUS TYPE
// ============================================================

export type OrderStatus =
  | "Awaiting approval"
  | "Finding rider"
  | "Rider assigned"
  | "Out for delivery"
  | "Delivered"
  | "Cancelled";


// ============================================================
// 2. STATUS BADGE COMPONENT
// ============================================================

export default function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {

  // ==========================================================
  // 2.1 STATUS STYLES
  // ==========================================================

  const styles: Record<OrderStatus, string> = {

    "Awaiting approval":
      "bg-amber-100 text-amber-700",

    "Finding rider":
      "bg-purple-100 text-purple-700",

    "Rider assigned":
      "bg-indigo-100 text-indigo-700",

    "Out for delivery":
      "bg-blue-100 text-blue-700",

    Delivered:
      "bg-emerald-100 text-emerald-700",

    Cancelled:
      "bg-red-100 text-red-700",

  };


  // ==========================================================
  // 2.2 STATUS DISPLAY
  // ==========================================================

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}