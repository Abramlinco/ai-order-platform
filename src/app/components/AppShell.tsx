// ============================================================
// ORDERPILOT — APPLICATION SHELL
// File: src/app/components/AppShell.tsx
// Purpose: Global desktop/mobile navigation shell
// ============================================================

"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";


// ============================================================
// 1. PROPS
// ============================================================

type AppShellProps = {
  children: ReactNode;
};


// ============================================================
// 2. ICONS
// ============================================================

function HomeIcon({ active = false }: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}


function OrdersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}


function RiderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="6" cy="17" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path d="M6 17h4l3-6h3l2 3h-4" />
      <path d="M10 17 8.5 12H12" />
    </svg>
  );
}


function MoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}


function PlusIcon({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`h-6 w-6 transition-transform duration-200 ${
        open ? "rotate-45" : ""
      }`}
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}


function ProductIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4.5 7.5 7.5 4 7.5-4" />
      <path d="M12 11.5V21" />
    </svg>
  );
}


function ApprovalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}


function CustomersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 11a3 3 0 1 0 0-6" />
      <path d="M16 14.5a5.5 5.5 0 0 1 4.5 5.5" />
    </svg>
  );
}


function InvoiceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 3h9l4 4v14H6V3Z" />
      <path d="M15 3v5h4" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  );
}


function ReportsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 20V10" />
      <path d="M10 20V5" />
      <path d="M16 20v-8" />
      <path d="M22 20H2" />
    </svg>
  );
}


function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6v-2.6h.5A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.6h-.2a1.7 1.7 0 0 0-1.5 1.3Z"
      />
    </svg>
  );
}


// ============================================================
// 3. APPLICATION SHELL
// ============================================================

export default function AppShell({
  children,
}: AppShellProps) {

  // ==========================================================
  // 3.1 GLOBAL MOBILE SIDEBAR STATE
  // ==========================================================

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);


  // ==========================================================
  // 3.2 GLOBAL MOBILE ACTION MENU STATE
  // ==========================================================

  const [isQuickActionsOpen, setIsQuickActionsOpen] =
    useState(false);

  const [isMoreOpen, setIsMoreOpen] = useState(false);


  // ==========================================================
  // 3.3 CURRENT ROUTE
  // ==========================================================

  const pathname = usePathname();


  // ==========================================================
  // 3.4 HELPERS
  // ==========================================================

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };


  const closeMobileMenus = () => {
    setIsQuickActionsOpen(false);
    setIsMoreOpen(false);
  };


  const toggleQuickActions = () => {
    setIsQuickActionsOpen((current) => !current);
    setIsMoreOpen(false);
  };


  const toggleMore = () => {
    setIsMoreOpen((current) => !current);
    setIsQuickActionsOpen(false);
  };


  // ==========================================================
  // 4. SHELL UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================================
          4.1 DESKTOP / MOBILE SIDEBAR
          ====================================================== */}

      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />


      {/* ======================================================
          4.2 MAIN APPLICATION AREA
          ====================================================== */}

      <div className="min-h-screen lg:pl-64">

        {/* ====================================================
            4.2.1 GLOBAL HEADER
            ==================================================== */}

        <DashboardHeader
          onMenuClick={() =>
            setIsMobileSidebarOpen(true)
          }
        />


        {/* ====================================================
            4.2.2 CURRENT PAGE
            ==================================================== */}

        <main className="w-full pb-24 lg:pb-0">
          {children}
        </main>

      </div>


      {/* ======================================================
          4.3 MOBILE QUICK-ACTION BACKDROP
          ====================================================== */}

      {(isQuickActionsOpen || isMoreOpen) && (
        <button
          type="button"
          aria-label="Close mobile menu"
          onClick={closeMobileMenus}
          className="fixed inset-0 z-40 bg-slate-900/10 lg:hidden"
        />
      )}


      {/* ======================================================
          4.4 MOBILE QUICK ACTIONS
          ====================================================== */}

      {isQuickActionsOpen && (
        <div
          className="
            fixed
            bottom-[82px]
            left-4
            right-4
            z-50
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-2xl
            lg:hidden
          "
        >

          <div className="mb-4">

            <h3 className="text-sm font-semibold text-slate-900">
              Quick actions
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Quickly access common business actions.
            </p>

          </div>


          <div className="grid grid-cols-2 gap-2">

            {/* ==================================================
                ADD PRODUCT
                Opens the Add Product form directly
                ================================================== */}

            <Link
              href="/Products?add=true"
              onClick={closeMobileMenus}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                bg-slate-50
                p-3
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >

              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <ProductIcon />
              </span>

              <span>Add product</span>

            </Link>


            {/* ==================================================
                ADD RIDER
                Opens the Add Rider form directly
                ================================================== */}

            <Link
              href="/riders?add=true"
              onClick={closeMobileMenus}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                bg-slate-50
                p-3
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >

              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <RiderIcon />
              </span>

              <span>Add rider</span>

            </Link>


            {/* ==================================================
                APPROVALS
                ================================================== */}

            <Link
              href="/pending-approval"
              onClick={closeMobileMenus}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                bg-slate-50
                p-3
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >

              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <ApprovalIcon />
              </span>

              <span>Approvals</span>

            </Link>

          </div>

        </div>
      )}


      {/* ======================================================
          4.5 MOBILE MORE MENU
          ====================================================== */}

      {isMoreOpen && (
        <div
          className="
            fixed
            bottom-[82px]
            left-4
            right-4
            z-50
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-2xl
            lg:hidden
          "
        >

          <div className="mb-3">

            <h3 className="text-sm font-semibold text-slate-900">
              More
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Business sections and tools.
            </p>

          </div>


          <div className="space-y-1">

            {/* ==================================================
                CUSTOMERS
                ================================================== */}

            <Link
              href="/customers"
              onClick={closeMobileMenus}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <CustomersIcon />
              <span>Customers</span>
            </Link>


            {/* ==================================================
                INVOICES
                ================================================== */}

            <Link
              href="/Invoice"
              onClick={closeMobileMenus}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <InvoiceIcon />
              <span>Invoices</span>
            </Link>


            {/* ==================================================
                REPORTS
                ================================================== */}

            <Link
              href="/Reports"
              onClick={closeMobileMenus}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ReportsIcon />
              <span>Reports</span>
            </Link>


            {/* ==================================================
                SETTINGS
                ================================================== */}

            <Link
              href="/Settings"
              onClick={closeMobileMenus}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <SettingsIcon />
              <span>Settings</span>
            </Link>

          </div>

        </div>
      )}

      {/* ======================================================
          4.6 GLOBAL MOBILE BOTTOM NAVIGATION
          ====================================================== */}

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(15,23,42,0.06)] lg:hidden"
        aria-label="Mobile navigation"
      >

        <div className="mx-auto flex h-[72px] max-w-lg items-center justify-around">

          {/* ==================================================
              DASHBOARD
              ================================================== */}

          <Link
            href="/"
            onClick={closeMobileMenus}
            className={
              isActive("/")
                ? "flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl bg-emerald-50 px-2 py-1.5 text-[11px] font-medium text-emerald-700 transition"
                : "flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium text-slate-500 transition hover:text-slate-800"
            }
          >
            <HomeIcon active={isActive("/")} />
            <span>Dashboard</span>
          </Link>


          {/* ==================================================
              ORDERS
              ================================================== */}

          <Link
            href="/orders"
            onClick={closeMobileMenus}
            className={
              isActive("/orders")
                ? "flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl bg-emerald-50 px-2 py-1.5 text-[11px] font-medium text-emerald-700 transition"
                : "flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium text-slate-500 transition hover:text-slate-800"
            }
          >
            <OrdersIcon />
            <span>Orders</span>
          </Link>


          {/* ==================================================
              MAIN ACTION / QUICK ACTIONS
              ================================================== */}

          <button
            type="button"
            aria-label={
              isQuickActionsOpen
                ? "Close quick actions"
                : "Open quick actions"
            }
            aria-expanded={isQuickActionsOpen}
            onClick={toggleQuickActions}
            className="flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg ring-4 ring-white transition hover:bg-emerald-800 active:scale-95"
          >
            <PlusIcon open={isQuickActionsOpen} />
          </button>


          {/* ==================================================
              RIDERS
              ================================================== */}

          <Link
            href="/riders"
            onClick={closeMobileMenus}
            className={
              isActive("/riders")
                ? "flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl bg-emerald-50 px-2 py-1.5 text-[11px] font-medium text-emerald-700 transition"
                : "flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium text-slate-500 transition hover:text-slate-800"
            }
          >
            <RiderIcon />
            <span>Riders</span>
          </Link>


          {/* ==================================================
              MORE
              ================================================== */}

          <button
            type="button"
            aria-label={
              isMoreOpen
                ? "Close more options"
                : "Open more options"
            }
            aria-expanded={isMoreOpen}
            onClick={toggleMore}
            className={
              isMoreOpen
                ? "flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl bg-emerald-50 px-2 py-1.5 text-[11px] font-medium text-emerald-700 transition"
                : "flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium text-slate-500 transition hover:text-slate-800"
            }
          >
            <MoreIcon />
            <span>More</span>
          </button>

        </div>

      </nav>
    </div>
  );
}