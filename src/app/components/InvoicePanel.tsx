// ============================================================
// ORDERPILOT — INVOICE PANEL
// File: src/app/components/InvoicePanel.tsx
// Purpose: Displays the selected order invoice
// ============================================================

import type { Order } from "../types";


// ============================================================
// 1. INVOICE PANEL COMPONENT
// ============================================================

export default function InvoicePanel({
  order,
}: {
  order: Order;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">


      {/* ======================================================
          1.1 INVOICE HEADER
      ======================================================= */}

      <div className="flex items-start justify-between border-b pb-5">

        <div>

          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Selected order
          </p>

          <h2 className="mt-1 text-xl font-bold">
            Invoice #{order.id}
          </h2>

        </div>


        {/* Generate PDF */}

        <button
          type="button"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Generate PDF
        </button>

      </div>


      {/* ======================================================
          1.2 CUSTOMER & DELIVERY INFORMATION
      ======================================================= */}

      <div className="grid gap-6 border-b py-5 md:grid-cols-2">

        {/* Customer */}

        <div>

          <p className="text-xs uppercase tracking-wide text-slate-400">
            Customer
          </p>

          <p className="mt-1 font-semibold">
            {order.customer}
          </p>

          <p className="text-xs text-slate-500">
            {order.customerId}
          </p>

          <p className="text-xs text-slate-500">
            {order.customerPhone}
          </p>

        </div>


        {/* Delivery location */}

        <div>

          <p className="text-xs uppercase tracking-wide text-slate-400">
            Delivery location
          </p>

          <p className="mt-1 font-semibold">
            {order.location}
          </p>

        </div>

      </div>


      {/* ======================================================
          1.3 ORDER ITEMS
      ======================================================= */}

      <div className="py-5">

        <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b pb-3 text-xs font-medium uppercase tracking-wide text-slate-400">

          <span>
            Item
          </span>

          <span>
            Qty
          </span>

          <span>
            Amount
          </span>

        </div>


        {/* ====================================================
            1.3.1 PRODUCT ROWS
        ===================================================== */}

        <div>

          {order.items.map((item, index) => (

            <div
              key={index}
              className="grid grid-cols-[1fr_auto_auto] gap-4 py-4"
            >

              <div>

                <p className="font-semibold">
                  {item.productName}
                </p>

                <p className="text-xs text-slate-500">
                  Unit price: ₦
                  {item.unitPrice.toLocaleString("en-NG")}
                </p>

              </div>

              <p className="font-semibold">
                {item.quantity}
              </p>

              <p className="font-semibold">
                ₦{item.subtotal.toLocaleString("en-NG")}
              </p>

            </div>

          ))}

        </div>

      </div>


      {/* ======================================================
          1.4 PRICE BREAKDOWN
      ======================================================= */}

      <div className="border-t pt-5">


        {/* Subtotal */}

        <div className="flex justify-between py-2 text-sm">

          <span className="text-slate-500">
            Subtotal
          </span>

          <span className="font-medium">
            ₦{order.subtotal.toLocaleString("en-NG")}
          </span>

        </div>


        {/* Delivery fee */}

        <div className="flex justify-between py-2 text-sm">

          <span className="text-slate-500">
            Delivery fee
          </span>

          <span className="font-medium">
            ₦{order.deliveryFee.toLocaleString("en-NG")}
          </span>

        </div>


        {/* ====================================================
            1.4.1 FINAL TOTAL
        ===================================================== */}

        <div className="mt-3 flex justify-between border-t pt-4">

          <span className="font-bold">
            Total
          </span>

          <span className="text-lg font-bold">
            ₦{order.total.toLocaleString("en-NG")}
          </span>

        </div>

      </div>

    </div>
  );
}
