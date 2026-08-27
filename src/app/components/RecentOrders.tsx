// ============================================================
// ORDERPILOT — RECENT ORDERS
// File: src/app/components/RecentOrders.tsx
// Purpose: Displays incoming and recent business orders
// ============================================================

import type { Order } from "../types";

import StatusBadge from "./StatusBadge";

import RiderDetails from "./RiderDetails";


// ============================================================
// 1. RECENT ORDERS COMPONENT
// ============================================================

export default function RecentOrders({
  orders,
}: {
  orders: Order[];
}) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">


      {/* ======================================================
          1.1 ORDERS HEADER
      ======================================================= */}

      <div className="flex items-center justify-between border-b px-6 py-5">

        <div>

          <h3 className="text-lg font-semibold">
            Recent orders
          </h3>

          <p className="text-sm text-slate-500">
            Review and manage incoming orders.
          </p>

        </div>


        {/* View all orders */}

        <button
          type="button"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          View all orders
        </button>

      </div>


      {/* ======================================================
          1.2 ORDERS TABLE
      ======================================================= */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1150px] text-left text-sm">


          {/* ==================================================
              1.2.1 TABLE HEADERS
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
              1.2.2 TABLE BODY
          =================================================== */}

          <tbody className="divide-y divide-slate-100">

            {orders.map((order) => (

              <tr
                key={order.id}
                className="hover:bg-slate-50"
              >


                {/* ============================================
                    1.2.2.1 CUSTOMER
                ============================================= */}

                <td className="px-6 py-5">

                  <p className="font-semibold">
                    {order.customer}
                  </p>

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
                    1.2.2.2 ORDER INFORMATION
                ============================================= */}

                <td className="px-6 py-5">

                  {order.items.map((item, index) => (

                    <div key={index}>

                      <p className="font-medium">
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

                </td>


                {/* ============================================
                    1.2.2.3 LOCATION
                ============================================= */}

                <td className="px-6 py-5 text-slate-600">
                  {order.location}
                </td>


                {/* ============================================
                    1.2.2.4 TOTAL
                ============================================= */}

                <td className="px-6 py-5 font-semibold">
                  ₦{order.total.toLocaleString("en-NG")}
                </td>


                {/* ============================================
                    1.2.2.5 ORDER STATUS
                ============================================= */}

                <td className="px-6 py-5">

                  <StatusBadge
                    status={order.status}
                  />

                </td>


                {/* ============================================
                    1.2.2.6 DELIVERED BY
                ============================================= */}

                <td className="px-6 py-5">

                  <RiderDetails
                    rider={order.rider}
                  />

                </td>


                {/* ============================================
                    1.2.2.7 INVOICE
                ============================================= */}

                <td className="px-6 py-5">

                  <button
                    type="button"
                    className="font-medium text-emerald-700 hover:underline"
                  >
                    View invoice
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}