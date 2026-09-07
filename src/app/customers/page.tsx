"use client";

import { useEffect, useMemo, useState } from "react";

type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  location: string | null;
  orders: number;
  totalSpent: number;
  lastOrder: string | null;
};

type CustomerOrder = {
  id: string;
  total: number;
  location: string;
  status: string;
  createdAt: string;
};

type CustomerDetails = Customer & {
  orderHistory: CustomerOrder[];
};

function formatMoney(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function formatDate(value: string | null) {
  if (!value) return "No orders yet";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatLastOrder(value: string | null) {
  if (!value) return "No orders yet";

  const date = new Date(value);
  const now = new Date();

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isYesterday) return "Yesterday";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(date);
}

function statusClass(status: string) {
  if (status === "Delivered") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "Cancelled") {
    return "bg-red-50 text-red-700";
  }

  return "bg-amber-50 text-amber-700";
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/customers", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to load customers");
      }

      setCustomers(data.customers);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Unable to load customers"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) =>
      [
        customer.name,
        customer.id,
        customer.phone,
        customer.email ?? "",
        customer.location ?? "",
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [customers, search]);

  async function openCustomerProfile(customerId: string) {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await fetch(`/api/customers/${customerId}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to load customer");
      }

      setSelectedCustomer(data.customer);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Unable to load customer"
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage your customers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold">All Customers</h2>
            <p className="mt-1 text-sm text-slate-500">
              Customer information comes from the ATIVTRAD database.
            </p>
          </div>

          <div className="border-b border-slate-200 px-6 py-5">
            <label htmlFor="customer-search" className="sr-only">
              Search customers
            </label>

            <input
              id="customer-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers..."
              className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {error && (
            <div className="mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
              <button
                type="button"
                onClick={loadCustomers}
                className="ml-3 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-slate-500">
              Loading customers...
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Orders</th>
                      <th className="px-6 py-4">Total Spent</th>
                      <th className="px-6 py-4">Last Order</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div className="font-semibold">{customer.name}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {customer.id}
                          </div>
                          <div className="text-xs text-slate-500">
                            {customer.phone}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {customer.location ?? "No delivery recorded"}
                        </td>

                        <td className="px-6 py-5 font-medium">
                          {customer.orders}
                        </td>

                        <td className="px-6 py-5 font-bold">
                          {formatMoney(customer.totalSpent)}
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {formatLastOrder(customer.lastOrder)}
                        </td>

                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() => openCustomerProfile(customer.id)}
                            className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                          >
                            View customer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 p-4 lg:hidden">
                {filteredCustomers.map((customer) => (
                  <article
                    key={customer.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {customer.id}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {customer.orders} orders
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Phone</span>
                        <span className="text-right font-medium">
                          {customer.phone}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Location</span>
                        <span className="text-right font-medium">
                          {customer.location ?? "No delivery recorded"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Total spent</span>
                        <span className="font-bold">
                          {formatMoney(customer.totalSpent)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Last order</span>
                        <span className="font-medium">
                          {formatLastOrder(customer.lastOrder)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openCustomerProfile(customer.id)}
                      className="mt-4 w-full rounded-lg border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      View customer
                    </button>
                  </article>
                ))}
              </div>

              {filteredCustomers.length === 0 && (
                <div className="px-6 py-12 text-center text-sm text-slate-500">
                  No customers match your search.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {detailsLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
          <div className="rounded-xl bg-white px-6 py-5 text-sm font-medium shadow-xl">
            Loading customer...
          </div>
        </div>
      )}

      {selectedCustomer && !detailsLoading && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCustomer(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Customer profile
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {selectedCustomer.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedCustomer.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                aria-label="Close customer profile"
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Contact details
                </h3>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="mt-1 font-medium">
                      {selectedCustomer.phone}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="mt-1 break-words font-medium">
                      {selectedCustomer.email ?? "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                    <p className="text-xs text-slate-500">
                      Latest delivery location
                    </p>
                    <p className="mt-1 font-medium">
                      {selectedCustomer.location ?? "No delivery recorded"}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Customer activity
                </h3>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">Orders</p>
                    <p className="mt-1 text-xl font-bold">
                      {selectedCustomer.orders}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">Total spent</p>
                    <p className="mt-1 text-xl font-bold">
                      {formatMoney(selectedCustomer.totalSpent)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">Last order</p>
                    <p className="mt-1 text-sm font-bold">
                      {formatDate(selectedCustomer.lastOrder)}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200">
                <div className="border-b border-slate-200 px-4 py-4">
                  <h3 className="font-semibold">Order history</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Orders recorded for this customer.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {selectedCustomer.orderHistory.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      No orders recorded yet.
                    </div>
                  ) : (
                    selectedCustomer.orderHistory.map((order) => (
                      <div key={order.id} className="px-4 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold">
                              {order.id}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="mt-3 flex justify-between gap-4 text-sm">
                          <span className="text-slate-500">
                            {order.location}
                          </span>
                          <span className="font-bold">
                            {formatMoney(order.total)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
