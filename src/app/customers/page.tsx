"use client";

import { useMemo, useState } from "react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const customers = [
    {
      id: "CUS-10042",
      name: "John Doe",
      phone: "0802 111 2233",
      email: "john.doe@example.com",
      location: "Gwarinpa, Abuja",
      orders: 8,
      totalSpent: 186000,
      lastOrder: "Today",
    },
    {
      id: "CUS-10041",
      name: "Mary Smith",
      phone: "0804 222 3344",
      email: "mary.smith@example.com",
      location: "Wuse 2, Abuja",
      orders: 6,
      totalSpent: 142000,
      lastOrder: "Today",
    },
    {
      id: "CUS-10040",
      name: "David James",
      phone: "0805 333 4455",
      email: "david.james@example.com",
      location: "Maitama, Abuja",
      orders: 4,
      totalSpent: 98500,
      lastOrder: "Yesterday",
    },
    {
      id: "CUS-10039",
      name: "Mary Okafor",
      phone: "0806 444 5566",
      email: "mary.okafor@example.com",
      location: "Gudu, Abuja",
      orders: 5,
      totalSpent: 117000,
      lastOrder: "Yesterday",
    },
    {
      id: "CUS-10038",
      name: "Emeka Nwachukwu",
      phone: "0807 555 6677",
      email: "emeka.n@example.com",
      location: "Kubwa, Abuja",
      orders: 3,
      totalSpent: 69000,
      lastOrder: "May 19",
    },
  ];

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const query = search.toLowerCase();

      return (
        customer.name.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.location.toLowerCase().includes(query)
      );
    });
  }, [search]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =========================================================
          1. CUSTOMERS PAGE HEADER
      ========================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-2xl font-bold">
                Customers
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View and manage your customers.
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              + New Customer
            </button>

          </div>
        </div>
      </section>


      {/* =========================================================
          2. CUSTOMERS WORKSPACE
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

          {/* Workspace Header */}

          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">
              All Customers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all customer accounts.
            </p>
          </div>


          {/* Search */}

          <div className="border-b border-slate-200 px-6 py-5">
            <label
              htmlFor="customer-search"
              className="sr-only"
            >
              Search customers
            </label>

            <input
              id="customer-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>


          {/* =====================================================
              2.1 DESKTOP CUSTOMER TABLE
          ===================================================== */}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[900px] text-left text-sm">

              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Location
                  </th>

                  <th className="px-6 py-4">
                    Orders
                  </th>

                  <th className="px-6 py-4">
                    Total Spent
                  </th>

                  <th className="px-6 py-4">
                    Last Order
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-900">
                        {customer.name}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {customer.id}
                      </div>

                      <div className="text-xs text-slate-500">
                        {customer.phone}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {customer.location}
                    </td>

                    <td className="px-6 py-5 font-medium text-slate-800">
                      {customer.orders}
                    </td>

                    <td className="px-6 py-5 font-bold text-slate-900">
                      ₦{customer.totalSpent.toLocaleString()}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {customer.lastOrder}
                    </td>

                    <td className="px-6 py-5">
                      <button
                        type="button"
                        className="font-medium text-emerald-700 transition hover:text-emerald-800"
                      >
                        View customer
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>


          {/* =====================================================
              2.2 MOBILE CUSTOMER CARDS
          ===================================================== */}

          <div className="space-y-3 p-4 lg:hidden">

            {filteredCustomers.map((customer) => (
              <article
                key={customer.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <p className="font-semibold text-slate-900">
                      {customer.name}
                    </p>

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
                    <span className="text-slate-500">
                      Phone
                    </span>

                    <span className="text-right font-medium text-slate-800">
                      {customer.phone}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Location
                    </span>

                    <span className="text-right font-medium text-slate-800">
                      {customer.location}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Total spent
                    </span>

                    <span className="font-bold text-slate-900">
                      ₦{customer.totalSpent.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Last order
                    </span>

                    <span className="font-medium text-slate-800">
                      {customer.lastOrder}
                    </span>
                  </div>

                </div>


                <button
                  type="button"
                  className="mt-4 w-full rounded-lg border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  View customer
                </button>

              </article>
            ))}

          </div>


          {/* Empty State */}

          {filteredCustomers.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No customers match your search.
            </div>
          )}

        </div>
      </section>

    </main>
  );
}