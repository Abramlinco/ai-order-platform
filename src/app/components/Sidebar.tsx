// ============================================================
// ORDERPILOT — DESKTOP SIDEBAR
// File: src/app/components/Sidebar.tsx
// Purpose: Main desktop navigation for the owner dashboard
// ============================================================

"use client";

// ============================================================
// 1. IMPORTS
// ============================================================

import { useState } from "react";


// ============================================================
// 2. NAVIGATION ITEMS
// ============================================================

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


// ============================================================
// 3. SIDEBAR COMPONENT
// ============================================================

export default function Sidebar() {

  // ==========================================================
  // 3.1 ACTIVE NAVIGATION
  // ==========================================================

  const [activeItem, setActiveItem] = useState("Dashboard");


  // ==========================================================
  // 4. SIDEBAR UI
  // ==========================================================

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">

      {/* ======================================================
          4.1 BUSINESS BRAND
          ====================================================== */}

      <div className="border-b border-slate-200 px-6 py-5">

        <h2 className="text-lg font-bold text-slate-900">
          OrderPilot
        </h2>

        <p className="text-xs text-slate-500">
          AI-powered order management
        </p>

      </div>


      {/* ======================================================
          4.2 MAIN NAVIGATION
          ====================================================== */}

      <nav className="flex-1 px-3 py-5">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <div className="space-y-1">

          {navigationItems.map((item) => (

            <button
              key={item}
              type="button"
              onClick={() => setActiveItem(item)}
              className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                activeItem === item
                  ? "bg-emerald-700 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </nav>


      {/* ======================================================
          4.3 OWNER PROFILE
          ====================================================== */}

      <div className="border-t border-slate-200 p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
            A
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-slate-900">
              Owner
            </p>

            <p className="text-xs text-emerald-600">
              Online
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}