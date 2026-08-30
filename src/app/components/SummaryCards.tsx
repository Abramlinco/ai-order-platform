// ================================================================
// ORDERPILOT — SUMMARY CARDS
// File: src/app/components/SummaryCards.tsx
// Purpose: Displays key business metrics on the owner dashboard
// ================================================================

"use client";

import { useRouter } from "next/navigation";


// ================================================================
// 1. SUMMARY CARDS
// ================================================================

export default function SummaryCards() {

  const router = useRouter();


  // ============================================================
  // 1.1 NAVIGATION
  // ============================================================

  const goToOrders = () => {
    router.push("/orders");
  };


  const goToPendingApproval = () => {
    router.push("/pending-approval");
  };


  const goToOutForDelivery = () => {
    router.push("/orders");
  };


  const goToReports = () => {
    router.push("/Reports");
  };


  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">


      {/* ============================================================
          1.2 TODAY'S ORDERS
      ============================================================ */}

      <button
        type="button"
        onClick={goToOrders}
        className="group w-full rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-emerald-200 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:p-5"
        aria-label="View today's orders"
      >

        {/* Mobile presentation */}

        <div className="flex items-center gap-3 sm:hidden">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl">
            🛍️
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-medium text-slate-700">
              Today&apos;s Orders
            </p>

            <div className="mt-1 flex items-center gap-2">

              <p className="text-2xl font-bold text-slate-900">
                24
              </p>

              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                +12%
              </span>

            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              vs yesterday
            </p>

          </div>

          <span className="text-xl text-slate-400 transition-transform duration-200 group-hover:translate-x-1">
            ›
          </span>

        </div>


        {/* Desktop presentation */}

        <div className="hidden sm:block">

          <div className="flex items-start justify-between gap-3">

            <div>

              <p className="text-sm text-slate-500">
                Today&apos;s orders
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                24
              </p>

              <p className="mt-1 text-sm text-emerald-600">
                +12% from yesterday
              </p>

            </div>

            <span className="text-xl text-slate-300 transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>

          </div>

        </div>

      </button>


      {/* ============================================================
          1.3 PENDING APPROVAL
      ============================================================ */}

      <button
        type="button"
        onClick={goToPendingApproval}
        className="group w-full rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-amber-200 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 sm:p-5"
        aria-label="View pending approvals"
      >

        {/* Mobile presentation */}

        <div className="flex items-center gap-3 sm:hidden">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl">
            🕐
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-medium text-slate-700">
              Pending Approval
            </p>

            <div className="mt-1 flex items-center gap-2">

              <p className="text-2xl font-bold text-slate-900">
                4
              </p>

              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                -8%
              </span>

            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              vs yesterday
            </p>

          </div>

          <span className="text-xl text-slate-400 transition-transform duration-200 group-hover:translate-x-1">
            ›
          </span>

        </div>


        {/* Desktop presentation */}

        <div className="hidden sm:block">

          <div className="flex items-start justify-between gap-3">

            <div>

              <p className="text-sm text-slate-500">
                Pending approval
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                4
              </p>

              <p className="mt-1 text-sm text-amber-600">
                Requires attention
              </p>

            </div>

            <span className="text-xl text-slate-300 transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>

          </div>

        </div>

      </button>


      {/* ============================================================
          1.4 OUT FOR DELIVERY
      ============================================================ */}

      <button
        type="button"
        onClick={goToOutForDelivery}
        className="group w-full rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-blue-200 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:p-5"
        aria-label="View orders out for delivery"
      >

        {/* Mobile presentation */}

        <div className="flex items-center gap-3 sm:hidden">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl">
            🚚
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-medium text-slate-700">
              Out for Delivery
            </p>

            <div className="mt-1 flex items-center gap-2">

              <p className="text-2xl font-bold text-slate-900">
                7
              </p>

              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                +5%
              </span>

            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              vs yesterday
            </p>

          </div>

          <span className="text-xl text-slate-400 transition-transform duration-200 group-hover:translate-x-1">
            ›
          </span>

        </div>


        {/* Desktop presentation */}

        <div className="hidden sm:block">

          <div className="flex items-start justify-between gap-3">

            <div>

              <p className="text-sm text-slate-500">
                Out for delivery
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                7
              </p>

              <p className="mt-1 text-sm text-blue-600">
                Currently active
              </p>

            </div>

            <span className="text-xl text-slate-300 transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>

          </div>

        </div>

      </button>


      {/* ============================================================
          1.5 TODAY'S REVENUE
      ============================================================ */}

      <button
        type="button"
        onClick={goToReports}
        className="group w-full rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-purple-200 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 sm:p-5"
        aria-label="View today's revenue reports"
      >

        {/* Mobile presentation */}

        <div className="flex items-center gap-3 sm:hidden">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xl">
            💼
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-medium text-slate-700">
              Today&apos;s Revenue
            </p>

            <div className="mt-1 flex items-center gap-2">

              <p className="text-2xl font-bold text-slate-900">
                ₦486,000
              </p>

              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                +8.4%
              </span>

            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              vs last week
            </p>

          </div>

          <span className="text-xl text-slate-400 transition-transform duration-200 group-hover:translate-x-1">
            ›
          </span>

        </div>


        {/* Desktop presentation */}

        <div className="hidden sm:block">

          <div className="flex items-start justify-between gap-3">

            <div>

              <p className="text-sm text-slate-500">
                Today&apos;s revenue
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                ₦486,000
              </p>

              <p className="mt-1 text-sm text-emerald-600">
                +8.4% this week
              </p>

            </div>

            <span className="text-xl text-slate-300 transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>

          </div>

        </div>

      </button>

    </div>
  );
}