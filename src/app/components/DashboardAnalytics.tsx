// ================================================================
// ORDERPILOT — DASHBOARD ANALYTICS
// File: src/app/components/DashboardAnalytics.tsx
// Purpose: Dashboard status, product and sales analytics
// ================================================================

"use client";

import type { Order } from "../types";


// ============================================================
// 1. PROPS
// ============================================================

type DashboardAnalyticsProps = {
  orders: Order[];
};


// ============================================================
// 2. STATUS CONFIGURATION
// ============================================================

const STATUS_CONFIG = [
  {
    label: "Delivered",
    color: "text-emerald-600",
    dot: "bg-emerald-600",
  },
  {
    label: "Out for delivery",
    color: "text-green-600",
    dot: "bg-green-600",
  },
  {
    label: "Pending",
    color: "text-amber-500",
    dot: "bg-amber-500",
  },
  {
    label: "Cancelled",
    color: "text-red-500",
    dot: "bg-red-500",
  },
];


// ============================================================
// 3. HELPER — NORMALIZE ORDER STATUS
// ============================================================

function getStatusGroup(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "delivered") {
    return "Delivered";
  }

  if (
    normalized.includes("delivery") ||
    normalized.includes("rider assigned")
  ) {
    return "Out for delivery";
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("reject")
  ) {
    return "Cancelled";
  }

  return "Pending";
}


// ============================================================
// 4. DONUT SEGMENT HELPER
// ============================================================

function DonutSegment({
  percentage,
  offset,
  className,
}: {
  percentage: number;
  offset: number;
  className: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const dashLength =
    (percentage / 100) * circumference;

  const dashOffset =
    -(offset / 100) * circumference;

  return (
    <circle
      cx="50"
      cy="50"
      r={radius}
      fill="none"
      stroke="currentColor"
      strokeWidth="11"
      strokeDasharray={`${dashLength} ${circumference}`}
      strokeDashoffset={dashOffset}
      strokeLinecap="butt"
      className={className}
      transform="rotate(-90 50 50)"
    />
  );
}


// ============================================================
// 5. MAIN COMPONENT
// ============================================================

export default function DashboardAnalytics({
  orders,
}: DashboardAnalyticsProps) {

  // ==========================================================
  // 5.1 ORDER STATUS COUNTS
  // ==========================================================

  const statusCounts = {
    Delivered: 0,
    "Out for delivery": 0,
    Pending: 0,
    Cancelled: 0,
  };

  orders.forEach((order) => {
    const group = getStatusGroup(order.status);

    statusCounts[
      group as keyof typeof statusCounts
    ] += 1;
  });


  // ==========================================================
  // 5.2 TOTAL ORDERS
  // ==========================================================

  const totalOrders = orders.length;


  // ==========================================================
  // 5.3 STATUS PERCENTAGES
  // ==========================================================

  const statusPercentages = {
    Delivered:
      totalOrders > 0
        ? (statusCounts.Delivered / totalOrders) * 100
        : 0,

    "Out for delivery":
      totalOrders > 0
        ? (statusCounts["Out for delivery"] / totalOrders) * 100
        : 0,

    Pending:
      totalOrders > 0
        ? (statusCounts.Pending / totalOrders) * 100
        : 0,

    Cancelled:
      totalOrders > 0
        ? (statusCounts.Cancelled / totalOrders) * 100
        : 0,
  };


  // ==========================================================
  // 5.4 TOP PRODUCTS
  // ==========================================================

  const productMap = new Map<
    string,
    number
  >();

  orders.forEach((order) => {

    order.items.forEach((item) => {

      const current =
        productMap.get(item.productName) ?? 0;

      productMap.set(
        item.productName,
        current + item.quantity
      );

    });

  });


  const topProducts = Array.from(
    productMap.entries()
  )
    .map(([name, quantity]) => ({
      name,
      quantity,
    }))
    .sort(
      (a, b) =>
        b.quantity - a.quantity
    )
    .slice(0, 5);


  const highestProductQuantity =
    topProducts.length > 0
      ? topProducts[0].quantity
      : 1;


  // ==========================================================
  // 5.5 SALES / ORDER VALUE
  // ==========================================================

  const totalOrderValue = orders.reduce(
    (sum, order) =>
      sum + order.total,
    0
  );


  const deliveredOrderValue =
    orders
      .filter(
        (order) =>
          getStatusGroup(order.status) ===
          "Delivered"
      )
      .reduce(
        (sum, order) =>
          sum + order.total,
        0
      );


  // ==========================================================
  // 5.6 DONUT OFFSETS
  // ==========================================================
  //
  // IMPORTANT:
  // These values are calculated directly from the same
  // percentages used by the chart.
  //
  // There is intentionally NO mutable currentOffset here.
  // This keeps server and client SVG attributes identical
  // and prevents React hydration mismatches.
  // ==========================================================

  const deliveredOffset = 0;

  const outForDeliveryOffset =
    statusPercentages.Delivered;

  const pendingOffset =
    statusPercentages.Delivered +
    statusPercentages["Out for delivery"];

  const cancelledOffset =
    statusPercentages.Delivered +
    statusPercentages["Out for delivery"] +
    statusPercentages.Pending;


  // ==========================================================
  // 6. UI
  // ==========================================================

  return (
    <section className="mt-8">

      {/* ======================================================
          6.1 SECTION INTRO
          ====================================================== */}

      <div className="mb-4">

        <h3 className="text-lg font-semibold text-slate-900">
          Business analytics
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Understand your orders, products, and sales at a glance.
        </p>

      </div>


      {/* ======================================================
          6.2 ANALYTICS GRID
          ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">


        {/* ====================================================
            6.2.1 ORDER STATUS OVERVIEW
            ==================================================== */}

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

          <div>

            <h4 className="text-base font-semibold text-slate-900">
              Order Status Overview
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Current order distribution.
            </p>

          </div>


          <div className="mt-6 flex items-center gap-5">

            {/* ==================================================
                DONUT CHART
                ================================================== */}

            <div className="relative h-36 w-36 shrink-0">

              <svg
                viewBox="0 0 100 100"
                className="h-full w-full"
                aria-label="Order status distribution"
                role="img"
              >

                {/* ==================================================
                    BACKGROUND RING
                    ================================================== */}

                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="11"
                  className="text-slate-100"
                />


                {/* ==================================================
                    DELIVERED
                    ================================================== */}

                <DonutSegment
                  percentage={
                    statusPercentages.Delivered
                  }
                  offset={deliveredOffset}
                  className="text-emerald-600"
                />


                {/* ==================================================
                    OUT FOR DELIVERY
                    ================================================== */}

                <DonutSegment
                  percentage={
                    statusPercentages["Out for delivery"]
                  }
                  offset={outForDeliveryOffset}
                  className="text-green-500"
                />


                {/* ==================================================
                    PENDING
                    ================================================== */}

                <DonutSegment
                  percentage={
                    statusPercentages.Pending
                  }
                  offset={pendingOffset}
                  className="text-amber-500"
                />


                {/* ==================================================
                    CANCELLED
                    ================================================== */}

                <DonutSegment
                  percentage={
                    statusPercentages.Cancelled
                  }
                  offset={cancelledOffset}
                  className="text-red-500"
                />

              </svg>


              {/* ==================================================
                  CENTER TEXT
                  ================================================== */}

              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <p className="text-2xl font-bold text-slate-900">
                  {totalOrders}
                </p>

                <p className="text-[11px] text-slate-500">
                  orders
                </p>

              </div>

            </div>


            {/* ==================================================
                STATUS LEGEND
                ================================================== */}

            <div className="min-w-0 flex-1 space-y-3">

              {STATUS_CONFIG.map(
                (status) => {

                  const percentage =
                    statusPercentages[
                      status.label as keyof typeof statusPercentages
                    ];

                  return (
                    <div
                      key={status.label}
                      className="flex items-center justify-between gap-3"
                    >

                      <div className="flex min-w-0 items-center gap-2">

                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${status.dot}`}
                        />

                        <span
                          className={`truncate text-xs ${status.color}`}
                        >
                          {status.label}
                        </span>

                      </div>

                      <span className="text-xs font-semibold text-slate-700">
                        {Math.round(percentage)}%
                      </span>

                    </div>
                  );

                }
              )}

            </div>

          </div>

        </div>


        {/* ====================================================
            6.2.2 TOP PRODUCTS
            ==================================================== */}

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

          <div>

            <h4 className="text-base font-semibold text-slate-900">
              Top Products
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Best-selling items by quantity.
            </p>

          </div>


          <div className="mt-5 space-y-4">

            {topProducts.length === 0 ? (

              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                No product sales data available yet.
              </div>

            ) : (

              topProducts.map(
                (product, index) => {

                  const width =
                    Math.max(
                      8,
                      (product.quantity /
                        highestProductQuantity) *
                        100
                    );

                  return (
                    <div
                      key={product.name}
                    >

                      <div className="flex items-center justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700">
                            {index + 1}
                          </span>

                          <span className="truncate text-sm font-medium text-slate-700">
                            {product.name}
                          </span>

                        </div>

                        <span className="shrink-0 text-sm font-bold text-slate-900">
                          {product.quantity}
                        </span>

                      </div>


                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{
                            width: `${width}%`,
                          }}
                        />

                      </div>

                    </div>
                  );

                }
              )

            )}

          </div>

        </div>


        {/* ====================================================
            6.2.3 SALES OVERVIEW
            ==================================================== */}

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

          <div className="flex items-start justify-between gap-4">

            <div>

              <h4 className="text-base font-semibold text-slate-900">
                Sales Overview
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Order value and completed sales.
              </p>

            </div>


            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg">
              ₦
            </div>

          </div>


          {/* ==================================================
              SALES FIGURES
              ================================================== */}

          <div className="mt-6">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total order value
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              ₦{totalOrderValue.toLocaleString("en-NG")}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Across currently tracked orders
            </p>

          </div>


          {/* ==================================================
              MINI SALES VISUAL
              ================================================== */}

          <div className="mt-6 rounded-xl bg-slate-50 p-3">

            <svg
              viewBox="0 0 320 90"
              className="h-20 w-full"
              role="img"
              aria-label="Sales trend visualization"
            >

              <path
                d="M5 70 C35 62, 45 66, 70 52 S105 58, 130 45 S165 48, 190 35 S225 44, 250 28 S285 34, 315 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="text-emerald-500"
              />

              <path
                d="M5 70 C35 62, 45 66, 70 52 S105 58, 130 45 S165 48, 190 35 S225 44, 250 28 S285 34, 315 18 L315 85 L5 85 Z"
                className="fill-emerald-50"
              />

            </svg>

          </div>


          {/* ==================================================
              COMPLETED SALES
              ================================================== */}

          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">

            <div>

              <p className="text-xs text-slate-500">
                Delivered sales
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                ₦{deliveredOrderValue.toLocaleString("en-NG")}
              </p>

            </div>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              Completed
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}