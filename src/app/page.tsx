// ============================================================
// ORDERPILOT — OWNER DASHBOARD
// File: src/app/page.tsx
// Purpose: Main business-owner dashboard
// ============================================================
"use client";
// ============================================================
// REACT IMPORTS
// ============================================================

import { useState } from "react";
// ============================================================
// IMPORTS
// ============================================================

import DashboardHeader from "./components/DashboardHeader";
import SummaryCards from "./components/SummaryCards";
import StatusBadge, {
  type OrderStatus,
} from "./components/StatusBadge";
import RiderDetails from "./components/RiderDetails";
import InvoicePanel from "./components/InvoicePanel";
import RecentOrders from "./components/RecentOrders";
import ApprovalPanel from "./components/ApprovalPanel";

import type { Order, Rider } from "./types";
// ============================================================
// SIDEBAR COMPONENT
// ============================================================

import Sidebar from "./components/Sidebar";
// ============================================================
// 1. TYPE DEFINITIONS
// ============================================================

// Available order statuses in the system.
// type OrderStatus =
//   | "Awaiting approval"
//   | "Finding rider"
//   | "Rider assigned"
//   | "Out for delivery"
//   | "Delivered"
//   | "Cancelled";


// Rider information.
// type Rider = {
//   id: string;
//   name: string;
//   phone: string;
//   bike: string;
// };


// Product information inside an order.
type OrderItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

// ============================================================
// 2. MOCK RIDER DATA
// ============================================================
//
// IMPORTANT:
// This is temporary data.
// Later, riders will come from our database/backend.
// ============================================================

const initialRiders: Rider[] = [
  {
    id: "RDR-001",
    name: "Daniel",
    phone: "0806 123 xxx7",
    bike: "Bajaj Boxer • ABJ-218-KD",
    status: "Available",
  },

  {
    id: "RDR-002",
    name: "Michael",
    phone: "0803 456 xxx0",
    bike: "Honda CG125 • ABJ-452-KD",
    status: "Available",
  },
];


// ============================================================
// 3. MOCK ORDER DATA
// ============================================================
//
// IMPORTANT:
// These are temporary orders for UI development.
// Later, orders will come from our backend/database.
// ============================================================

const initialOrders: Order[] = [
  {
    id: "#1042",

    // Customer
    customer: "John",
    customerId: "CUS-10042",
    customerPhone: "0802 111 2233",

    // Products
    items: [
      {
        productName: "Black Shirt",
        quantity: 3,
        unitPrice: 10000,
        subtotal: 30000,
      },
    ],

    // Financials
    subtotal: 30000,
    deliveryFee: 6000,
    total: 36000,

    // Delivery
    location: "Gwarinpa, Abuja",

    // Status
    status: "Awaiting approval",

    // No rider yet
    rider: null,
  },


  {
    id: "#1041",

    // Customer
    customer: "Mary",
    customerId: "CUS-10041",
    customerPhone: "0804 222 3344",

    // Products
    items: [
      {
        productName: "Sneakers",
        quantity: 2,
        unitPrice: 25000,
        subtotal: 50000,
      },
    ],

    // Financials
    subtotal: 50000,
    deliveryFee: 5000,
    total: 55000,

    // Delivery
    location: "Wuse 2, Abuja",

    // Status
    status: "Out for delivery",

    // Assigned rider
    rider: initialRiders[0],
  },


  {
    id: "#1040",

    // Customer
    customer: "David",
    customerId: "CUS-10040",
    customerPhone: "0805 333 4455",

    // Products
    items: [
      {
        productName: "Hoodie",
        quantity: 1,
        unitPrice: 18000,
        subtotal: 18000,
      },
    ],

    // Financials
    subtotal: 18000,
    deliveryFee: 4000,
    total: 22000,

    // Delivery
    location: "Maitama, Abuja",

    // Status
    status: "Delivered",

    // Assigned rider
    rider: initialRiders[1],
  },
];


// ============================================================
// 4. UTILITY FUNCTIONS
// ============================================================

// Formats numbers as Nigerian Naira.
const money = (amount: number) =>
  `₦${amount.toLocaleString("en-NG")}`;


// ============================================================
// 5. STATUS BADGE COMPONENT
// ============================================================

// ============================================================
// 11. ORDER APPROVAL PANEL
// ============================================================

// ============================================================
// 12. MAIN DASHBOARD
// ============================================================

export default function Home() {
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Currently selected order.
  // Later this will be controlled by the dashboard.

  // ============================================================
// 6. SELECTED ORDER STATE
// ============================================================

// ============================================================
// 6. RIDER STATE
// ============================================================

const [riders, setRiders] = useState<Rider[]>(initialRiders);

const [orders, setOrders] = useState<Order[]>(initialOrders);

const [selectedOrder, setSelectedOrder] = useState(initialOrders[0]);

// ============================================================
// 7. ORDER APPROVAL & RIDER ASSIGNMENT LOGIC
// ============================================================

const handleApproveOrder = () => {

  // ==========================================================
  // 7.1 FIND AN AVAILABLE RIDER
  // ==========================================================

  const availableRider = riders.find(
    (rider) => rider.status === "Available"
  );


  // ==========================================================
  // 7.2 NO RIDER AVAILABLE
  // ==========================================================

  if (!availableRider) {

    setSelectedOrder({
      ...selectedOrder,
      status: "Finding rider",
    });

    return;
  }


  // ==========================================================
  // 7.3 ASSIGN THE RIDER TO THE ORDER
  // ==========================================================

  const updatedOrder: Order = {
    ...selectedOrder,
    status: "Rider assigned",
    rider: availableRider,
  };


  // ==========================================================
  // 7.4 UPDATE SELECTED ORDER
  // ==========================================================

  setSelectedOrder(updatedOrder);


  // ==========================================================
  // 7.5 UPDATE ORDERS LIST
  // ==========================================================

  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === selectedOrder.id
        ? updatedOrder
        : order
    )
  );

  // ============================================================
// 7.6 MARK RIDER AS BUSY
// ============================================================

setRiders((currentRiders) =>
  currentRiders.map((rider) =>
    rider.id === availableRider.id
      ? {
          ...rider,
          status: "Busy",
        }
      : rider
  )
);
};

  // ============================================================
// 12. OWNER DASHBOARD LAYOUT
// ============================================================

return (
  <div className="min-h-screen bg-slate-50 text-slate-900">

    {/* ========================================================
        12.1 DESKTOP SIDEBAR
        ======================================================== */}

    <div className="flex min-h-screen">

      <Sidebar
  isMobileOpen={isMobileMenuOpen}
  onClose={() => setIsMobileMenuOpen(false)}
/>
      {/* ======================================================
          12.2 MAIN CONTENT
          ====================================================== */}

      <main className="min-w-0 flex-1 pb-24 lg:pb-0">

            {/* ======================================================
                12.1 HEADER
            ======================================================= */}

            <DashboardHeader
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />


      {/* ======================================================
          12.2 MAIN CONTENT
      ======================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-8">


        {/* ====================================================
            12.2.1 GREETING
        ===================================================== */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold">
            Good morning 👋
          </h2>

          <p className="mt-1 text-slate-500">
            Here&apos;s what&apos;s happening with your orders today.
          </p>

        </div>


        {/* ====================================================
            12.2 SUMMARY CARDS
        ===================================================== */}

        <SummaryCards />


        {/* ====================================================
            12.3 RECENT ORDERS
        ===================================================== */}

                <RecentOrders
          orders={orders}
          onSelectOrder={setSelectedOrder}
        />


        {/* ====================================================
            12.2.4 LOWER DASHBOARD
        ===================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">


          {/* Invoice */}
          <InvoicePanel
            order={selectedOrder}
          />


          {/* Approval */}
                <ApprovalPanel
        order={selectedOrder}
        onApproveOrder={handleApproveOrder}
        />

        </div>

              </section>
      </main>
            {/* ============================================================
          13. MOBILE BOTTOM NAVIGATION
          Visible only on small screens.
          ============================================================ */}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-md md:hidden">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between">

          {/* Dashboard */}
          <button
            type="button"
            className="flex min-w-[52px] flex-col items-center justify-center gap-1 text-xs font-medium text-emerald-700"
          >
            <span className="text-lg">⌂</span>
            <span>Dashboard</span>
          </button>

          {/* Orders */}
          <button
            type="button"
            className="flex min-w-[52px] flex-col items-center justify-center gap-1 text-xs font-medium text-slate-500"
          >
            <span className="text-lg">▣</span>
            <span>Orders</span>
          </button>

          {/* Main action */}
          <button
            type="button"
            aria-label="Create new order"
            className="flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full bg-emerald-600 text-2xl font-light text-white shadow-lg ring-4 ring-white"
          >
            +
          </button>

          {/* Riders */}
          <button
            type="button"
            className="flex min-w-[52px] flex-col items-center justify-center gap-1 text-xs font-medium text-slate-500"
          >
            <span className="text-lg">♙</span>
            <span>Riders</span>
          </button>

          {/* More */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex min-w-[52px] flex-col items-center justify-center gap-1 text-xs font-medium text-slate-500"
          >
            <span className="text-lg">•••</span>
            <span>More</span>
          </button>

        </div>
      </nav>
    </div>
  </div>
);
}
   