// ================================================================
// ORDERPILOT — SUMMARY CARDS
// File: src/app/components/SummaryCards.tsx
// Purpose: Displays key business metrics on the owner dashboard
// ================================================================

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* ============================================================
          1.1 TODAY'S ORDERS
      ============================================================ */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">

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

          <span className="text-xl text-slate-400">
            ›
          </span>
        </div>

        {/* Desktop presentation */}
        <div className="hidden sm:block">
          <p className="text-sm text-slate-500">
            Today&apos;s orders
          </p>

          <p className="mt-2 text-3xl font-bold">
            24
          </p>

          <p className="mt-1 text-sm text-emerald-600">
            +12% from yesterday
          </p>
        </div>
      </div>


      {/* ============================================================
          1.2 PENDING APPROVAL
      ============================================================ */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">

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

          <span className="text-xl text-slate-400">
            ›
          </span>
        </div>

        {/* Desktop presentation */}
        <div className="hidden sm:block">
          <p className="text-sm text-slate-500">
            Pending approval
          </p>

          <p className="mt-2 text-3xl font-bold">
            4
          </p>

          <p className="mt-1 text-sm text-amber-600">
            Requires attention
          </p>
        </div>
      </div>


      {/* ============================================================
          1.3 OUT FOR DELIVERY
      ============================================================ */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">

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

          <span className="text-xl text-slate-400">
            ›
          </span>
        </div>

        {/* Desktop presentation */}
        <div className="hidden sm:block">
          <p className="text-sm text-slate-500">
            Out for delivery
          </p>

          <p className="mt-2 text-3xl font-bold">
            7
          </p>

          <p className="mt-1 text-sm text-blue-600">
            Currently active
          </p>
        </div>
      </div>


      {/* ============================================================
          1.4 TODAY'S REVENUE
      ============================================================ */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">

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

          <span className="text-xl text-slate-400">
            ›
          </span>
        </div>

        {/* Desktop presentation */}
        <div className="hidden sm:block">
          <p className="text-sm text-slate-500">
            Today&apos;s revenue
          </p>

          <p className="mt-2 text-3xl font-bold">
            ₦486,000
          </p>

          <p className="mt-1 text-sm text-emerald-600">
            +8.4% this week
          </p>
        </div>
      </div>

    </div>
  );
}