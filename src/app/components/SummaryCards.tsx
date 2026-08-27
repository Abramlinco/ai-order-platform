// ============================================================
// ORDERPILOT — SUMMARY CARDS
// File: src/app/components/SummaryCards.tsx
// Purpose: Displays key business metrics on the owner dashboard
// ============================================================


// ============================================================
// 1. SUMMARY CARDS COMPONENT
// ============================================================

export default function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">


      {/* ======================================================
          1.1 TODAY'S ORDERS
      ======================================================= */}

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

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


      {/* ======================================================
          1.2 PENDING APPROVAL
      ======================================================= */}

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

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


      {/* ======================================================
          1.3 OUT FOR DELIVERY
      ======================================================= */}

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

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


      {/* ======================================================
          1.4 TODAY'S REVENUE
      ======================================================= */}

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

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
  );
}