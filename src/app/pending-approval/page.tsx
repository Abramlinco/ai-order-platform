"use client";

import { useMemo, useState } from "react";

export default function PendingApprovalPage() {
  const [search, setSearch] = useState("");

const [pendingOrders, setPendingOrders] = useState([
    {
      id: "#1042",
      customer: "John Doe",
      phone: "0802 111 2233",
      item: "Black Shirt",
      quantity: 3,
      location: "Gwarinpa, Abuja",
      total: 36000,
      date: "Today",
    },
    {
      id: "#1037",
      customer: "Sarah Williams",
      phone: "0808 666 7788",
      item: "Sneakers",
      quantity: 2,
      location: "Wuse 2, Abuja",
      total: 55000,
      date: "Today",
    },
    {
      id: "#1035",
      customer: "David James",
      phone: "0805 333 4455",
      item: "Hoodie",
      quantity: 1,
      location: "Maitama, Abuja",
      total: 18500,
      date: "Yesterday",
      },
]);

const handleApprove = (orderId: string) => {
  setPendingOrders((orders) =>
    orders.filter((order) => order.id !== orderId)
  );
};

const handleReject = (orderId: string) => {
  setPendingOrders((orders) =>
    orders.filter((order) => order.id !== orderId)
  );
};

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();

    return pendingOrders.filter(
      (order) =>
        order.customer.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query) ||
        order.item.toLowerCase().includes(query) ||
        order.location.toLowerCase().includes(query)
    );
  }, [search, pendingOrders]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =========================================================
          1. PAGE HEADER
      ========================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold">
              Pending Approval
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review customer orders before approving them for processing.
            </p>
          </div>
        </div>
      </section>


      {/* =========================================================
          2. WORKSPACE
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

          {/* Workspace Header */}

          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-slate-900">
                Orders Awaiting Approval
              </h2>

              <p className="text-sm text-slate-500">
                Review the order details before approving or rejecting.
              </p>
            </div>
          </div>


          {/* Search */}

          <div className="border-b border-slate-200 px-6 py-5">
            <label
              htmlFor="pending-order-search"
              className="sr-only"
            >
              Search pending orders
            </label>

            <input
              id="pending-order-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pending orders..."
              className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>


          {/* =====================================================
              2.1 DESKTOP TABLE
          ===================================================== */}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1000px] text-left text-sm">

              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Order
                  </th>

                  <th className="px-6 py-4">
                    Location
                  </th>

                  <th className="px-6 py-4">
                    Total
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-900">
                        {order.customer}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {order.phone}
                      </div>
                    </td>


                    <td className="px-6 py-5">
                      <div className="font-medium text-slate-900">
                        {order.id}
                      </div>

                      <div className="text-xs text-slate-500">
                        {order.item} × {order.quantity}
                      </div>
                    </td>


                    <td className="px-6 py-5 text-slate-600">
                      {order.location}
                    </td>


                    <td className="px-6 py-5 font-bold text-slate-900">
                      ₦{order.total.toLocaleString()}
                    </td>


                    <td className="px-6 py-5 text-slate-600">
                      {order.date}
                    </td>


                    <td className="px-6 py-5">
                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() => handleApprove(order.id)}
                          className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReject(order.id)}
                          className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Reject
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>


          {/* =====================================================
              2.2 MOBILE CARDS
          ===================================================== */}

          <div className="space-y-3 p-4 lg:hidden">

            {filteredOrders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <p className="font-bold text-slate-900">
                      {order.id}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {order.customer}
                    </p>

                    <p className="text-xs text-slate-500">
                      {order.date}
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    Pending
                  </span>

                </div>


                <div className="mt-4 space-y-2 text-sm">

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Item
                    </span>

                    <span className="text-right font-medium text-slate-800">
                      {order.item} × {order.quantity}
                    </span>
                  </div>


                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Location
                    </span>

                    <span className="text-right text-slate-800">
                      {order.location}
                    </span>
                  </div>


                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Total
                    </span>

                    <span className="font-bold text-slate-900">
                      ₦{order.total.toLocaleString()}
                    </span>
                  </div>

                </div>


               <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(order.id)}
                    className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(order.id)}
                    className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600"
                  >
                    Reject
                  </button>
                </div>

              </article>
            ))}

          </div>


          {/* Empty State */}

          {filteredOrders.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No pending orders match your search.
            </div>
          )}

        </div>
      </section>

    </main>
  );
}