"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Rider = {
  id: string;
  name: string;
  phone: string;
  location: string;
  bikeMake: string;
  bikeModel: string;
  bikeColour: string;
  registrationNumber: string;
  deliveries: number;
  status: "Available" | "On delivery" | "Offline";
};

export default function RidersPage() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");

  const [riders, setRiders] = useState<Rider[]>([
    {
      id: "RDR-1001",
      name: "Daniel",
      phone: "0808 111 2233",
      location: "Gwarinpa, Abuja",
      bikeMake: "Honda",
      bikeModel: "CG 125",
      bikeColour: "Black",
      registrationNumber: "ABC-123-XY",
      deliveries: 24,
      status: "Available",
    },
    {
      id: "RDR-1002",
      name: "James",
      phone: "0808 222 3344",
      location: "Kubwa, Abuja",
      bikeMake: "Bajaj",
      bikeModel: "Boxer",
      bikeColour: "Red",
      registrationNumber: "ABC-456-XY",
      deliveries: 18,
      status: "On delivery",
    },
    {
      id: "RDR-1003",
      name: "Michael",
      phone: "0808 333 4455",
      location: "Wuse, Abuja",
      bikeMake: "TVS",
      bikeModel: "HLX",
      bikeColour: "Blue",
      registrationNumber: "ABC-789-XY",
      deliveries: 12,
      status: "Offline",
    },
  ]);

  const [showRiderModal, setShowRiderModal] = useState(false);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingRiderId, setEditingRiderId] = useState<string | null>(null);

  useEffect(() => {
  if (searchParams.get("add") === "true") {
    setSelectedRider(null);
    setEditingRiderId(null);

    setNewRider({
      name: "",
      phone: "",
      location: "",
      bikeMake: "",
      bikeModel: "",
      bikeColour: "",
      registrationNumber: "",
    });

    setShowRiderModal(true);
  }
}, [searchParams]);

  const [newRider, setNewRider] = useState({
    name: "",
    phone: "",
    location: "",
    bikeMake: "",
    bikeModel: "",
    bikeColour: "",
    registrationNumber: "",
  });

  const filteredRiders = useMemo(() => {
    const query = search.toLowerCase();

    return riders.filter(
      (rider) =>
        rider.name.toLowerCase().includes(query) ||
        rider.id.toLowerCase().includes(query) ||
        rider.phone.toLowerCase().includes(query) ||
        rider.location.toLowerCase().includes(query) ||
        rider.registrationNumber.toLowerCase().includes(query) ||
        rider.bikeMake.toLowerCase().includes(query) ||
        rider.bikeModel.toLowerCase().includes(query)
    );
  }, [search, riders]);

 const handleAddRider = () => {
  if (
    !newRider.name.trim() ||
    !newRider.phone.trim() ||
    !newRider.location.trim() ||
    !newRider.bikeMake.trim() ||
    !newRider.bikeModel.trim() ||
    !newRider.bikeColour.trim() ||
    !newRider.registrationNumber.trim()
  ) {
    return;
  }

  if (editingRiderId) {
    setRiders((current) =>
      current.map((rider) =>
        rider.id === editingRiderId
          ? {
              ...rider,
              name: newRider.name.trim(),
              phone: newRider.phone.trim(),
              location: newRider.location.trim(),
              bikeMake: newRider.bikeMake.trim(),
              bikeModel: newRider.bikeModel.trim(),
              bikeColour: newRider.bikeColour.trim(),
              registrationNumber:
                newRider.registrationNumber.trim(),
            }
          : rider
      )
    );
  } else {
    const rider: Rider = {
      id: `RDR-${Date.now()}`,
      name: newRider.name.trim(),
      phone: newRider.phone.trim(),
      location: newRider.location.trim(),
      bikeMake: newRider.bikeMake.trim(),
      bikeModel: newRider.bikeModel.trim(),
      bikeColour: newRider.bikeColour.trim(),
      registrationNumber:
        newRider.registrationNumber.trim(),
      deliveries: 0,
      status: "Available",
    };

    setRiders((current) => [rider, ...current]);
  }

  setNewRider({
    name: "",
    phone: "",
    location: "",
    bikeMake: "",
    bikeModel: "",
    bikeColour: "",
    registrationNumber: "",
  });

  setEditingRiderId(null);
  setShowRiderModal(false);
};

  const handleDeleteRider = (riderId: string) => {
    setRiders((current) =>
      current.filter((rider) => rider.id !== riderId)
    );
  };

  const handleEditRider = (rider: Rider) => {
  setEditingRiderId(rider.id);

  setNewRider({
    name: rider.name,
    phone: rider.phone,
    location: rider.location,
    bikeMake: rider.bikeMake,
    bikeModel: rider.bikeModel,
    bikeColour: rider.bikeColour,
    registrationNumber: rider.registrationNumber,
  });

  setShowRiderModal(true);
};

  const handleViewRider = (rider: Rider) => {
  setSelectedRider(rider);
  setShowViewModal(true);
};

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =========================================================
          1. RIDERS PAGE HEADER
      ========================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-2xl font-bold">
                Riders
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your delivery riders and their vehicles.
              </p>
            </div>

            {/* DESKTOP ADD RIDER */}

            <button
              type="button"
              onClick={() => setShowRiderModal(true)}
              className="hidden rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:block"
            >
              + New Rider
            </button>

          </div>
        </div>
      </section>


      {/* =========================================================
          2. RIDERS WORKSPACE
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

          {/* WORKSPACE HEADER */}

          <div className="border-b border-slate-200 px-6 py-6">
            <h2 className="text-xl font-bold">
              All Riders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage your delivery team.
            </p>
          </div>


          {/* SEARCH */}

          <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search riders..."
              aria-label="Search riders"
              className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>


          {/* =====================================================
              2.1 DESKTOP RIDER TABLE
          ===================================================== */}

          <div className="hidden overflow-x-auto lg:block">

            <table className="w-full min-w-[1050px] text-left text-sm">

              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                <tr>
                  <th className="px-6 py-4">
                    Rider
                  </th>

                  <th className="px-6 py-4">
                    Bike
                  </th>

                  <th className="px-6 py-4">
                    Location
                  </th>

                  <th className="px-6 py-4">
                    Deliveries
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>
                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredRiders.map((rider) => (

                  <tr
                    key={rider.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-5">

                      <div className="font-semibold text-slate-900">
                        {rider.name}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {rider.id}
                      </div>

                      <div className="text-xs text-slate-500">
                        {rider.phone}
                      </div>

                    </td>


                    <td className="px-6 py-5">

                      <div className="font-medium text-slate-800">
                        {rider.bikeMake} {rider.bikeModel}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {rider.bikeColour} • {rider.registrationNumber}
                      </div>

                    </td>


                    <td className="px-6 py-5 text-slate-600">
                      {rider.location}
                    </td>


                    <td className="px-6 py-5 font-semibold">
                      {rider.deliveries}
                    </td>


                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          rider.status === "Available"
                            ? "bg-emerald-100 text-emerald-700"
                            : rider.status === "On delivery"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {rider.status}
                      </span>

                    </td>


                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">
<button
  type="button"
  onClick={() => handleViewRider(rider)}
  className="font-medium text-slate-700 transition hover:text-slate-900"
>
  View
</button>

<button
  type="button"
  onClick={() => handleEditRider(rider)}
  className="font-medium text-emerald-700 transition hover:text-emerald-800"
>
  Edit
</button>

<button
  type="button"
  onClick={() => handleDeleteRider(rider.id)}
  className="font-medium text-red-600 transition hover:text-red-700"
>
  Remove
</button>
                       

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* =====================================================
              2.2 MOBILE RIDER CARDS
          ===================================================== */}

          <div className="space-y-3 p-4 lg:hidden">

            {filteredRiders.map((rider) => (

              <article
                key={rider.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="font-bold text-slate-900">
                      {rider.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {rider.id}
                    </p>

                    <p className="text-xs text-slate-500">
                      {rider.phone}
                    </p>

                  </div>


                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      rider.status === "Available"
                        ? "bg-emerald-100 text-emerald-700"
                        : rider.status === "On delivery"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {rider.status}
                  </span>

                </div>


                <div className="mt-4 space-y-2 text-sm">

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Bike
                    </span>

                    <span className="text-right font-medium">
                      {rider.bikeMake} {rider.bikeModel}
                    </span>
                  </div>


                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Colour
                    </span>

                    <span className="font-medium">
                      {rider.bikeColour}
                    </span>
                  </div>


                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Registration
                    </span>

                    <span className="font-medium">
                      {rider.registrationNumber}
                    </span>
                  </div>


                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Location
                    </span>

                    <span className="text-right font-medium">
                      {rider.location}
                    </span>
                  </div>


                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Deliveries
                    </span>

                    <span className="font-semibold">
                      {rider.deliveries}
                    </span>
                  </div>

                </div>


                <div className="mt-4 grid grid-cols-3 gap-2">

                  <button
  type="button"
  onClick={() => handleViewRider(rider)}
  className="rounded-lg border border-slate-300 px-2 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
>
  View
</button>

<button
  type="button"
  onClick={() => handleEditRider(rider)}
  className="rounded-lg border border-emerald-300 px-2 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
>
  Edit
</button>

<button
  type="button"
  onClick={() => handleDeleteRider(rider.id)}
  className="rounded-lg border border-red-300 px-2 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
>
  Remove
</button>

                </div>

              </article>

            ))}

          </div>


          {/* EMPTY STATE */}

          {filteredRiders.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No riders match your search.
            </div>
          )}

        </div>
      </section>


      {/* =========================================================
          3. MOBILE ADD RIDER BUTTON
      ========================================================= */}

      <button
        type="button"
        onClick={() => setShowRiderModal(true)}
        aria-label="Add new rider"
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-2xl font-medium text-white shadow-lg transition hover:bg-emerald-800 sm:hidden"
      >
        +
      </button>


      {/* =========================================================
          4. ADD RIDER MODAL
      ========================================================= */}

      {showRiderModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">

            <div className="border-b border-slate-200 px-6 py-5">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold">
  {editingRiderId ? "Edit Rider" : "Add New Rider"}
</h2>

                 <p className="mt-1 text-sm text-slate-500">
  {editingRiderId
    ? "Update rider and bike information."
    : "Add a rider and their bike details."}
</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRiderModal(false)}
                  className="text-2xl text-slate-400 hover:text-slate-700"
                  aria-label="Close"
                >
                  ×
                </button>

              </div>

            </div>


            <div className="space-y-4 px-6 py-6">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Rider name
                  </label>

                  <input
                    type="text"
                    value={newRider.name}
                    onChange={(event) =>
                      setNewRider({
                        ...newRider,
                        name: event.target.value,
                      })
                    }
                    placeholder="e.g. Daniel"
                    className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>


                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={newRider.phone}
                    onChange={(event) =>
                      setNewRider({
                        ...newRider,
                        phone: event.target.value,
                      })
                    }
                    placeholder="0808 123 4567"
                    className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

              </div>


              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Location / Area
                </label>

                <input
                  type="text"
                  value={newRider.location}
                  onChange={(event) =>
                    setNewRider({
                      ...newRider,
                      location: event.target.value,
                    })
                  }
                  placeholder="e.g. Gwarinpa, Abuja"
                  className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>


              <div className="border-t border-slate-200 pt-4">

                <h3 className="text-sm font-bold text-slate-900">
                  Bike details
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Vehicle information used for delivery identification.
                </p>

              </div>


              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Make
                  </label>

                  <input
                    type="text"
                    value={newRider.bikeMake}
                    onChange={(event) =>
                      setNewRider({
                        ...newRider,
                        bikeMake: event.target.value,
                      })
                    }
                    placeholder="Honda"
                    className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>


                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Model
                  </label>

                  <input
                    type="text"
                    value={newRider.bikeModel}
                    onChange={(event) =>
                      setNewRider({
                        ...newRider,
                        bikeModel: event.target.value,
                      })
                    }
                    placeholder="CG 125"
                    className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>


                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Colour
                  </label>

                  <input
                    type="text"
                    value={newRider.bikeColour}
                    onChange={(event) =>
                      setNewRider({
                        ...newRider,
                        bikeColour: event.target.value,
                      })
                    }
                    placeholder="Black"
                    className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>


                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Registration number
                  </label>

                  <input
                    type="text"
                    value={newRider.registrationNumber}
                    onChange={(event) =>
                      setNewRider({
                        ...newRider,
                        registrationNumber: event.target.value,
                      })
                    }
                    placeholder="ABC-123-XY"
                    className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm uppercase outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

              </div>

            </div>


            <div className="flex gap-3 border-t border-slate-200 px-6 py-4">

              <button
                type="button"
                onClick={() => setShowRiderModal(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={handleAddRider}
                className="flex-1 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                {editingRiderId ? "Save Changes" : "Add Rider"}
              </button>

            </div>

          </div>

        </div>

      )}
        {showViewModal && selectedRider && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">

      {/* Header */}

      <div className="border-b border-slate-200 px-6 py-5">

        <div className="flex items-start justify-between gap-4">

          <div>
            <h2 className="text-xl font-bold">
              {selectedRider.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {selectedRider.id}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              selectedRider.status === "Available"
                ? "bg-emerald-100 text-emerald-700"
                : selectedRider.status === "On delivery"
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {selectedRider.status}
          </span>

        </div>

      </div>


      {/* Rider details */}

      <div className="space-y-6 px-6 py-6">

        <div>

          <h3 className="text-sm font-bold text-slate-900">
            Rider information
          </h3>

          <div className="mt-3 space-y-3 text-sm">

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Phone
              </span>

              <span className="font-medium">
                {selectedRider.phone}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Location
              </span>

              <span className="text-right font-medium">
                {selectedRider.location}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Deliveries
              </span>

              <span className="font-semibold">
                {selectedRider.deliveries}
              </span>
            </div>

          </div>

        </div>


        {/* Bike information */}

        <div className="border-t border-slate-200 pt-5">

          <h3 className="text-sm font-bold text-slate-900">
            Bike details
          </h3>

          <div className="mt-3 space-y-3 text-sm">

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Make
              </span>

              <span className="font-medium">
                {selectedRider.bikeMake}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Model
              </span>

              <span className="font-medium">
                {selectedRider.bikeModel}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Colour
              </span>

              <span className="font-medium">
                {selectedRider.bikeColour}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Registration
              </span>

              <span className="font-medium">
                {selectedRider.registrationNumber}
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* Footer */}

      <div className="flex gap-3 border-t border-slate-200 px-6 py-4">

        <button
          type="button"
          onClick={() => {
            setShowViewModal(false);
            handleEditRider(selectedRider);
          }}
          className="flex-1 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Edit rider
        </button>

        <button
          type="button"
          onClick={() => {
            setShowViewModal(false);
            setSelectedRider(null);
          }}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}
    </main>
  );
}