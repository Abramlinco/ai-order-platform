// ============================================================
// ORDERPILOT — RIDER DETAILS
// File: src/app/components/RiderDetails.tsx
// Purpose: Displays rider information for an order
// ============================================================


// ============================================================
// 1. RIDER DATA TYPE
// ============================================================

export type Rider = {
  id: string;
  name: string;
  phone: string;
  bike: string;
};


// ============================================================
// 2. RIDER DETAILS COMPONENT
// ============================================================

export default function RiderDetails({
  rider,
}: {
  rider: Rider | null;
}) {

  // ==========================================================
  // 2.1 NO RIDER ASSIGNED
  // ==========================================================

  if (!rider) {
    return (
      <div>

        <p className="font-medium text-slate-400">
          Not assigned
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Awaiting rider dispatch
        </p>

      </div>
    );
  }


  // ==========================================================
  // 2.2 ASSIGNED RIDER INFORMATION
  // ==========================================================

  return (
    <div className="min-w-[180px]">

      {/* Rider name */}
      <p className="font-semibold text-slate-900">
        {rider.name}
      </p>


      {/* Rider phone */}
      <p className="mt-1 text-xs text-slate-500">
        {rider.phone}
      </p>


      {/* Bike / vehicle details */}
      <p className="mt-1 text-xs text-slate-500">
        {rider.bike}
      </p>


      {/* Rider ID */}
      <p className="mt-1 text-[11px] text-slate-400">
        Rider ID: {rider.id}
      </p>

    </div>
  );
}