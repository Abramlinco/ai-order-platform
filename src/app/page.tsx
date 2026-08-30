// ============================================================
// ORDERPILOT — OWNER DASHBOARD
// File: src/app/page.tsx
// Purpose: Main business-owner dashboard
// ============================================================

"use client";

// ============================================================
// 1. IMPORTS
// ============================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SummaryCards from "./components/SummaryCards";
import InvoicePanel from "./components/InvoicePanel";
import RecentOrders from "./components/RecentOrders";
import ApprovalPanel from "./components/ApprovalPanel";
import DashboardAnalytics from "./components/DashboardAnalytics";
import type { Order, Rider } from "./types";


// ============================================================
// 2. MOCK RIDER DATA
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

const initialOrders: Order[] = [
  {
    id: "#1042",

    customer: "John",
    customerId: "CUS-10042",
    customerPhone: "0802 111 2233",

    items: [
      {
        productName: "Black Shirt",
        quantity: 3,
        unitPrice: 10000,
        subtotal: 30000,
      },
    ],

    subtotal: 30000,
    deliveryFee: 6000,
    total: 36000,

    location: "Gwarinpa, Abuja",

    status: "Awaiting approval",

    rider: null,
  },

  {
    id: "#1041",

    customer: "Mary",
    customerId: "CUS-10041",
    customerPhone: "0804 222 3344",

    items: [
      {
        productName: "Sneakers",
        quantity: 2,
        unitPrice: 25000,
        subtotal: 50000,
      },
    ],

    subtotal: 50000,
    deliveryFee: 5000,
    total: 55000,

    location: "Wuse 2, Abuja",

    status: "Out for delivery",

    rider: initialRiders[0],
  },

  {
    id: "#1040",

    customer: "David",
    customerId: "CUS-10040",
    customerPhone: "0805 333 4455",

    items: [
      {
        productName: "Hoodie",
        quantity: 1,
        unitPrice: 18000,
        subtotal: 18000,
      },
    ],

    subtotal: 18000,
    deliveryFee: 4000,
    total: 22000,

    location: "Maitama, Abuja",

    status: "Delivered",

    rider: initialRiders[1],
  },
];


// ============================================================
// 4. MAIN DASHBOARD
// ============================================================

export default function Home() {

  const router = useRouter();

  // ==========================================================
// 4.0 SMART TIME-BASED GREETING
// ==========================================================

const [currentHour, setCurrentHour] = useState<number | null>(null);

useEffect(() => {
  const updateTime = () => {
    setCurrentHour(new Date().getHours());
  };

  updateTime();

  const interval = window.setInterval(updateTime, 60_000);

  return () => {
    window.clearInterval(interval);
  };
}, []);

const isNight =
  currentHour !== null &&
  (currentHour >= 21 || currentHour < 5);

const greeting =
  currentHour === null
    ? "Good morning"
    : currentHour >= 5 && currentHour < 12
      ? "Good morning"
      : currentHour >= 12 && currentHour < 17
        ? "Good afternoon"
        : currentHour >= 17 && currentHour < 21
          ? "Good evening"
          : "Good night";

const greetingEmoji =
  currentHour === null
    ? "👋"
    : currentHour >= 5 && currentHour < 12
      ? "🌅"
      : currentHour >= 12 && currentHour < 17
        ? "☀️"
        : currentHour >= 17 && currentHour < 21
          ? "🌇"
          : "🌙";

  // ==========================================================
  // 4.1 STATE
  // ==========================================================

  const [riders, setRiders] =
    useState<Rider[]>(initialRiders);

  const [orders, setOrders] =
    useState<Order[]>(initialOrders);

  const [selectedOrder, setSelectedOrder] =
    useState<Order>(initialOrders[0]);

  const [isMoreOpen, setIsMoreOpen] =
    useState(false);

  const [isQuickActionsOpen, setIsQuickActionsOpen] =
    useState(false);


  // ==========================================================
  // 5. NORMAL NAVIGATION HELPERS
  // ==========================================================

  const goToOrders = () => {
    setIsQuickActionsOpen(false);
    setIsMoreOpen(false);

    router.push("/orders");
  };


  const goToPendingApproval = () => {
    setIsQuickActionsOpen(false);
    setIsMoreOpen(false);

    router.push("/pending-approval");
  };


  const goToReports = () => {
    setIsQuickActionsOpen(false);
    setIsMoreOpen(false);

    router.push("/Reports");
  };


  const goToRiders = () => {
    setIsQuickActionsOpen(false);
    setIsMoreOpen(false);

    router.push("/riders");
  };


  const goToProducts = () => {
    setIsQuickActionsOpen(false);
    setIsMoreOpen(false);

    router.push("/Products");
  };


  const goToInvoice = () => {
    setIsQuickActionsOpen(false);
    setIsMoreOpen(false);

    router.push("/Invoice");
  };


  // ==========================================================
  // 6. DIRECT ADD ACTIONS
  //
  // These are ONLY used by the mobile + Quick Actions menu.
  //
  // They open the relevant page in ADD mode instead of sending
  // the owner to the normal list page first.
  // ==========================================================

  const goToAddProduct = () => {
    setIsQuickActionsOpen(false);
    setIsMoreOpen(false);

    router.push("/Products?add=1");
  };


  const goToAddRider = () => {
    setIsQuickActionsOpen(false);
    setIsMoreOpen(false);

    router.push("/riders?add=1");
  };


  // ==========================================================
  // 7. ORDER SELECTION
  // ==========================================================

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
  };


  // ==========================================================
  // 8. ORDER APPROVAL & RIDER ASSIGNMENT
  // ==========================================================

  const handleApproveOrder = () => {

    // ========================================================
    // 8.1 FIND AVAILABLE RIDER
    // ========================================================

    const availableRider = riders.find(
      (rider) => rider.status === "Available"
    );


    // ========================================================
    // 8.2 NO RIDER AVAILABLE
    // ========================================================

    if (!availableRider) {

      const updatedOrder: Order = {
        ...selectedOrder,
        status: "Finding rider",
      };


      setSelectedOrder(updatedOrder);


      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === selectedOrder.id
            ? updatedOrder
            : order
        )
      );


      return;
    }


    // ========================================================
    // 8.3 ASSIGN RIDER
    // ========================================================

    const updatedOrder: Order = {
      ...selectedOrder,
      status: "Rider assigned",
      rider: availableRider,
    };


    // ========================================================
    // 8.4 UPDATE SELECTED ORDER
    // ========================================================

    setSelectedOrder(updatedOrder);


    // ========================================================
    // 8.5 UPDATE ORDERS
    // ========================================================

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === selectedOrder.id
          ? updatedOrder
          : order
      )
    );


    // ========================================================
    // 8.6 MARK RIDER BUSY
    // ========================================================

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

// ==========================================================
// 7.7 DECLINE ORDER
// ==========================================================

const handleDeclineOrder = (reason: string) => {

  // ========================================================
  // UPDATE THE SELECTED ORDER
  // ========================================================

  const updatedOrder: Order = {
    ...selectedOrder,

    status: "Cancelled",
  };


  // ========================================================
  // UPDATE SELECTED ORDER
  // ========================================================

  setSelectedOrder(updatedOrder);


  // ========================================================
  // UPDATE ORDERS LIST
  // ========================================================

  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === selectedOrder.id
        ? updatedOrder
        : order
    )
  );


  // ========================================================
  // TEMPORARY DEVELOPMENT LOG
  //
  // Later this becomes the payload sent to the AI/command
  // layer and then to the customer communication system.
  // ========================================================

  console.log(
    `Order ${selectedOrder.id} declined.`,
    {
      reason,
      customer: selectedOrder.customer,
      orderId: selectedOrder.id,
    }
  );
};
  // ============================================================
  // 9. DASHBOARD UI
  // ============================================================

  return (
    <div
  className={`min-h-screen transition-colors duration-700 ${
    isNight
      ? "bg-slate-950 text-slate-100"
      : "bg-slate-50 text-slate-900"
  }`}
>


      {/* ======================================================
          MAIN DASHBOARD CONTENT

          Sidebar and DashboardHeader are intentionally NOT
          rendered here.

          They are already provided globally by AppShell.
          ====================================================== */}

      <main className="min-w-0 pb-24 lg:pb-0">

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">


          {/* ==================================================
              9.1 GREETING
              ================================================== */}

          <div className="mb-8">

           <h2 className="text-3xl font-bold tracking-tight">
  {greeting} {greetingEmoji}
</h2>

<p
  className={`mt-1 transition-colors duration-700 ${
    isNight
      ? "text-slate-400"
      : "text-slate-500"
  }`}
>
  Here&apos;s what&apos;s happening with your orders today.
</p>

          </div>


          {/* ==================================================
              9.2 SUMMARY CARDS
              ================================================== */}

          <SummaryCards />


          {/* ==================================================
              9.3 QUICK DASHBOARD SHORTCUTS
              ================================================== */}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

            {/* ==================================================
                ORDERS
                ================================================== */}

            <button
              type="button"
              onClick={goToOrders}
              className="rounded-xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >

              <p className="text-xs font-medium text-slate-500">
                Orders
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                View orders →
              </p>

            </button>


            {/* ==================================================
                APPROVALS
                ================================================== */}

            <button
              type="button"
              onClick={goToPendingApproval}
              className="rounded-xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >

              <p className="text-xs font-medium text-slate-500">
                Approvals
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                Review pending →
              </p>

            </button>


            {/* ==================================================
                PRODUCTS
                ================================================== */}

            <button
              type="button"
              onClick={goToProducts}
              className="rounded-xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >

              <p className="text-xs font-medium text-slate-500">
                Products
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                Manage products →
              </p>

            </button>


            {/* ==================================================
                REPORTS
                ================================================== */}

            <button
              type="button"
              onClick={goToReports}
              className="rounded-xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >

              <p className="text-xs font-medium text-slate-500">
                Reports
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                View performance →
              </p>

            </button>

          </div>


          {/* ==================================================
              9.4 RECENT ORDERS
              ================================================== */}

          <RecentOrders
            orders={orders}
            onSelectOrder={handleSelectOrder}
          />

{/* ==================================================
    9.5 DASHBOARD ANALYTICS
    ================================================== */}
            <DashboardAnalytics
                orders={orders}
              />

          {/* ==================================================
              9.6 LOWER DASHBOARD
              ================================================== */}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">


            {/* =================================================
                INVOICE
                ================================================= */}

            <InvoicePanel
              order={selectedOrder}
            />


            {/* =================================================
                HUMAN APPROVAL
                ================================================= */}

            <ApprovalPanel
  order={selectedOrder}
  onApproveOrder={handleApproveOrder}
  onDeclineOrder={handleDeclineOrder}
/>

          </div>


          {/* ==================================================
              9.6 DASHBOARD INFORMATION
              ================================================== */}

          <div className="mt-8 grid gap-6 lg:grid-cols-3">


            {/* =================================================
                BUSINESS ACTIVITY
                ================================================= */}

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

              <h3 className="text-base font-semibold">
                Business activity
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Quick access to important business areas.
              </p>


              <div className="mt-5 space-y-2">


                <button
                  type="button"
                  onClick={goToOrders}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <span>Orders</span>
                  <span className="text-slate-400">→</span>
                </button>


                <button
                  type="button"
                  onClick={goToRiders}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <span>Riders</span>
                  <span className="text-slate-400">→</span>
                </button>


                <button
                  type="button"
                  onClick={goToInvoice}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <span>Invoices</span>
                  <span className="text-slate-400">→</span>
                </button>


              </div>

            </div>


            {/* =================================================
                CUSTOMER INSIGHTS
                ================================================= */}

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

              <h3 className="text-base font-semibold">
                Customer insights
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Customer activity and feedback will appear here.
              </p>


              <div className="mt-5 rounded-xl bg-slate-50 p-4">

                <p className="text-sm font-medium text-slate-700">
                  Customer feedback
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Feedback from customers will become an important
                  part of the business report as the system grows.
                </p>

              </div>

            </div>


            {/* =================================================
                RIDER PERFORMANCE
                ================================================= */}

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

              <h3 className="text-base font-semibold">
                Rider performance
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Track delivery activity and rider performance.
              </p>


              <div className="mt-5 space-y-3">

                {riders.map((rider) => {

                  const deliveryCount = orders.filter(
                    (order) =>
                      order.rider?.id === rider.id
                  ).length;


                  return (
                    <div
                      key={rider.id}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                    >

                      <div>

                        <p className="text-sm font-semibold">
                          {rider.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {rider.status}
                        </p>

                      </div>


                      <div className="text-right">

                        <p className="text-sm font-bold">
                          {deliveryCount}
                        </p>

                        <p className="text-xs text-slate-500">
                          deliveries
                        </p>

                      </div>

                    </div>
                  );

                })}

              </div>

            </div>


          </div>

        </section>

      </main>


      {/* ======================================================
          10. MOBILE BOTTOM NAVIGATION
          ====================================================== */}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-md lg:hidden">


        <div className="mx-auto flex h-14 max-w-md items-center justify-between">


          {/* =================================================
              DASHBOARD
              ================================================= */}

          <button
            type="button"
            onClick={() => {
              setIsQuickActionsOpen(false);
              setIsMoreOpen(false);
              router.push("/");
            }}
            className="flex min-w-[52px] flex-col items-center justify-center gap-1 text-xs font-medium text-emerald-700"
          >

            <span className="text-lg">
              ⌂
            </span>

            <span>
              Dashboard
            </span>

          </button>


          {/* =================================================
              ORDERS
              ================================================= */}

          <button
            type="button"
            onClick={goToOrders}
            className="flex min-w-[52px] flex-col items-center justify-center gap-1 text-xs font-medium text-slate-500"
          >

            <span className="text-lg">
              ▣
            </span>

            <span>
              Orders
            </span>

          </button>


          {/* =================================================
              PLUS / QUICK ACTIONS
              ================================================= */}

          <button
            type="button"
            aria-label="Open quick actions"
            onClick={() => {

              setIsQuickActionsOpen(
                (current) => !current
              );

              setIsMoreOpen(false);

            }}
            className="flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full bg-emerald-600 text-2xl font-light text-white shadow-lg ring-4 ring-white transition hover:bg-emerald-700"
          >

            +

          </button>


          {/* =================================================
              RIDERS
              ================================================= */}

          <button
            type="button"
            onClick={goToRiders}
            className="flex min-w-[52px] flex-col items-center justify-center gap-1 text-xs font-medium text-slate-500"
          >

            <span className="text-lg">
              ♙
            </span>

            <span>
              Riders
            </span>

          </button>


          {/* =================================================
              MORE
              ================================================= */}

          <button
            type="button"
            aria-label="Open more options"
            onClick={() => {

              setIsMoreOpen(
                (current) => !current
              );

              setIsQuickActionsOpen(false);

            }}
            className="flex min-w-[52px] flex-col items-center justify-center gap-1 text-xs font-medium text-slate-500"
          >

            <span className="text-lg">
              •••
            </span>

            <span>
              More
            </span>

          </button>

        </div>


        {/* ==================================================
            11. QUICK ACTIONS POPUP
            ================================================== */}

        {isQuickActionsOpen && (

          <div className="absolute bottom-[72px] left-4 right-4 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200">


            <div className="mb-3">

              <h3 className="font-semibold text-slate-900">
                Quick actions
              </h3>

              <p className="text-xs text-slate-500">
                Quickly access common business actions.
              </p>

            </div>


            {/* =================================================
                IMPORTANT:
                NEW ORDER HAS BEEN REMOVED.

                Orders are expected to originate from the
                customer/bot ordering flow rather than being
                manually created by the business owner.
                ================================================= */}

            <div className="grid grid-cols-2 gap-2">


              {/* =================================================
                  ADD PRODUCT
                  ================================================= */}

              <button
                type="button"
                onClick={goToAddProduct}
                className="rounded-xl bg-slate-50 p-3 text-left text-sm font-medium transition hover:bg-slate-100"
              >
                Add product
              </button>


              {/* =================================================
                  ADD RIDER
                  ================================================= */}

              <button
                type="button"
                onClick={goToAddRider}
                className="rounded-xl bg-slate-50 p-3 text-left text-sm font-medium transition hover:bg-slate-100"
              >
                Add rider
              </button>


              {/* =================================================
                  APPROVALS
                  ================================================= */}

              <button
                type="button"
                onClick={goToPendingApproval}
                className="rounded-xl bg-slate-50 p-3 text-left text-sm font-medium transition hover:bg-slate-100"
              >
                Approvals
              </button>


            </div>

          </div>

        )}


        {/* ==================================================
            12. MORE POPUP
            ================================================== */}

        {isMoreOpen && (

          <div className="absolute bottom-[72px] left-4 right-4 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200">


            <div className="mb-3">

              <h3 className="font-semibold text-slate-900">
                More
              </h3>

              <p className="text-xs text-slate-500">
                Business sections and tools.
              </p>

            </div>


            <div className="space-y-1">


              {/* =================================================
                  CUSTOMERS
                  ================================================= */}

              <button
                type="button"
                onClick={() => {

                  setIsMoreOpen(false);
                  setIsQuickActionsOpen(false);

                  router.push("/customers");

                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-slate-50"
              >

                <span>
                  Customers
                </span>

                <span>
                  →
                </span>

              </button>


              {/* =================================================
                  REPORTS
                  ================================================= */}

              <button
                type="button"
                onClick={goToReports}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-slate-50"
              >

                <span>
                  Reports
                </span>

                <span>
                  →
                </span>

              </button>


              {/* =================================================
                  INVOICES
                  ================================================= */}

              <button
                type="button"
                onClick={goToInvoice}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-slate-50"
              >

                <span>
                  Invoices
                </span>

                <span>
                  →
                </span>

              </button>


              {/* =================================================
                  SETTINGS
                  ================================================= */}

              <button
                type="button"
                onClick={() => {

                  setIsMoreOpen(false);
                  setIsQuickActionsOpen(false);

                  router.push("/Settings");

                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-slate-50"
              >

                <span>
                  Settings
                </span>

                <span>
                  →
                </span>

              </button>


            </div>

          </div>

        )}

      </nav>

    </div>
  );
}