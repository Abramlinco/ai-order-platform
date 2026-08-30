// ============================================================
// ORDERPILOT — APPROVAL PANEL
// File: src/app/components/ApprovalPanel.tsx
// Purpose: Human approval gate for incoming orders
// ============================================================

"use client";

import { useState } from "react";

import type { Order } from "../types";


// ============================================================
// 1. PROPS
// ============================================================

type ApprovalPanelProps = {
  order: Order;

  onApproveOrder: () => void;

  onDeclineOrder: (reason: string) => void;
};


// ============================================================
// 2. APPROVAL PANEL
// ============================================================

export default function ApprovalPanel({
  order,
  onApproveOrder,
  onDeclineOrder,
}: ApprovalPanelProps) {

  // ==========================================================
  // 2.1 DECLINE STATE
  // ==========================================================

  const [isDeclining, setIsDeclining] =
    useState(false);

  const [declineReason, setDeclineReason] =
    useState("");

  const [declineError, setDeclineError] =
    useState("");


  // ==========================================================
  // 2.2 OPEN DECLINE FORM
  // ==========================================================

  const handleOpenDecline = () => {
    setDeclineError("");
    setDeclineReason("");
    setIsDeclining(true);
  };


  // ==========================================================
  // 2.3 CANCEL DECLINE
  // ==========================================================

  const handleCancelDecline = () => {
    setDeclineError("");
    setDeclineReason("");
    setIsDeclining(false);
  };


  // ==========================================================
  // 2.4 SUBMIT DECLINE
  // ==========================================================

  const handleDeclineSubmit = () => {

    const reason = declineReason.trim();


    if (!reason) {
      setDeclineError(
        "Please provide a reason before declining this order."
      );

      return;
    }


    // ========================================================
    // Send the owner's reason back to the dashboard logic.
    //
    // Later this same reason will be sent to the AI/command
    // layer, which can communicate the appropriate feedback
    // back to the customer.
    // ========================================================

    onDeclineOrder(reason);


    setIsDeclining(false);
    setDeclineReason("");
    setDeclineError("");
  };


  // ==========================================================
  // 3. STATUS HELPERS
  // ==========================================================

  const isAwaitingApproval =
    order.status === "Awaiting approval";

  const isDelivered =
    order.status === "Delivered";

  const isCancelled =
    order.status === "Cancelled";

  const isInDelivery =
    order.status === "Finding rider" ||
    order.status === "Rider assigned" ||
    order.status === "Out for delivery";


  // ============================================================
  // 4. PANEL
  // ============================================================

  return (
    <div className="rounded-2xl bg-emerald-700 p-6 text-white">


      {/* ======================================================
          4.1 HEADER
          ====================================================== */}

      <p className="text-xs font-medium uppercase tracking-wide text-emerald-100">
        Human approval gate
      </p>

      <h2 className="mt-2 text-xl font-bold">
        Order {order.id}
      </h2>


      {/* ======================================================
          4.2 CUSTOMER
          ====================================================== */}

      <div className="mt-6">

        <p className="text-xs uppercase tracking-wide text-emerald-100">
          Customer
        </p>

        <p className="mt-1 font-semibold">
          {order.customer}
        </p>

      </div>


      {/* ======================================================
          4.3 DELIVERY
          ====================================================== */}

      <div className="mt-5">

        <p className="text-xs uppercase tracking-wide text-emerald-100">
          Delivery
        </p>

        <p className="mt-1 font-semibold">
          {order.location}
        </p>

      </div>


      {/* ======================================================
          4.4 RIDER
          ====================================================== */}

      <div className="mt-5">

        <p className="text-xs uppercase tracking-wide text-emerald-100">
          Delivered by
        </p>

        <p className="mt-1 font-semibold">
          {order.rider
            ? order.rider.name
            : "Rider not assigned"}
        </p>

      </div>


      {/* ======================================================
          4.5 ORDER STATUS
          ====================================================== */}

      <div className="mt-5">

        <p className="text-xs uppercase tracking-wide text-emerald-100">
          Order status
        </p>

        <p className="mt-1 font-semibold">
          {order.status}
        </p>

      </div>


      {/* ======================================================
          5. DECLINE FORM
          ====================================================== */}

      {isDeclining && isAwaitingApproval ? (

        <div className="mt-8 rounded-2xl bg-white p-4 text-slate-900">

          <h3 className="text-base font-bold">
            Why are you declining this order?
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            This reason will be recorded with the order and
            can later be passed to the AI/customer communication
            flow.
          </p>


          {/* ==================================================
              REASON INPUT
              ================================================== */}

          <textarea
            value={declineReason}
            onChange={(event) => {
              setDeclineReason(event.target.value);
              setDeclineError("");
            }}
            placeholder="Enter the reason for declining this order..."
            rows={4}
            className="mt-4 w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />


          {/* ==================================================
              VALIDATION ERROR
              ================================================== */}

          {declineError && (

            <p className="mt-2 text-xs font-medium text-red-600">
              {declineError}
            </p>

          )}


          {/* ==================================================
              DECLINE ACTIONS
              ================================================== */}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

            <button
              type="button"
              onClick={handleDeclineSubmit}
              className="rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Confirm Decline
            </button>


            <button
              type="button"
              onClick={handleCancelDecline}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Go Back
            </button>

          </div>

        </div>

      ) : (

        <>
          {/* ==================================================
              6. APPROVAL ACTIONS
              ================================================== */}

          {isAwaitingApproval && (

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={onApproveOrder}
                className="rounded-lg bg-white px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                Approve Order
              </button>


              <button
                type="button"
                onClick={handleOpenDecline}
                className="rounded-lg border-2 border-white bg-transparent px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Decline Order
              </button>

            </div>

          )}


          {/* ==================================================
              7. IN DELIVERY
              ================================================== */}

          {isInDelivery && (

            <div className="mt-8 rounded-xl bg-emerald-800/60 p-4">

              <p className="text-sm font-semibold">
                Order is currently in delivery.
              </p>

              <p className="mt-1 text-xs text-emerald-100">
                Approval actions are no longer available for
                this order.
              </p>

            </div>

          )}


          {/* ==================================================
              8. DELIVERED
              ================================================== */}

          {isDelivered && (

            <div className="mt-8 rounded-xl bg-emerald-800/60 p-4">

              <p className="text-sm font-semibold">
                Order Delivered
              </p>

              <p className="mt-1 text-xs text-emerald-100">
                This order has already been completed.
              </p>

            </div>

          )}


          {/* ==================================================
              9. CANCELLED
              ================================================== */}

          {isCancelled && (

            <div className="mt-8 rounded-xl bg-emerald-800/60 p-4">

              <p className="text-sm font-semibold">
                Order Cancelled
              </p>

              <p className="mt-1 text-xs text-emerald-100">
                This order can no longer be approved.
              </p>

            </div>

          )}

        </>

      )}

    </div>
  );
}