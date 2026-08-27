// ============================================================
// ORDERPILOT — DASHBOARD HEADER
// File: src/app/components/DashboardHeader.tsx
// Purpose: Business owner dashboard header
// ============================================================


// ============================================================
// 1. DASHBOARD HEADER COMPONENT
// ============================================================

export default function DashboardHeader() {
  return (
    <header className="border-b bg-white">

      {/* ======================================================
          1.1 HEADER CONTAINER
      ======================================================= */}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">


        {/* ====================================================
            1.2 BRAND INFORMATION
        ===================================================== */}

        <div>

          <h1 className="text-2xl font-bold tracking-tight">
            OrderPilot
          </h1>

          <p className="text-sm text-slate-500">
            AI-powered order &amp; delivery management
          </p>

        </div>


        {/* ====================================================
            1.3 HEADER ACTIONS
        ===================================================== */}

        <div className="flex items-center gap-3">


          {/* Notifications */}

          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Notifications
          </button>


          {/* ==================================================
              1.4 BUSINESS OWNER AVATAR
          =================================================== */}

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 font-semibold text-white">
            A
          </div>

        </div>

      </div>

    </header>
  );
}