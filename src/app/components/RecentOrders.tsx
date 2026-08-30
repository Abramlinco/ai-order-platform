// ============================================================
// ORDERPILOT — RECENT ORDERS
// File: src/app/components/RecentOrders.tsx
// Purpose: Displays incoming and recent business orders
// ============================================================

"use client";

import { useRouter } from "next/navigation";

import type { Order } from "../types";

import StatusBadge from "./StatusBadge";

import RiderDetails from "./RiderDetails";


// ============================================================
// 1. RECENT ORDERS COMPONENT
// ============================================================

export default function RecentOrders({
  orders,
  onSelectOrder,
}: {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}) {

  // ==========================================================
  // 1.1 ROUTER
  // ==========================================================

  const router = useRouter();


  // ==========================================================
  // 2. NAVIGATION HANDLERS
  // ==========================================================

  const handleViewAllOrders = () => {
    router.push("/orders");
  };


  const handleCustomerClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    router.push("/orders");
  };


  const handleInvoiceClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    router.push("/Invoice");
  };


  // ==========================================================
  // 3. COMPONENT UI
  // ==========================================================

  return (
    <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">


      {/* ======================================================
          3.1 ORDERS HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 border-b px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

        <div>

          <h3 className="text-lg font-semibold text-slate-900">
            Recent orders
          </h3>

          <p className="text-sm text-slate-500">
            Review and manage incoming orders.
          </p>

        </div>


        {/* ==================================================
            VIEW ALL ORDERS
            ================================================== */}

        <button
          type="button"
          onClick={handleViewAllOrders}
          className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
        >
          View all orders
        </button>

      </div>


      {/* ======================================================
          3.2 ORDERS TABLE
      ======================================================= */}

      <div className="w-full min-w-0 overflow-x-auto">

        <table className="min-w-[921px] text-left text-sm">


          {/* ==================================================
              3.2.1 TABLE HEAD
          =================================================== */}

          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

            <tr>

              <th className="px-6 py-4">
                Customer
              </th>

              <th className="px-6 py-4">
                Order information
              </th>

              <th className="px-6 py-4">
                Location
              </th>

              <th className="px-6 py-4">
                Total
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Delivered by
              </th>

              <th className="px-6 py-4">
                Invoice
              </th>

            </tr>

          </thead>


          {/* ==================================================
              3.2.2 TABLE BODY
          =================================================== */}

          <tbody className="divide-y divide-slate-100">

            {orders.map((order) => (

              <tr
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="cursor-pointer transition-colors hover:bg-slate-50"
              >


                {/* ============================================
                    3.2.2.1 CUSTOMER
                ============================================= */}

                <td className="px-6 py-5">

                  <button
                    type="button"
                    onClick={handleCustomerClick}
                    className="text-left font-semibold text-slate-900 transition hover:text-emerald-700 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    {order.customer}
                  </button>

                  <p className="text-xs text-slate-500">
                    {order.customerId}
                  </p>

                  <p className="text-xs text-slate-400">
                    {order.customerPhone}
                  </p>

                  <p className="text-xs text-slate-400">
                    Order {order.id}
                  </p>

                </td>


                {/* ============================================
                    3.2.2.2 ORDER INFORMATION
                ============================================= */}

                <td className="px-6 py-5">

                  <div className="space-y-3">

                    {order.items.map((item, index) => (

                      <div key={`${order.id}-${index}`}>

                        <p className="font-medium text-slate-900">
                          {item.productName}
                        </p>

                        <p className="text-xs text-slate-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="text-xs text-slate-500">
                          Unit price: ₦
                          {item.unitPrice.toLocaleString("en-NG")}
                        </p>

                      </div>

                    ))}

                  </div>

                </td>


                {/* ============================================
                    3.2.2.3 LOCATION
                ============================================= */}

                <td className="px-6 py-5 text-slate-600">
                  {order.location}
                </td>


                {/* ============================================
                    3.2.2.4 TOTAL
                ============================================= */}

                <td className="px-6 py-5 font-semibold text-slate-900">
                  ₦{order.total.toLocaleString("en-NG")}
                </td>


                {/* ============================================
                    3.2.2.5 ORDER STATUS
                ============================================= */}

                <td className="px-6 py-5">

                  <StatusBadge
                    status={order.status}
                  />

                </td>


                {/* ============================================
                    3.2.2.6 DELIVERED BY
                ============================================= */}

                <td className="px-6 py-5">

                  <RiderDetails
                    rider={order.rider}
                  />

                </td>


                {/* ============================================
                    3.2.2.7 INVOICE
                ============================================= */}

                <td className="px-6 py-5">

                  <button
                    type="button"
                    onClick={handleInvoiceClick}
                    className="whitespace-nowrap font-medium text-emerald-700 transition hover:text-emerald-800 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    View invoice
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* ======================================================
          3.3 EMPTY STATE
      ======================================================= */}

      {orders.length === 0 && (

        <div className="px-6 py-12 text-center">

          <p className="text-sm font-medium text-slate-700">
            No recent orders
          </p>

          <p className="mt-1 text-sm text-slate-500">
            New customer orders will appear here.
          </p>

        </div>

      )}

    </div>
  );
}