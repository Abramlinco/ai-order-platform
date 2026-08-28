// ============================================================
// ORDERPILOT — APPROVAL PANEL
// File: src/app/components/ApprovalPanel.tsx
// Purpose: Human approval gate for incoming orders
// ============================================================

import type { Order } from "../types";


// ============================================================
// 1. APPROVAL PANEL COMPONENT
// ============================================================

// ============================================================
// 2. APPROVAL PANEL COMPONENT
// ============================================================

export default function ApprovalPanel({
  order,
  onApproveOrder,
}: {
  order: Order;
  onApproveOrder: () => void;
}) {

  return (
    <div className="rounded-2xl bg-emerald-700 p-6 text-white">


      {/* ======================================================
          1.1 PANEL HEADER
      ======================================================= */}

      <p className="text-xs font-medium uppercase tracking-wide text-emerald-100">
        Human approval gate
      </p>

      <h2 className="mt-2 text-xl font-bold">
        Order #{order.id}
      </h2>


      {/* ======================================================
          1.2 CUSTOMER
      ======================================================= */}

      <div className="mt-6">

        <p className="text-xs uppercase tracking-wide text-emerald-100">
          Customer
        </p>

        <p className="mt-1 font-semibold">
          {order.customer}
        </p>

      </div>


      {/* ======================================================
          1.3 DELIVERY LOCATION
      ======================================================= */}

      <div className="mt-5">

        <p className="text-xs uppercase tracking-wide text-emerald-100">
          Delivery
        </p>

        <p className="mt-1 font-semibold">
          {order.location}
        </p>

      </div>


      {/* ======================================================
          1.4 CURRENT RIDER
      ======================================================= */}

      <div className="mt-5">

        <p className="text-xs uppercase tracking-wide text-emerald-100">
          Delivered by
        </p>

        <p className="mt-1 font-semibold">

          {order.rider
            ? order.rider.name
            : "Rider not assigned"}

        </p>
{/* ======================================================
    1.5 CURRENT ORDER STATUS
======================================================= */}

<div className="mt-5">

  <p className="text-xs uppercase tracking-wide text-emerald-100">
    Order status
  </p>

  <p className="mt-1 font-semibold">
    {order.status}
  </p>

</div>
      </div>


      {/* ======================================================
          1.5 APPROVE ORDER BUTTON
      ======================================================= */}

      <button
  type="button"
  onClick={onApproveOrder}
  className="mt-8 w-full rounded-lg bg-white px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
>
  Approve Order
</button>

    </div>
  );
}
