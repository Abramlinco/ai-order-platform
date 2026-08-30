// ============================================================
// ORDERPILOT — APPLICATION SIDEBAR
// File: src/app/components/Sidebar.tsx
// Purpose: Desktop sidebar + mobile navigation drawer
// ============================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


// ============================================================
// 1. ICONS
// ============================================================

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
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
    >
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}


function PendingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
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
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 11a3 3 0 1 0 0-6" />
      <path d="M16 14.5a5.5 5.5 0 0 1 4.5 5.5" />
    </svg>
  );
}


function ProductsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4.5 7.5 7.5 4 7.5-4" />
      <path d="M12 11.5V21" />
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
    >
      <circle cx="6" cy="17" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path d="M6 17h4l3-6h3l2 3h-4" />
      <path d="M10 17 8.5 12H12" />
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
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6v-2.6h.5A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.6h-.2a1.7 1.7 0 0 0-1.5 1.3Z" />
    </svg>
  );
}


// ============================================================
// 2. NAVIGATION CONFIGURATION
// ============================================================

const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: DashboardIcon,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: OrdersIcon,
  },
  {
    label: "Pending Approval",
    href: "/pending-approval",
    icon: PendingIcon,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: CustomersIcon,
  },
  {
    label: "Products",
    href: "/Products",
    icon: ProductsIcon,
  },
  {
    label: "Riders",
    href: "/riders",
    icon: RiderIcon,
  },
  {
    label: "Invoice",
    href: "/Invoice",
    icon: InvoiceIcon,
  },
  {
    label: "Reports",
    href: "/Reports",
    icon: ReportsIcon,
  },
  {
    label: "Settings",
    href: "/Settings",
    icon: SettingsIcon,
  },
];


// ============================================================
// 3. PROPS
// ============================================================

type SidebarProps = {
  isMobileOpen?: boolean;
  onClose?: () => void;
};


// ============================================================
// 4. SIDEBAR COMPONENT
// ============================================================

export default function Sidebar({
  isMobileOpen = false,
  onClose,
}: SidebarProps) {

  const pathname = usePathname();


  // ==========================================================
  // 4.1 ACTIVE STATE
  // ==========================================================

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };


  // ==========================================================
  // 5. NAVIGATION CONTENT
  // ==========================================================

  const navigation = (
    <nav className="flex-1 overflow-y-auto px-3 py-5">

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Main Menu
      </p>

      <div className="space-y-1">

        {navigationItems.map((item) => {

          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`group flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-emerald-50 text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >

              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition ${
                  active
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-slate-500 group-hover:text-slate-800"
                }`}
              >
                <Icon />
              </span>

              <span className="truncate">
                {item.label}
              </span>

            </Link>
          );
        })}

      </div>

    </nav>
  );


  // ==========================================================
  // 6. MOBILE SIDEBAR
  // ==========================================================

  return (
    <>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Backdrop */}

          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={onClose}
          />


          {/* Drawer */}

          <aside className="relative z-10 flex h-full w-[280px] max-w-[85vw] flex-col bg-white shadow-2xl">

            {/* Brand */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-sm font-bold text-white">
                  O
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    OrderPilot
                  </h2>

                  <p className="text-[11px] text-slate-500">
                    Order management
                  </p>
                </div>

              </div>


              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>

            </div>


            {navigation}


            {/* Owner */}

            <div className="border-t border-slate-200 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
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

        </div>
      )}


      {/* ======================================================
          7. DESKTOP SIDEBAR
          ====================================================== */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">

        {/* Brand */}

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-sm font-bold text-white">
              O
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                OrderPilot
              </h2>

              <p className="text-xs text-slate-500">
                AI-powered order management
              </p>

            </div>

          </div>

        </div>


        {navigation}


        {/* Owner profile */}

        <div className="border-t border-slate-200 p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
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

    </>
  );
}