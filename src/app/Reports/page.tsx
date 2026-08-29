"use client";

import { useMemo, useState } from "react";

type ReportSection = "sales" | "products" | "customers" | "riders" | "finance";

const reportData = {
  sales: {
    orders: 48,
    completed: 41,
    pending: 4,
    cancelled: 3,
    totalSales: 1250000,
    averageOrder: 26042,
  },
  products: {
    productsSold: 96,
    bestSeller: "Black Shirt",
    lowStock: 4,
    outOfStock: 1,
    stockValue: 2450000,
  },
  customers: {
    total: 128,
    newCustomers: 23,
    repeatCustomers: 37,
    topCustomer: "John Doe",
    topCustomerSpend: 186000,
  },
  riders: {
    deliveries: 41,
    completed: 38,
    active: 2,
    offline: 1,
    averageDelivery: "32 mins",
  },
  finance: {
    revenue: 1250000,
    promotions: 85000,
    deliveryFees: 62000,
    commissions: 37500,
    losses: 12000,
    netRevenue: 1177500,
  },
};

export default function ReportsPage() {
  const [period, setPeriod] = useState("This Month");
  const [openSection, setOpenSection] = useState<ReportSection | null>(null);

  const finance = reportData.finance;

  const revenueBars = useMemo(
    () => [
      { label: "Week 1", value: 28 },
      { label: "Week 2", value: 42 },
      { label: "Week 3", value: 67 },
      { label: "Week 4", value: 54 },
    ],
    []
  );

  const toggleSection = (section: ReportSection) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  const handleDownloadPDF = () => {
    const reportWindow = window.open("", "_blank", "width=1000,height=800");

    if (!reportWindow) {
      alert("Please allow pop-ups to download the report.");
      return;
    }

    const formatMoney = (value: number) =>
      `₦${value.toLocaleString("en-NG")}`;

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Business Report - ${period}</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 40px;
              font-family: Arial, Helvetica, sans-serif;
              color: #0f172a;
              background: white;
            }

            .header {
              border-bottom: 2px solid #047857;
              padding-bottom: 20px;
              margin-bottom: 28px;
            }

            .header h1 {
              margin: 0 0 8px;
              font-size: 28px;
            }

            .header p {
              margin: 0;
              color: #64748b;
            }

            .period {
              margin-top: 12px;
              font-size: 14px;
              color: #475569;
            }

            .section {
              margin-bottom: 28px;
              page-break-inside: avoid;
            }

            .section h2 {
              margin: 0 0 14px;
              font-size: 19px;
              color: #047857;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 8px;
            }

            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
            }

            .card {
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
            }

            .label {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 6px;
            }

            .value {
              font-size: 20px;
              font-weight: 700;
            }

            .finance-total {
              border: 2px solid #047857;
              background: #ecfdf5;
              border-radius: 10px;
              padding: 20px;
              margin-top: 15px;
            }

            .finance-total .value {
              color: #047857;
              font-size: 25px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }

            th,
            td {
              border-bottom: 1px solid #e2e8f0;
              padding: 10px 8px;
              text-align: left;
              font-size: 13px;
            }

            th {
              background: #f8fafc;
            }

            .footer {
              margin-top: 40px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
              font-size: 11px;
              color: #64748b;
              text-align: center;
            }

            @media print {
              body {
                padding: 25px;
              }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <h1>Business Performance Report</h1>
            <p>Sales, products, customers, deliveries and financial performance</p>
            <div class="period">Reporting period: ${period}</div>
          </div>

          <div class="section">
            <h2>Sales Report</h2>

            <div class="grid">
              <div class="card">
                <div class="label">Total Orders</div>
                <div class="value">${reportData.sales.orders}</div>
              </div>

              <div class="card">
                <div class="label">Completed Orders</div>
                <div class="value">${reportData.sales.completed}</div>
              </div>

              <div class="card">
                <div class="label">Cancelled Orders</div>
                <div class="value">${reportData.sales.cancelled}</div>
              </div>

              <div class="card">
                <div class="label">Total Sales</div>
                <div class="value">${formatMoney(reportData.sales.totalSales)}</div>
              </div>

              <div class="card">
                <div class="label">Average Order</div>
                <div class="value">${formatMoney(reportData.sales.averageOrder)}</div>
              </div>

              <div class="card">
                <div class="label">Pending Orders</div>
                <div class="value">${reportData.sales.pending}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Product Report</h2>

            <div class="grid">
              <div class="card">
                <div class="label">Products Sold</div>
                <div class="value">${reportData.products.productsSold}</div>
              </div>

              <div class="card">
                <div class="label">Best Seller</div>
                <div class="value">${reportData.products.bestSeller}</div>
              </div>

              <div class="card">
                <div class="label">Low Stock Items</div>
                <div class="value">${reportData.products.lowStock}</div>
              </div>

              <div class="card">
                <div class="label">Out of Stock</div>
                <div class="value">${reportData.products.outOfStock}</div>
              </div>

              <div class="card">
                <div class="label">Inventory Value</div>
                <div class="value">${formatMoney(reportData.products.stockValue)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Customer Report</h2>

            <div class="grid">
              <div class="card">
                <div class="label">Total Customers</div>
                <div class="value">${reportData.customers.total}</div>
              </div>

              <div class="card">
                <div class="label">New Customers</div>
                <div class="value">${reportData.customers.newCustomers}</div>
              </div>

              <div class="card">
                <div class="label">Repeat Customers</div>
                <div class="value">${reportData.customers.repeatCustomers}</div>
              </div>

              <div class="card">
                <div class="label">Top Customer</div>
                <div class="value">${reportData.customers.topCustomer}</div>
              </div>

              <div class="card">
                <div class="label">Top Customer Spend</div>
                <div class="value">${formatMoney(reportData.customers.topCustomerSpend)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Rider & Delivery Report</h2>

            <div class="grid">
              <div class="card">
                <div class="label">Total Deliveries</div>
                <div class="value">${reportData.riders.deliveries}</div>
              </div>

              <div class="card">
                <div class="label">Completed Deliveries</div>
                <div class="value">${reportData.riders.completed}</div>
              </div>

              <div class="card">
                <div class="label">Active Riders</div>
                <div class="value">${reportData.riders.active}</div>
              </div>

              <div class="card">
                <div class="label">Offline Riders</div>
                <div class="value">${reportData.riders.offline}</div>
              </div>

              <div class="card">
                <div class="label">Average Delivery</div>
                <div class="value">${reportData.riders.averageDelivery}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Financial Report</h2>

            <table>
              <thead>
                <tr>
                  <th>Financial Item</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Total Revenue</td>
                  <td>${formatMoney(finance.revenue)}</td>
                </tr>

                <tr>
                  <td>Promotions / Discounts</td>
                  <td>${formatMoney(finance.promotions)}</td>
                </tr>

                <tr>
                  <td>Delivery Fees</td>
                  <td>${formatMoney(finance.deliveryFees)}</td>
                </tr>

                <tr>
                  <td>Commissions</td>
                  <td>${formatMoney(finance.commissions)}</td>
                </tr>

                <tr>
                  <td>Losses / Adjustments</td>
                  <td>${formatMoney(finance.losses)}</td>
                </tr>
              </tbody>
            </table>

            <div class="finance-total">
              <div class="label">Net Revenue</div>
              <div class="value">${formatMoney(finance.netRevenue)}</div>
            </div>
          </div>

          <div class="footer">
            Generated from the business management dashboard.
          </div>
        </body>
      </html>
    `);

    reportWindow.document.close();

    setTimeout(() => {
      reportWindow.focus();
      reportWindow.print();
    }, 500);
  };

  const StatCard = ({
    label,
    value,
    description,
  }: {
    label: string;
    value: string | number;
    description?: string;
  }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>

      {description && (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );

  const ReportHeader = ({
    title,
    description,
    section,
  }: {
    title: string;
    description: string;
    section: ReportSection;
  }) => {
    const isOpen = openSection === section;

    return (
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xl font-bold text-emerald-700">
          {isOpen ? "−" : "+"}
        </span>
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Reports</h1>

              <p className="mt-2 text-slate-500">
                Understand your sales, products, customers, riders and
                financial performance.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.98]"
            >
              ↓ Download PDF Report
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Period Selector */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Reporting Period</h2>

              <p className="mt-1 text-sm text-slate-500">
                Select the period you want to analyse.
              </p>
            </div>

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
        </section>

        {/* Quick Overview */}
        <section className="mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Business Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A quick look at your business performance.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Revenue"
              value={`₦${finance.revenue.toLocaleString("en-NG")}`}
              description="Total revenue"
            />

            <StatCard
              label="Orders"
              value={reportData.sales.orders}
              description={`${reportData.sales.completed} completed`}
            />

            <StatCard
              label="Customers"
              value={reportData.customers.total}
              description={`${reportData.customers.newCustomers} new`}
            />

            <StatCard
              label="Deliveries"
              value={reportData.riders.deliveries}
              description={`${reportData.riders.completed} completed`}
            />
          </div>
        </section>

        {/* Sales */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5">
            <ReportHeader
              title="Sales"
              description="Track orders, completed sales and average order value."
              section="sales"
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Orders"
                value={reportData.sales.orders}
              />

              <StatCard
                label="Completed"
                value={reportData.sales.completed}
              />

              <StatCard
                label="Pending"
                value={reportData.sales.pending}
              />

              <StatCard
                label="Cancelled"
                value={reportData.sales.cancelled}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSection === "sales"
                  ? "mt-5 max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <StatCard
                  label="Total Sales"
                  value={`₦${reportData.sales.totalSales.toLocaleString(
                    "en-NG"
                  )}`}
                />

                <StatCard
                  label="Average Order Value"
                  value={`₦${reportData.sales.averageOrder.toLocaleString(
                    "en-NG"
                  )}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5">
            <ReportHeader
              title="Products"
              description="Monitor product sales, stock levels and inventory value."
              section="products"
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Products Sold"
                value={reportData.products.productsSold}
              />

              <StatCard
                label="Best Seller"
                value={reportData.products.bestSeller}
              />

              <StatCard
                label="Low Stock"
                value={reportData.products.lowStock}
              />

              <StatCard
                label="Out of Stock"
                value={reportData.products.outOfStock}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSection === "products"
                  ? "mt-5 max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-slate-100 pt-5">
                <StatCard
                  label="Inventory Value"
                  value={`₦${reportData.products.stockValue.toLocaleString(
                    "en-NG"
                  )}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Customers */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5">
            <ReportHeader
              title="Customers"
              description="Understand customer growth, repeat buyers and spending."
              section="customers"
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Customers"
                value={reportData.customers.total}
              />

              <StatCard
                label="New Customers"
                value={reportData.customers.newCustomers}
              />

              <StatCard
                label="Repeat Customers"
                value={reportData.customers.repeatCustomers}
              />

              <StatCard
                label="Top Customer"
                value={reportData.customers.topCustomer}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSection === "customers"
                  ? "mt-5 max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-slate-100 pt-5">
                <StatCard
                  label="Top Customer Spend"
                  value={`₦${reportData.customers.topCustomerSpend.toLocaleString(
                    "en-NG"
                  )}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Riders */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5">
            <ReportHeader
              title="Riders & Delivery"
              description="Monitor deliveries and rider performance."
              section="riders"
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Deliveries"
                value={reportData.riders.deliveries}
              />

              <StatCard
                label="Completed"
                value={reportData.riders.completed}
              />

              <StatCard
                label="Active Riders"
                value={reportData.riders.active}
              />

              <StatCard
                label="Offline Riders"
                value={reportData.riders.offline}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSection === "riders"
                  ? "mt-5 max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-slate-100 pt-5">
                <StatCard
                  label="Average Delivery Time"
                  value={reportData.riders.averageDelivery}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Finance */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5">
            <ReportHeader
              title="Financial"
              description="Understand revenue, promotions, fees, commissions and losses."
              section="finance"
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                label="Revenue"
                value={`₦${finance.revenue.toLocaleString("en-NG")}`}
              />

              <StatCard
                label="Promotions"
                value={`₦${finance.promotions.toLocaleString("en-NG")}`}
              />

              <StatCard
                label="Delivery Fees"
                value={`₦${finance.deliveryFees.toLocaleString("en-NG")}`}
              />

              <StatCard
                label="Commissions"
                value={`₦${finance.commissions.toLocaleString("en-NG")}`}
              />

              <StatCard
                label="Losses / Adjustments"
                value={`₦${finance.losses.toLocaleString("en-NG")}`}
              />

              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm text-emerald-700">Net Revenue</p>

                <p className="mt-2 text-2xl font-bold text-emerald-800">
                  ₦{finance.netRevenue.toLocaleString("en-NG")}
                </p>
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSection === "finance"
                  ? "mt-6 max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-bold text-slate-900">
                  Revenue Breakdown
                </h3>

                <div className="mt-5 space-y-4">
                  {[
                    {
                      label: "Net Revenue",
                      value: finance.netRevenue,
                      percentage: 94,
                    },
                    {
                      label: "Promotions",
                      value: finance.promotions,
                      percentage: 7,
                    },
                    {
                      label: "Delivery Fees",
                      value: finance.deliveryFees,
                      percentage: 5,
                    },
                    {
                      label: "Commissions",
                      value: finance.commissions,
                      percentage: 3,
                    },
                    {
                      label: "Losses",
                      value: finance.losses,
                      percentage: 2,
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {item.label}
                        </span>

                        <span className="font-semibold text-slate-900">
                          ₦{item.value.toLocaleString("en-NG")}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sales Chart */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Revenue Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Revenue generated during the selected reporting period.
              </p>
            </div>

            <span className="text-sm font-medium text-emerald-700">
              {period}
            </span>
          </div>

          {/* Bar Chart */}
          <div className="mt-8 flex h-64 items-end justify-between gap-3 border-b border-l border-slate-200 px-2 pb-0 pt-5 sm:gap-6">
            {revenueBars.map((bar) => (
              <div
                key={bar.label}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="text-xs font-semibold text-slate-600">
                  ₦{bar.value}k
                </div>

                <div
                  className="w-full max-w-20 rounded-t-lg bg-emerald-600 transition-all duration-500 hover:bg-emerald-700"
                  style={{ height: `${bar.value}%` }}
                  title={`${bar.label}: ₦${bar.value}k`}
                />

                <span className="pb-2 text-xs text-slate-500">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>

          {/* Finance Composition */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-bold text-slate-900">
                Financial Composition
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                How the current financial figures are distributed.
              </p>

              <div className="mt-6 flex items-center gap-6">
                <div
                  className="h-40 w-40 shrink-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#047857 0deg 250deg, #f59e0b 250deg 285deg, #3b82f6 285deg 315deg, #8b5cf6 315deg 335deg, #ef4444 335deg 360deg)",
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center shadow-sm">
                      <div>
                        <p className="text-xs text-slate-500">Revenue</p>
                        <p className="text-sm font-bold text-slate-900">
                          ₦1.25m
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold text-emerald-700">
                      ●
                    </span>{" "}
                    Revenue
                  </div>

                  <div>
                    <span className="font-semibold text-amber-500">●</span>{" "}
                    Promotions
                  </div>

                  <div>
                    <span className="font-semibold text-blue-500">●</span>{" "}
                    Delivery Fees
                  </div>

                  <div>
                    <span className="font-semibold text-purple-500">●</span>{" "}
                    Commissions
                  </div>

                  <div>
                    <span className="font-semibold text-red-500">●</span>{" "}
                    Losses
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <h3 className="font-bold text-slate-900">
                Report Summary
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your business generated{" "}
                <strong className="text-slate-900">
                  ₦{finance.revenue.toLocaleString("en-NG")}
                </strong>{" "}
                in revenue during this reporting period. After promotions,
                commissions, losses and other adjustments, the estimated net
                revenue is{" "}
                <strong className="text-emerald-700">
                  ₦{finance.netRevenue.toLocaleString("en-NG")}
                </strong>
                .
              </p>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="mt-6 w-full rounded-lg border border-emerald-600 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 active:scale-[0.98]"
              >
                Download Full Report
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}