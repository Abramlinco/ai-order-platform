// ============================================================
// ORDERPILOT — ORDERS PAGE
// File: src/app/orders/page.tsx
// Purpose: Review, search, filter, and manage customer orders
// ============================================================

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";


// ============================================================
// 1. ORDER TYPE
// ============================================================

type Order = {
  id: string;
  customer: string;
  phone: string;
  item: string;
  quantity: number;
  location: string;
  total: number;
  status: string;
  rider: string;
  date: string;
};


// ============================================================
// 2. ORDERS PAGE
// ============================================================

export default function OrdersPage() {

  // ==========================================================
  // 2.1 ROUTER
  // ==========================================================

  const router = useRouter();


  // ==========================================================
  // 2.2 FILTER STATE
  // ==========================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All statuses");

  const [dateFilter, setDateFilter] =
    useState("All dates");


  // ==========================================================
  // 3. ORDER DATA
  // ==========================================================

  const orders: Order[] = [
    {
      id: "#1042",
      customer: "John Doe",
      phone: "0802 111 2233",
      item: "Black Shirt",
      quantity: 3,
      location: "Gwarinpa, Abuja",
      total: 36000,
      status: "Awaiting approval",
      rider: "Not assigned",
      date: "today",
    },

    {
      id: "#1041",
      customer: "Mary Smith",
      phone: "0804 222 3344",
      item: "Sneakers",
      quantity: 2,
      location: "Wuse 2, Abuja",
      total: 55000,
      status: "Out for delivery",
      rider: "Daniel",
      date: "today",
    },

    {
      id: "#1040",
      customer: "David James",
      phone: "0805 333 4455",
      item: "Hoodie",
      quantity: 1,
      location: "Maitama, Abuja",
      total: 18500,
      status: "Delivered",
      rider: "Michael",
      date: "yesterday",
    },

    {
      id: "#1039",
      customer: "Mary Okafor",
      phone: "0806 444 5566",
      item: "White Shirt",
      quantity: 2,
      location: "Gudu, Abuja",
      total: 42000,
      status: "Out for delivery",
      rider: "Daniel",
      date: "yesterday",
    },

    {
      id: "#1038",
      customer: "Emeka Nwachukwu",
      phone: "0807 555 6677",
      item: "Polo Shirt",
      quantity: 1,
      location: "Kubwa, Abuja",
      total: 23000,
      status: "Cancelled",
      rider: "—",
      date: "older",
    },
  ];


  // ==========================================================
  // 4. FILTERED ORDERS
  // ==========================================================

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const searchValue = search.toLowerCase();

      const matchesSearch =
        order.customer.toLowerCase().includes(searchValue) ||
        order.id.toLowerCase().includes(searchValue) ||
        order.item.toLowerCase().includes(searchValue);


      const matchesStatus =
        statusFilter === "All statuses" ||
        order.status === statusFilter;


      const matchesDate =
        dateFilter === "All dates" ||
        (dateFilter === "Today" &&
          order.date === "today") ||
        (dateFilter === "Yesterday" &&
          order.date === "yesterday") ||
        (dateFilter === "This week" &&
          (
            order.date === "today" ||
            order.date === "yesterday"
          )) ||
        (dateFilter === "This month" &&
          (
            order.date === "today" ||
            order.date === "yesterday" ||
            order.date === "older"
          ));


      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });

  }, [
    search,
    statusFilter,
    dateFilter,
  ]);


  // ==========================================================
  // 5. NAVIGATION HELPERS
  // ==========================================================

  const openInvoice = (order: Order) => {

    router.push(
      `/Invoice?orderId=${encodeURIComponent(order.id)}`
    );

  };


  const openCustomer = (order: Order) => {

    router.push(
      `/customers?customer=${encodeURIComponent(order.customer)}`
    );

  };


  const openOrderDetails = (order: Order) => {

    router.push(
      `/orders?orderId=${encodeURIComponent(order.id)}`
    );

  };


  // ==========================================================
  // 6. PAGE UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">


      {/* ======================================================
          6.1 PAGE HEADER
          ======================================================= */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">

          <div>

            <h1 className="text-2xl font-bold">
              Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review, manage, and track customer orders.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          6.2 ORDERS WORKSPACE
          ======================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">


          {/* ==================================================
              6.2.1 WORKSPACE HEADER
              ================================================== */}

          <div className="border-b border-slate-200 px-4 py-5 sm:px-6">

            <h2 className="text-lg font-semibold">
              All Orders
            </h2>

            <p className="text-sm text-slate-500">
              View and manage all customer orders.
            </p>

          </div>


          {/* ==================================================
              6.2.2 FILTERS
              ================================================== */}

          <div className="border-b border-slate-200 px-4 py-5 sm:px-6">

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_200px_160px]">

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search orders..."
                className="h-12 rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />


              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-12 rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-600"
              >

                <option>All statuses</option>
                <option>Awaiting approval</option>
                <option>Out for delivery</option>
                <option>Delivered</option>
                <option>Cancelled</option>

              </select>


              <select
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
                className="h-12 rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-600"
              >

                <option>All dates</option>
                <option>Today</option>
                <option>Yesterday</option>
                <option>This week</option>
                <option>This month</option>

              </select>

            </div>

          </div>


          {/* ==================================================
              6.3 DESKTOP TABLE
              ================================================== */}

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
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Delivered By
                  </th>

                  <th className="px-6 py-4">
                    Invoice
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-slate-50"
                  >


                    {/* ========================================
                        CUSTOMER
                        ========================================= */}

                    <td className="px-6 py-5">

                      <button
                        type="button"
                        onClick={() => openCustomer(order)}
                        className="text-left font-semibold text-slate-900 transition hover:text-emerald-700 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      >
                        {order.customer}
                      </button>

                      <div className="text-xs text-slate-500">
                        {order.phone}
                      </div>

                      <button
                        type="button"
                        onClick={() => openOrderDetails(order)}
                        className="mt-1 text-xs font-medium text-slate-400 transition hover:text-emerald-700 hover:underline"
                      >
                        Order {order.id}
                      </button>

                    </td>


                    {/* ========================================
                        ORDER
                        ========================================= */}

                    <td className="px-6 py-5">

                      <div className="font-medium text-slate-900">
                        {order.id}
                      </div>

                      <div className="text-xs text-slate-500">
                        {order.item} × {order.quantity}
                      </div>

                    </td>


                    {/* ========================================
                        LOCATION
                        ========================================= */}

                    <td className="px-6 py-5 text-slate-600">
                      {order.location}
                    </td>


                    {/* ========================================
                        TOTAL
                        ========================================= */}

                    <td className="px-6 py-5 font-bold text-slate-900">
                      ₦{order.total.toLocaleString("en-NG")}
                    </td>


                    {/* ========================================
                        STATUS
                        ========================================= */}

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "Out for delivery"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>

                    </td>


                    {/* ========================================
                        RIDER
                        ========================================= */}

                    <td className="px-6 py-5 text-slate-600">
                      {order.rider}
                    </td>


                    {/* ========================================
                        INVOICE
                        ========================================= */}

                    <td className="px-6 py-5">

                      <button
                        type="button"
                        onClick={() => openInvoice(order)}
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


          {/* ==================================================
              6.4 MOBILE ORDER CARDS
              ================================================== */}

          <div className="space-y-3 p-4 lg:hidden">

            {filteredOrders.map((order) => (

              <article
                key={order.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >


                {/* ==========================================
                    MOBILE ORDER HEADER
                    =========================================== */}

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <button
                      type="button"
                      onClick={() => openOrderDetails(order)}
                      className="font-bold text-slate-900 hover:text-emerald-700 hover:underline"
                    >
                      {order.id}
                    </button>

                    <button
                      type="button"
                      onClick={() => openCustomer(order)}
                      className="mt-1 block text-left text-sm font-semibold text-slate-800 hover:text-emerald-700 hover:underline"
                    >
                      {order.customer}
                    </button>

                    <p className="text-xs text-slate-500">
                      {order.phone}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {order.date}
                    </p>

                  </div>


                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.status === "Out for delivery"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>

                </div>


                {/* ==========================================
                    MOBILE ORDER DETAILS
                    =========================================== */}

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
                      Rider
                    </span>

                    <span className="text-right text-slate-800">
                      {order.rider}
                    </span>

                  </div>


                  <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">

                    <span className="font-medium text-slate-500">
                      Total
                    </span>

                    <span className="font-bold text-slate-900">
                      ₦{order.total.toLocaleString("en-NG")}
                    </span>

                  </div>

                </div>


                {/* ==========================================
                    MOBILE ACTIONS
                    =========================================== */}

                <div className="mt-4 grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() => openCustomer(order)}
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    View customer
                  </button>


                  <button
                    type="button"
                    onClick={() => openInvoice(order)}
                    className="rounded-lg border border-emerald-600 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    View invoice
                  </button>

                </div>

              </article>

            ))}

          </div>


          {/* ==================================================
              6.5 EMPTY STATE
              ================================================== */}

          {filteredOrders.length === 0 && (

            <div className="px-6 py-12 text-center">

              <p className="text-sm font-medium text-slate-700">
                No orders found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                No orders match your search or selected filters.
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}