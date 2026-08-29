"use client";

import { useMemo, useState } from "react";

type InvoiceStatus = "Paid" | "Pending" | "Unpaid";

type Invoice = {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  email: string;
  amount: number;
  date: string;
  status: InvoiceStatus;
};

const invoices: Invoice[] = [
  {
    id: "INV-10042",
    orderId: "#1042",
    customer: "John Doe",
    phone: "0802 111 2233",
    email: "john@example.com",
    amount: 36000,
    date: "2025-05-20",
    status: "Paid",
  },
  {
    id: "INV-10041",
    orderId: "#1041",
    customer: "Jane Smith",
    phone: "0804 222 3344",
    email: "jane@example.com",
    amount: 27000,
    date: "2025-05-20",
    status: "Pending",
  },
  {
    id: "INV-10040",
    orderId: "#1040",
    customer: "David James",
    phone: "0805 333 4455",
    email: "david@example.com",
    amount: 18500,
    date: "2025-05-19",
    status: "Paid",
  },
  {
    id: "INV-10039",
    orderId: "#1039",
    customer: "Mary Okafor",
    phone: "0806 444 5566",
    email: "mary@example.com",
    amount: 42000,
    date: "2025-05-19",
    status: "Unpaid",
  },
  {
    id: "INV-10038",
    orderId: "#1038",
    customer: "Emeka Nwachukwu",
    phone: "0807 555 6677",
    email: "emeka@example.com",
    amount: 23000,
    date: "2025-05-18",
    status: "Paid",
  },
  {
    id: "INV-10037",
    orderId: "#1037",
    customer: "Sarah Williams",
    phone: "0808 666 7788",
    email: "sarah@example.com",
    amount: 55000,
    date: "2025-05-17",
    status: "Paid",
  },
];

export default function InvoicePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [statementFormat, setStatementFormat] =
    useState<"pdf" | "csv">("pdf");

  const [statementError, setStatementError] = useState("");

  const formatMoney = (amount: number) =>
    `₦${amount.toLocaleString()}`;

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const statusClass = (status: InvoiceStatus) => {
    if (status === "Paid") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "Pending") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-red-100 text-red-700";
  };

  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase().trim();

    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(query) ||
        invoice.orderId.toLowerCase().includes(query) ||
        invoice.customer.toLowerCase().includes(query) ||
        invoice.phone.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        invoice.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  /*
   * Creates a print-friendly invoice window.
   * The browser can then save the invoice as a PDF.
   */
  const downloadInvoicePDF = (invoice: Invoice) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow pop-ups to download the invoice.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${invoice.id}</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #0f172a;
              max-width: 800px;
              margin: auto;
            }

            .header {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }

            h1 {
              margin: 0;
              font-size: 28px;
            }

            .muted {
              color: #64748b;
            }

            .section {
              margin-top: 25px;
            }

            .row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #e2e8f0;
            }

            .total {
              font-size: 22px;
              font-weight: bold;
              margin-top: 20px;
              display: flex;
              justify-content: space-between;
            }

            .status {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 999px;
              background: #d1fae5;
              color: #047857;
              font-weight: bold;
              font-size: 13px;
            }

            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <div>
              <h1>Invoice</h1>
              <p class="muted">${invoice.id}</p>
            </div>

            <div style="text-align:right">
              <strong>Order ${invoice.orderId}</strong>
              <p class="muted">${formatDate(invoice.date)}</p>
            </div>
          </div>

          <div class="section">
            <h3>Bill To</h3>

            <p>
              <strong>${invoice.customer}</strong>
            </p>

            <p class="muted">${invoice.phone}</p>
            <p class="muted">${invoice.email}</p>
          </div>

          <div class="section">
            <h3>Invoice Information</h3>

            <div class="row">
              <span>Invoice number</span>
              <strong>${invoice.id}</strong>
            </div>

            <div class="row">
              <span>Order number</span>
              <strong>${invoice.orderId}</strong>
            </div>

            <div class="row">
              <span>Date</span>
              <strong>${formatDate(invoice.date)}</strong>
            </div>

            <div class="row">
              <span>Status</span>
              <span class="status">${invoice.status}</span>
            </div>
          </div>

          <div class="total">
            <span>Total</span>
            <span>${formatMoney(invoice.amount)}</span>
          </div>

          <p class="muted" style="margin-top:50px;text-align:center">
            Thank you for your business.
          </p>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  /*
   * Share an individual invoice.
   * Uses the device's native share sheet where available.
   */
  const shareInvoice = async (invoice: Invoice) => {
    const shareText = `
Invoice ${invoice.id}
Customer: ${invoice.customer}
Order: ${invoice.orderId}
Amount: ${formatMoney(invoice.amount)}
Date: ${formatDate(invoice.date)}
Status: ${invoice.status}
    `.trim();

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Invoice ${invoice.id}`,
          text: shareText,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        alert("Invoice details copied to clipboard.");
      } else {
        alert(shareText);
      }
    } catch (error) {
      console.log("Share cancelled.", error);
    }
  };

  /*
   * Get invoices inside the selected date range.
   */
  const getStatementInvoices = () => {
    if (!startDate || !endDate) {
      setStatementError("Please select both a start date and an end date.");
      return null;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setStatementError("The start date cannot be after the end date.");
      return null;
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const maximumDate = new Date(start);
    maximumDate.setMonth(maximumDate.getMonth() + 6);

    if (end > maximumDate) {
      setStatementError(
        "The maximum invoice statement period is 6 months."
      );
      return null;
    }

    setStatementError("");

    return invoices.filter((invoice) => {
      const invoiceDate = new Date(`${invoice.date}T12:00:00`);

      return invoiceDate >= start && invoiceDate <= end;
    });
  };

  /*
   * Download statement as CSV.
   */
  const downloadCSV = (statementInvoices: Invoice[]) => {
    const headers = [
      "Invoice Number",
      "Order Number",
      "Customer",
      "Phone",
      "Amount",
      "Date",
      "Status",
    ];

    const rows = statementInvoices.map((invoice) => [
      invoice.id,
      invoice.orderId,
      invoice.customer,
      invoice.phone,
      invoice.amount,
      formatDate(invoice.date),
      invoice.status,
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-statement-${startDate}-to-${endDate}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /*
   * Download a date-range statement.
   */
  const downloadStatement = () => {
    const statementInvoices = getStatementInvoices();

    if (!statementInvoices) return;

    if (statementInvoices.length === 0) {
      setStatementError(
        "There are no invoices within the selected date range."
      );
      return;
    }

    if (statementFormat === "csv") {
      downloadCSV(statementInvoices);
      return;
    }

    /*
     * For PDF statements, open a print-friendly statement.
     * The browser allows the owner to save it as PDF.
     */
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow pop-ups to download the statement.");
      return;
    }

    const total = statementInvoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0
    );

    const rows = statementInvoices
      .map(
        (invoice) => `
          <tr>
            <td>${invoice.id}</td>
            <td>${invoice.orderId}</td>
            <td>${invoice.customer}</td>
            <td>${formatDate(invoice.date)}</td>
            <td>${formatMoney(invoice.amount)}</td>
            <td>${invoice.status}</td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice Statement</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #0f172a;
            }

            h1 {
              margin-bottom: 5px;
            }

            .muted {
              color: #64748b;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 30px;
            }

            th,
            td {
              border-bottom: 1px solid #e2e8f0;
              padding: 12px 8px;
              text-align: left;
              font-size: 13px;
            }

            th {
              background: #f8fafc;
            }

            .summary {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
              font-size: 18px;
              font-weight: bold;
            }

            @media print {
              body {
                padding: 15px;
              }
            }
          </style>
        </head>

        <body>
          <h1>Invoice Statement</h1>

          <p class="muted">
            ${formatDate(startDate)} — ${formatDate(endDate)}
          </p>

          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="summary">
            <span>${statementInvoices.length} invoice(s)</span>
            <span>Total: ${formatMoney(total)}</span>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* PAGE HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Invoice
          </h1>

          <p className="mt-1 text-slate-500">
            View, share, and download customer invoices.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* STATEMENT DOWNLOAD */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Download Invoice Statement
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Download invoices for a selected period. Maximum period is 6 months.
            </p>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_180px_auto]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                From
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                To
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Format
              </label>

              <select
                value={statementFormat}
                onChange={(e) =>
                  setStatementFormat(
                    e.target.value as "pdf" | "csv"
                  )
                }
                className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-600"
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={downloadStatement}
                className="h-12 w-full rounded-lg bg-emerald-700 px-5 font-semibold text-white hover:bg-emerald-800 lg:w-auto"
              >
                Download
              </button>
            </div>
          </div>

          {statementError && (
            <p className="mt-3 text-sm font-medium text-red-600">
              {statementError}
            </p>
          )}
        </div>

        {/* ALL INVOICES */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-6">
            <h2 className="text-2xl font-bold text-slate-900">
              All Invoices
            </h2>

            <p className="mt-1 text-slate-500">
              View and manage invoices generated from customer orders.
            </p>
          </div>

          {/* SEARCH / FILTER */}
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoices..."
                className="h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-emerald-600"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter invoices by status"
                className="h-12 rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-600"
              >
                <option value="all">All statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-t border-slate-200"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-900">
                        {invoice.id}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-900">
                        {invoice.customer}
                      </p>

                      <p className="text-sm text-slate-500">
                        {invoice.phone}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {invoice.orderId}
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-900">
                      {formatMoney(invoice.amount)}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {formatDate(invoice.date)}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedInvoice(invoice)
                          }
                          className="font-medium text-emerald-700 hover:text-emerald-800"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            downloadInvoicePDF(invoice)
                          }
                          className="font-medium text-slate-700 hover:text-slate-900"
                        >
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="space-y-3 p-4 lg:hidden">
            {filteredInvoices.map((invoice) => (
              <article
                key={invoice.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">
                      {invoice.id}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Order {invoice.orderId}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Customer
                    </span>

                    <span className="font-medium text-slate-900">
                      {invoice.customer}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Amount
                    </span>

                    <span className="font-bold text-slate-900">
                      {formatMoney(invoice.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Date
                    </span>

                    <span className="text-slate-700">
                      {formatDate(invoice.date)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(invoice)}
                    className="rounded-lg border border-emerald-600 px-3 py-2.5 text-sm font-semibold text-emerald-700"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadInvoicePDF(invoice)
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    Download
                  </button>
                </div>
              </article>
            ))}

            {filteredInvoices.length === 0 && (
              <div className="px-4 py-12 text-center text-sm text-slate-500">
                No invoices match your search.
              </div>
            )}
          </div>

          {filteredInvoices.length === 0 && (
            <div className="hidden px-6 py-12 text-center text-sm text-slate-500 lg:block">
              No invoices match your search.
            </div>
          )}
        </div>
      </section>

      {/* VIEW INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
          <div className="my-8 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Invoice
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedInvoice.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="text-2xl text-slate-400 hover:text-slate-700"
                aria-label="Close invoice"
              >
                ×
              </button>
            </div>

            {/* INVOICE BODY */}
            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Customer
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {selectedInvoice.customer}
                  </p>

                  <p className="text-sm text-slate-500">
                    {selectedInvoice.phone}
                  </p>

                  <p className="text-sm text-slate-500">
                    {selectedInvoice.email}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                    selectedInvoice.status
                  )}`}
                >
                  {selectedInvoice.status}
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-slate-500">
                    Invoice
                  </span>

                  <span className="font-medium text-slate-900">
                    {selectedInvoice.id}
                  </span>
                </div>

                <div className="flex justify-between py-2 text-sm">
                  <span className="text-slate-500">
                    Order
                  </span>

                  <span className="font-medium text-slate-900">
                    {selectedInvoice.orderId}
                  </span>
                </div>

                <div className="flex justify-between py-2 text-sm">
                  <span className="text-slate-500">
                    Date
                  </span>

                  <span className="font-medium text-slate-900">
                    {formatDate(selectedInvoice.date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                <span className="font-medium text-slate-700">
                  Total
                </span>

                <span className="text-2xl font-bold text-slate-900">
                  {formatMoney(selectedInvoice.amount)}
                </span>
              </div>
            </div>

            {/* MODAL ACTIONS */}
            <div className="grid gap-2 border-t border-slate-200 p-6 sm:grid-cols-3">
              <button
                type="button"
                onClick={() =>
                  shareInvoice(selectedInvoice)
                }
                className="rounded-lg border border-emerald-600 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Share Invoice
              </button>

              <button
                type="button"
                onClick={() =>
                  downloadInvoicePDF(selectedInvoice)
                }
                className="rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Download PDF
              </button>

              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}