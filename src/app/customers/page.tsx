"use client";

import { useMemo, useState } from "react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );

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

  const selectedCustomer =
    customers.find((customer) => customer.id === selectedCustomerId) ?? null;

  const openCustomerProfile = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const closeCustomerProfile = () => {
    setSelectedCustomerId(null);
  };

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

          </div>
        </div>
      </section>


      {/* =========================================================
          2. CUSTOMERS WORKSPACE
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-6">

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

          {/* =====================================================
              2.1 WORKSPACE HEADER
          ===================================================== */}

          <div className="border-b border-slate-200 px-6 py-5">

            <h2 className="text-xl font-bold text-slate-900">
              All Customers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all customer accounts.
            </p>

          </div>


          {/* =====================================================
              2.2 SEARCH
          ===================================================== */}

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
              2.3 DESKTOP CUSTOMER TABLE
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

                    {/* CUSTOMER */}

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


                    {/* LOCATION */}

                    <td className="px-6 py-5 text-slate-600">
                      {customer.location}
                    </td>


                    {/* ORDERS */}

                    <td className="px-6 py-5 font-medium text-slate-800">
                      {customer.orders}
                    </td>


                    {/* TOTAL SPENT */}

                    <td className="px-6 py-5 font-bold text-slate-900">
                      ₦{customer.totalSpent.toLocaleString()}
                    </td>


                    {/* LAST ORDER */}

                    <td className="px-6 py-5 text-slate-600">
                      {customer.lastOrder}
                    </td>


                    {/* VIEW CUSTOMER */}

                    <td className="px-6 py-5">

                      <button
                        type="button"
                        onClick={() =>
                          openCustomerProfile(customer.id)
                        }
                        className="font-medium text-emerald-700 transition hover:text-emerald-800 hover:underline"
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
              2.4 MOBILE CUSTOMER CARDS
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

                  {/* PHONE */}

                  <div className="flex justify-between gap-4">

                    <span className="text-slate-500">
                      Phone
                    </span>

                    <span className="text-right font-medium text-slate-800">
                      {customer.phone}
                    </span>

                  </div>


                  {/* LOCATION */}

                  <div className="flex justify-between gap-4">

                    <span className="text-slate-500">
                      Location
                    </span>

                    <span className="text-right font-medium text-slate-800">
                      {customer.location}
                    </span>

                  </div>


                  {/* TOTAL */}

                  <div className="flex justify-between gap-4">

                    <span className="text-slate-500">
                      Total spent
                    </span>

                    <span className="font-bold text-slate-900">
                      ₦{customer.totalSpent.toLocaleString()}
                    </span>

                  </div>


                  {/* LAST ORDER */}

                  <div className="flex justify-between gap-4">

                    <span className="text-slate-500">
                      Last order
                    </span>

                    <span className="font-medium text-slate-800">
                      {customer.lastOrder}
                    </span>

                  </div>

                </div>


                {/* VIEW CUSTOMER */}

                <button
                  type="button"
                  onClick={() =>
                    openCustomerProfile(customer.id)
                  }
                  className="mt-4 w-full rounded-lg border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  View customer
                </button>

              </article>

            ))}

          </div>


          {/* =====================================================
              2.5 EMPTY STATE
          ===================================================== */}

          {filteredCustomers.length === 0 && (

            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No customers match your search.
            </div>

          )}

        </div>

      </section>


      {/* =========================================================
          3. CUSTOMER PROFILE MODAL
      ========================================================= */}

      {selectedCustomer && (

        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-profile-title"
          onMouseDown={(event) => {

            if (event.target === event.currentTarget) {
              closeCustomerProfile();
            }

          }}
        >

          <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl">


            {/* =====================================================
                PROFILE HEADER
            ===================================================== */}

            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Customer profile
                </p>

                <h2
                  id="customer-profile-title"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  {selectedCustomer.name}
                </h2>

                <p className="text-sm text-slate-500">
                  {selectedCustomer.id}
                </p>

              </div>


              {/* CLOSE */}

              <button
                type="button"
                onClick={closeCustomerProfile}
                aria-label="Close customer profile"
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>

            </div>


            {/* =====================================================
                PROFILE CONTENT
            ===================================================== */}

            <div className="space-y-6 p-5 sm:p-6">


              {/* =================================================
                  CONTACT DETAILS
              ================================================= */}

              <section>

                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Contact details
                </h3>


                <div className="mt-3 grid gap-3 sm:grid-cols-2">


                  {/* PHONE */}

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs text-slate-500">
                      Phone
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {selectedCustomer.phone}
                    </p>

                  </div>


                  {/* EMAIL */}

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs text-slate-500">
                      Email
                    </p>

                    <p className="mt-1 break-words font-medium text-slate-900">
                      {selectedCustomer.email}
                    </p>

                  </div>


                  {/* LOCATION */}

                  <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">

                    <p className="text-xs text-slate-500">
                      Location
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {selectedCustomer.location}
                    </p>

                  </div>

                </div>

              </section>


              {/* =================================================
                  CUSTOMER ACTIVITY
              ================================================= */}

              <section>

                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Customer activity
                </h3>


                <div className="mt-3 grid gap-3 sm:grid-cols-3">


                  {/* ORDERS */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs text-slate-500">
                      Orders
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {selectedCustomer.orders}
                    </p>

                  </div>


                  {/* TOTAL SPENT */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs text-slate-500">
                      Total spent
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      ₦{selectedCustomer.totalSpent.toLocaleString()}
                    </p>

                  </div>


                  {/* LAST ORDER */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs text-slate-500">
                      Last order
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {selectedCustomer.lastOrder}
                    </p>

                  </div>

                </div>

              </section>


              {/* =================================================
                  ORDER HISTORY
              ================================================= */}

              <section className="rounded-xl border border-slate-200 p-4">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      Order history
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedCustomer.orders} recorded orders for this customer.
                    </p>

                  </div>


                  <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {selectedCustomer.orders} orders
                  </span>

                </div>

              </section>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}