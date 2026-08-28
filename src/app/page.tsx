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

const riders: Rider[] = [
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
    rider: riders[1],
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
    rider: riders[0],
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
//
// Displays the current order status.
// ============================================================

// function StatusBadge({
//   status,
// }: {
//   status: OrderStatus;
// }) {
//   const styles: Record<OrderStatus, string> = {
//     "Awaiting approval":
//       "bg-amber-100 text-amber-700",

//     "Finding rider":
//       "bg-purple-100 text-purple-700",

//     "Rider assigned":
//       "bg-indigo-100 text-indigo-700",

//     "Out for delivery":
//       "bg-blue-100 text-blue-700",

//     Delivered:
//       "bg-emerald-100 text-emerald-700",

//     Cancelled:
//       "bg-red-100 text-red-700",
//   };

//   return (
//     <span
//       className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
//     >
//       {status}
//     </span>
//   );
// }


// ============================================================
// 6. RIDER DETAILS COMPONENT
// ============================================================
//
// Displays:
// - Rider name
// - Rider phone
// - Bike details
// - Rider ID
//
// If no rider has been assigned, it displays the appropriate
// message instead.
// ============================================================

// function RiderDetails({
//   rider,
// }: {
//   rider: Rider | null;
// }) {
//   // No rider assigned
//   if (!rider) {
//     return (
//       <div>
//         <p className="font-medium text-slate-400">
//           Not assigned
//         </p>

//         <p className="mt-1 text-xs text-slate-400">
//           Awaiting rider dispatch
//         </p>
//       </div>
//     );
//   }


//   // Rider assigned
//   return (
//     <div className="min-w-[180px]">

//       {/* Rider name */}
//       <p className="font-semibold text-slate-900">
//         {rider.name}
//       </p>

//       {/* Rider phone */}
//       <p className="mt-1 text-xs text-slate-500">
//         {rider.phone}
//       </p>

//       {/* Bike details */}
//       <p className="mt-1 text-xs text-slate-500">
//         {rider.bike}
//       </p>

//       {/* Rider ID */}
//       <p className="mt-1 text-[11px] text-slate-400">
//         Rider ID: {rider.id}
//       </p>

//     </div>
//   );
// }


// ============================================================
// 7. DASHBOARD HEADER
// ============================================================

// function DashboardHeader() {
//   return (
//     <header className="border-b bg-white">

//       <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

//         {/* Brand */}
//         <div>

//           <h1 className="text-2xl font-bold tracking-tight">
//             OrderPilot
//           </h1>

//           <p className="text-sm text-slate-500">
//             AI-powered order & delivery management
//           </p>

//         </div>


//         {/* Header actions */}
//         <div className="flex items-center gap-3">

//           <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
//             Notifications
//           </button>


//           {/* User avatar */}
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 font-semibold text-white">
//             A
//           </div>

//         </div>

//       </div>

//     </header>
//   );
// }


// ============================================================
// 7. SUMMARY CARDS
// ============================================================

// function SummaryCards() {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">


//       {/* Today's orders */}
//       <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

//         <p className="text-sm text-slate-500">
//           Today&apos;s orders
//         </p>

//         <p className="mt-2 text-3xl font-bold">
//           24
//         </p>

//         <p className="mt-1 text-sm text-emerald-600">
//           +12% from yesterday
//         </p>

//       </div>


//       {/* Pending approval */}
//       <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

//         <p className="text-sm text-slate-500">
//           Pending approval
//         </p>

//         <p className="mt-2 text-3xl font-bold">
//           4
//         </p>

//         <p className="mt-1 text-sm text-amber-600">
//           Requires attention
//         </p>

//       </div>


//       {/* Out for delivery */}
//       <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

//         <p className="text-sm text-slate-500">
//           Out for delivery
//         </p>

//         <p className="mt-2 text-3xl font-bold">
//           7
//         </p>

//         <p className="mt-1 text-sm text-blue-600">
//           Currently active
//         </p>

//       </div>


//       {/* Revenue */}
//       <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

//         <p className="text-sm text-slate-500">
//           Today&apos;s revenue
//         </p>

//         <p className="mt-2 text-3xl font-bold">
//           ₦486,000
//         </p>

//         <p className="mt-1 text-sm text-emerald-600">
//           +8.4% this week
//         </p>

//       </div>

//     </div>
//   );
// }


// ============================================================
// 8. RECENT ORDERS TABLE
// ============================================================

// function RecentOrders() {
//   return (
//     <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">


//       {/* ======================================================
//           9.1 ORDERS HEADER
//       ======================================================= */}

//       <div className="flex items-center justify-between border-b px-6 py-5">

//         <div>

//           <h3 className="text-lg font-semibold">
//             Recent orders
//           </h3>

//           <p className="text-sm text-slate-500">
//             Review and manage incoming orders.
//           </p>

//         </div>


//         <button className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
//           View all orders
//         </button>

//       </div>


//       {/* ======================================================
//           9.2 ORDERS TABLE
//       ======================================================= */}

//       <div className="overflow-x-auto">

//         <table className="w-full min-w-[1150px] text-left text-sm">


//           {/* ==================================================
//               9.2.1 TABLE HEADERS
//           =================================================== */}

//           <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

//             <tr>

//               <th className="px-6 py-4">
//                 Customer
//               </th>

//               <th className="px-6 py-4">
//                 Order information
//               </th>

//               <th className="px-6 py-4">
//                 Location
//               </th>

//               <th className="px-6 py-4">
//                 Total
//               </th>

//               <th className="px-6 py-4">
//                 Status
//               </th>

//               <th className="px-6 py-4">
//                 Delivered by
//               </th>

//               <th className="px-6 py-4">
//                 Invoice
//               </th>

//             </tr>

//           </thead>


//           {/* ==================================================
//               9.2.2 TABLE BODY
//           =================================================== */}

//           <tbody className="divide-y divide-slate-100">

//             {orders.map((order) => (

//               <tr
//                 key={order.id}
//                 className="hover:bg-slate-50"
//               >


//                 {/* ============================================
//                     CUSTOMER
//                 ============================================= */}

//                 <td className="px-6 py-5">

//                   <p className="font-semibold">
//                     {order.customer}
//                   </p>

//                   <p className="text-xs text-slate-500">
//                     {order.customerId}
//                   </p>

//                   <p className="text-xs text-slate-400">
//                     {order.customerPhone}
//                   </p>

//                   <p className="text-xs text-slate-400">
//                     Order {order.id}
//                   </p>

//                 </td>


//                 {/* ============================================
//                     ORDER INFORMATION
//                 ============================================= */}

//                 <td className="px-6 py-5">

//                   {order.items.map((item, index) => (

//                     <div key={index}>

//                       <p className="font-medium">
//                         {item.productName}
//                       </p>

//                       <p className="text-xs text-slate-500">
//                         Quantity: {item.quantity}
//                       </p>

//                       <p className="text-xs text-slate-500">
//                         Unit price: {money(item.unitPrice)}
//                       </p>

//                     </div>

//                   ))}

//                 </td>


//                 {/* ============================================
//                     LOCATION
//                 ============================================= */}

//                 <td className="px-6 py-5 text-slate-600">

//                   {order.location}

//                 </td>


//                 {/* ============================================
//                     TOTAL
//                 ============================================= */}

//                 <td className="px-6 py-5 font-semibold">

//                   {money(order.total)}

//                 </td>


//                 {/* ============================================
//                     ORDER STATUS
//                 ============================================= */}

//                 <td className="px-6 py-5">

//                   <StatusBadge
//                     status={order.status}
//                   />

//                 </td>


//                 {/* ============================================
//                     DELIVERED BY / RIDER
//                 ============================================= */}

//                 <td className="px-6 py-5">

//                   <RiderDetails
//                     rider={order.rider}
//                   />

//                 </td>


//                 {/* ============================================
//                     INVOICE
//                 ============================================= */}

//                 <td className="px-6 py-5">

//                   <button className="font-medium text-emerald-700 hover:underline">
//                     View invoice
//                   </button>

//                 </td>

//               </tr>

//             ))}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }


// ============================================================
// 10. INVOICE PANEL
// ============================================================

// function InvoicePanel({
//   order,
// }: {
//   order: Order;
// }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">


//       {/* ======================================================
//           10.1 INVOICE HEADER
//       ======================================================= */}

//       <div className="flex items-center justify-between">

//         <div>

//           <p className="text-sm text-slate-500">
//             Selected order
//           </p>

//           <h3 className="text-xl font-bold">
//             Invoice {order.id}
//           </h3>

//         </div>


//         <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
//           Generate PDF
//         </button>

//       </div>


//       {/* ======================================================
//           10.2 CUSTOMER & DELIVERY INFORMATION
//       ======================================================= */}

//       <div className="mt-6 grid gap-4 border-y py-5 sm:grid-cols-2">


//         {/* Customer */}
//         <div>

//           <p className="text-xs uppercase text-slate-400">
//             Customer
//           </p>

//           <p className="mt-1 font-semibold">
//             {order.customer}
//           </p>

//           <p className="text-xs text-slate-500">
//             {order.customerId}
//           </p>

//           <p className="text-xs text-slate-500">
//             {order.customerPhone}
//           </p>

//         </div>


//         {/* Delivery */}
//         <div>

//           <p className="text-xs uppercase text-slate-400">
//             Delivery location
//           </p>

//           <p className="mt-1 font-semibold">
//             {order.location}
//           </p>

//         </div>

//       </div>


//       {/* ======================================================
//           10.3 PRODUCT BREAKDOWN
//       ======================================================= */}

//       <div className="py-5">

//         <div className="grid grid-cols-[1fr_auto_auto] gap-6 border-b pb-3 text-xs font-semibold uppercase text-slate-400">

//           <span>
//             Item
//           </span>

//           <span>
//             Qty
//           </span>

//           <span>
//             Amount
//           </span>

//         </div>


//         {order.items.map((item, index) => (

//           <div
//             key={index}
//             className="grid grid-cols-[1fr_auto_auto] gap-6 py-4"
//           >

//             <div>

//               <p className="font-semibold">
//                 {item.productName}
//               </p>

//               <p className="text-xs text-slate-500">
//                 Unit price: {money(item.unitPrice)}
//               </p>

//             </div>

//             <span>
//               {item.quantity}
//             </span>

//             <span className="font-medium">
//               {money(item.subtotal)}
//             </span>

//           </div>

//         ))}

//       </div>


//       {/* ======================================================
//           10.4 INVOICE TOTALS
//       ======================================================= */}

//       <div className="border-t pt-4">


//         {/* Subtotal */}
//         <div className="flex justify-between py-2 text-sm">

//           <span className="text-slate-500">
//             Subtotal
//           </span>

//           <span>
//             {money(order.subtotal)}
//           </span>

//         </div>


//         {/* Delivery fee */}
//         <div className="flex justify-between py-2 text-sm">

//           <span className="text-slate-500">
//             Delivery fee
//           </span>

//           <span>
//             {money(order.deliveryFee)}
//           </span>

//         </div>


//         {/* Total */}
//         <div className="mt-3 flex justify-between border-t pt-4 text-lg font-bold">

//           <span>
//             Total
//           </span>

//           <span>
//             {money(order.total)}
//           </span>

//         </div>

//       </div>

//     </div>
//   );
// }


// ============================================================
// 11. ORDER APPROVAL PANEL
// ============================================================

// ============================================================
// 12. MAIN DASHBOARD
// ============================================================

export default function Home() {

  // Currently selected order.
  // Later this will be controlled by the dashboard.

  // ============================================================
// 6. SELECTED ORDER STATE
// ============================================================

// ============================================================
// 6. ORDER STATE
// ============================================================

const [orders, setOrders] = useState<Order[]>(initialOrders);

const [selectedOrder, setSelectedOrder] = useState(initialOrders[0]);

// ============================================================
// 7. ORDER APPROVAL & RIDER ASSIGNMENT LOGIC
// ============================================================

const handleApproveOrder = () => {

  // Find the first available rider
  const availableRider = riders.find(
    (rider) => rider.status === "Available"
  );

  // If no rider is available, keep the order in finding rider
  if (!availableRider) {
    setSelectedOrder({
      ...selectedOrder,
      status: "Finding rider",
    });

    return;
  }

  // Assign the available rider to the order
  const updatedOrder: Order = {
    ...selectedOrder,
    status: "Rider assigned",
    rider: availableRider,
  };

  // Update selected order
  setSelectedOrder(updatedOrder);

  // Update the main orders list
  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === selectedOrder.id
        ? updatedOrder
        : order
    )
  );
};
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">


      {/* ======================================================
          12.1 HEADER
      ======================================================= */}

      <DashboardHeader />


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
  );
}