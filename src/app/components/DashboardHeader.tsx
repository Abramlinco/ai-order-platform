// ============================================================
// ORDERPILOT — DASHBOARD HEADER
// File: src/app/components/DashboardHeader.tsx
// Purpose: Responsive owner dashboard header
// ============================================================

"use client";

// ============================================================
// 1. IMPORTS
// ============================================================

import { useState } from "react";


// ============================================================
// 2. COMPONENT
// ============================================================

export default function DashboardHeader() {

  // ==========================================================
  // 2.1 MOBILE MENU STATE
  // ==========================================================

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  // ==========================================================
  // 2.2 NAVIGATION ITEMS
  // ==========================================================

  const navigationItems = [
    "Dashboard",
    "Orders",
    "Customers",
    "Products",
    "Riders",
    "Deliveries",
    "Reports",
    "Settings",
  ];


  // ==========================================================
  // 3. HEADER UI
  // ==========================================================

  return (
    <header className="border-b border-slate-200 bg-white">

      {/* ======================================================
          3.1 HEADER CONTENT
          ====================================================== */}

      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ====================================================
            3.2 BRAND
            ==================================================== */}

        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            OrderPilot
          </h1>

          <p className="text-xs text-slate-500">
            AI-powered order & delivery management
          </p>
        </div>


        {/* ====================================================
            3.3 DESKTOP ACTIONS
            ==================================================== */}

        <div className="hidden items-center gap-3 md:flex">

          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Notifications
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
            A
          </div>

        </div>


        {/* ====================================================
            3.4 MOBILE MENU BUTTON
            ==================================================== */}

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-md border border-slate-300 p-2 text-slate-700 hover:bg-slate-50 md:hidden"
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

      </div>


      {/* ======================================================
          4. MOBILE NAVIGATION
          ====================================================== */}

      {isMenuOpen && (
        <nav className="border-t border-slate-200 bg-white md:hidden">

          <div className="space-y-1 px-4 py-3">

            {navigationItems.map((item) => (

              <button
                key={item}
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {item}
              </button>

            ))}

          </div>

        </nav>
      )}

    </header>
  );
}