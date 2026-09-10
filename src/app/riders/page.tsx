"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type OperationalStatus = "Available" | "Busy" | "Offline";
type AccountStatus = "Active" | "Suspended" | "Blocked";

type RiderOrder = {
  id: string;
  status: string;
  updatedAt: string;
};

type Rider = {
  id: string;
  name: string;
  phone: string;
  bike: string;
  status: OperationalStatus;
  accountStatus: AccountStatus;
  suspensionReason?: string | null;
  suspendedAt?: string | null;
  blockedReason?: string | null;
  blockedAt?: string | null;
  orders?: RiderOrder[];
  createdAt?: string;
  updatedAt?: string;
};

type RiderForm = {
  name: string;
  phone: string;
  bike: string;
};

function isValidNigerianPhone(value: string) {
  const compact = value.replace(/[\s()-]/g, "");
  return /^(?:0(?:70|71|80|81|90|91)\d{8}|\+234(?:70|71|80|81|90|91)\d{8}|234(?:70|71|80|81|90|91)\d{8})$/.test(compact);
}

function normalizeNigerianPhone(value: string) {
  const compact = value.replace(/[\s()-]/g, "");
  if (compact.startsWith("+234")) return compact;
  if (compact.startsWith("234")) return `+${compact}`;
  if (compact.startsWith("0")) return `+234${compact.slice(1)}`;
  return compact;
}

function isValidBikeRegistration(value: string) {
  const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return /^(?:[A-Z]{2,3}\d{3,4}[A-Z]{0,2})$/.test(compact);
}

const emptyForm: RiderForm = {
  name: "",
  phone: "",
  bike: "",
};

function StatusPill({
  status,
  kind = "operational",
}: {
  status: string;
  kind?: "operational" | "account";
}) {
  const classes =
    kind === "account"
      ? status === "Blocked"
        ? "bg-red-50 text-red-700 ring-red-200"
        : status === "Suspended"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "Available"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "Busy"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${classes}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function RidersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [riders, setRiders] = useState<Rider[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [restrictionError, setRestrictionError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);
  const [form, setForm] = useState<RiderForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<RiderForm>>({});

  const [viewRider, setViewRider] = useState<Rider | null>(null);
  const [restrictionRider, setRestrictionRider] = useState<Rider | null>(null);
  const [restrictionAction, setRestrictionAction] = useState<
    "Suspend" | "Block" | null
  >(null);
  const [restrictionReason, setRestrictionReason] = useState("");

  const [removeRider, setRemoveRider] = useState<Rider | null>(null);

  async function loadRiders() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/riders", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load riders.");
      }

      setRiders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load riders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRiders();
  }, []);

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      openAddForm();
    }
  }, [searchParams]);

  const filteredRiders = useMemo(() => {
    const query = search.trim().toLowerCase();

    // The main Rider roster is for active riders only.
    // Suspended and blocked riders belong exclusively in Restricted Riders.
    const activeRiders = riders.filter((rider) => rider.accountStatus === "Active");

    if (!query) return activeRiders;

    return activeRiders.filter((rider) =>
      [rider.name, rider.id, rider.phone, rider.bike, rider.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [riders, search]);

  const counts = useMemo(
    () => ({
      total: riders.length,
      available: riders.filter(
        (rider) =>
          rider.accountStatus === "Active" && rider.status === "Available"
      ).length,
      busy: riders.filter(
        (rider) => rider.accountStatus === "Active" && rider.status === "Busy"
      ).length,
      restricted: riders.filter((rider) => rider.accountStatus !== "Active")
        .length,
    }),
    [riders]
  );

  function openAddForm() {
    setEditingRider(null);
    setForm(emptyForm);
    setFormErrors({});
    setError("");
    setShowForm(true);
  }

  function openEditForm(rider: Rider) {
    setEditingRider(rider);
    setForm({
      name: rider.name,
      phone: rider.phone,
      bike: rider.bike,
    });
    setFormErrors({});
    setError("");
    setViewRider(null);
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;
    setShowForm(false);
    setEditingRider(null);
    setForm(emptyForm);
    setFormErrors({});
  }

  function validateForm() {
    const nextErrors: Partial<RiderForm> = {};
    const name = form.name.trim().replace(/\s+/g, " ");
    const phone = form.phone.trim();
    const bike = form.bike.trim();

    if (!name) {
      nextErrors.name = "Rider name is required.";
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\s'-][A-Za-zÀ-ÖØ-öø-ÿ]+)+$/.test(name)) {
      nextErrors.name = "Please enter the rider's first and last name.";
    }

    if (!phone) {
      nextErrors.phone = "Phone number is required.";
    } else if (!isValidNigerianPhone(phone)) {
      nextErrors.phone = "Enter a valid Nigerian number, e.g. 08012345678 or +2348012345678.";
    }

    if (!bike) {
      nextErrors.bike = "Bike registration number is required.";
    } else if (!isValidBikeRegistration(bike)) {
      nextErrors.bike = "Enter a valid bike registration, e.g. ABC-123-XY.";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function saveRider() {
    if (!validateForm()) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const editing = Boolean(editingRider);
      const response = await fetch(
        editing ? `/api/riders/${editingRider!.id}` : "/api/riders",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            phone: normalizeNigerianPhone(form.phone),
            bike: form.bike.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to save rider.");
      }

      closeForm();
      setNotice(editing ? "Rider updated successfully." : "Rider added successfully.");
      await loadRiders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save rider.");
    } finally {
      setSaving(false);
    }
  }

  function openRestriction(rider: Rider, action: "Suspend" | "Block") {
    setViewRider(null);
    setRestrictionRider(rider);
    setRestrictionAction(action);
    setRestrictionReason("");
    setRestrictionError("");
    setError("");
  }

  async function submitRestriction() {
    if (!restrictionRider || !restrictionAction) return;

    const reason = restrictionReason.trim();

    if (!reason) {
      setRestrictionError(
        `Please provide a proper reason for ${restrictionAction.toLowerCase()}ing this rider.`
      );
      return;
    }

    setBusyId(restrictionRider.id);
    setRestrictionError("");
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/riders/${restrictionRider.id}/restriction`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: restrictionAction,
            reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Restriction could not be applied.");
      }

      setRestrictionRider(null);
      setRestrictionAction(null);
      setRestrictionReason("");
      setRestrictionError("");
      setNotice(
        restrictionAction === "Suspend"
          ? "Rider suspended successfully."
          : "Rider blocked successfully."
      );

      await loadRiders();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Restriction could not be applied."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function confirmRemove() {
    if (!removeRider) return;

    setBusyId(removeRider.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/riders/${removeRider.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Rider could not be removed.");
      }

      setRemoveRider(null);
      setViewRider(null);
      setNotice("Rider removed successfully.");
      await loadRiders();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Rider could not be removed."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Delivery operations
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Riders
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Manage your delivery team and control who is eligible for new assignments.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/riders/restricted")}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              >
                Restricted riders
                {counts.restricted > 0 && (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                    {counts.restricted}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={openAddForm}
                className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                + New rider
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        {(error || notice) && (
          <div className="mb-5 space-y-3">
            {error && (
              <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>{error}</span>
                <button type="button" onClick={() => setError("")} className="font-bold">
                  ×
                </button>
              </div>
            )}
            {notice && (
              <div className="flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <span>{notice}</span>
                <button type="button" onClick={() => setNotice("")} className="font-bold">
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total riders", counts.total, "Registered delivery team"],
            ["Available", counts.available, "Eligible for new jobs"],
            ["Busy", counts.busy, "Currently operationally busy"],
            ["Restricted", counts.restricted, "Suspended or blocked"],
          ].map(([label, value, description]) => (
            <div
              key={label as string}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
              <p className="mt-1 text-xs text-slate-400">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">Rider roster</h2>
              <p className="mt-1 text-sm text-slate-500">
                Account status and operational status are managed separately.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, phone, bike or ID"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : filteredRiders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                ⌕
              </div>
              <h3 className="mt-4 font-semibold">No riders found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {search ? "Try a different search." : "Add your first rider to begin."}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1120px] text-left">
                  <thead className="border-b border-slate-200 bg-slate-50/80">
                    <tr className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      <th className="px-6 py-4">Rider</th>
                      <th className="px-6 py-4">Vehicle</th>
                      <th className="px-6 py-4">Operational</th>
                      <th className="px-6 py-4">Account</th>
                      <th className="px-6 py-4">Delivery records</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredRiders.map((rider) => (
                      <tr key={rider.id} className="transition hover:bg-slate-50/70">
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() => setViewRider(rider)}
                            className="text-left"
                          >
                            <div className="font-semibold hover:text-emerald-700">
                              {rider.name}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {rider.id} · {rider.phone}
                            </div>
                          </button>
                        </td>

                        <td className="px-6 py-5">
                          <div className="font-medium text-slate-800">{rider.bike}</div>
                        </td>

                        <td className="px-6 py-5">
                          <StatusPill status={rider.status} />
                        </td>

                        <td className="px-6 py-5">
                          <StatusPill status={rider.accountStatus} kind="account" />
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold">
                          {rider.orders?.length ?? 0}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-3 text-sm">
                            <button
                              type="button"
                              onClick={() => setViewRider(rider)}
                              className="font-semibold text-slate-600 hover:text-slate-900"
                            >
                              View
                            </button>

                            {rider.accountStatus === "Active" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openEditForm(rider)}
                                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openRestriction(rider, "Suspend")}
                                  className="font-semibold text-amber-700 hover:text-amber-800"
                                >
                                  Suspend
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openRestriction(rider, "Block")}
                                  className="font-semibold text-red-600 hover:text-red-700"
                                >
                                  Block
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() => setRemoveRider(rider)}
                              className="font-semibold text-red-600 hover:text-red-700"
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

              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredRiders.map((rider) => (
                  <article key={rider.id} className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setViewRider(rider)}
                        className="min-w-0 text-left"
                      >
                        <h3 className="truncate font-bold">{rider.name}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {rider.id} · {rider.phone}
                        </p>
                      </button>

                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <StatusPill status={rider.status} />
                        <StatusPill status={rider.accountStatus} kind="account" />
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Vehicle
                      </p>
                      <p className="mt-1 text-sm font-semibold">{rider.bike}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setViewRider(rider)}
                        className="rounded-lg border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-700"
                      >
                        View
                      </button>

                      {rider.accountStatus === "Active" && (
                        <button
                          type="button"
                          onClick={() => openEditForm(rider)}
                          className="rounded-lg border border-emerald-300 px-3 py-2.5 text-xs font-semibold text-emerald-700"
                        >
                          Edit
                        </button>
                      )}

                      {rider.accountStatus === "Active" && (
                        <>
                          <button
                            type="button"
                            onClick={() => openRestriction(rider, "Suspend")}
                            className="rounded-lg border border-amber-300 px-3 py-2.5 text-xs font-semibold text-amber-700"
                          >
                            Suspend
                          </button>
                          <button
                            type="button"
                            onClick={() => openRestriction(rider, "Block")}
                            className="rounded-lg border border-red-300 px-3 py-2.5 text-xs font-semibold text-red-600"
                          >
                            Block
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => setRemoveRider(rider)}
                        className="rounded-lg border border-red-300 px-3 py-2.5 text-xs font-semibold text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">
                  {editingRider ? "Edit rider" : "Add new rider"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Changes are saved directly to the rider database.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-1 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              {[
                ["name", "Rider name", "e.g. Daniel Okafor", "text"],
                ["phone", "Phone number", "e.g. 08012345678 or +2348012345678", "tel"],
                ["bike", "Bike registration number", "e.g. ABC-123-XY", "text"],
              ].map(([key, label, placeholder, type]) => (
                <label key={key} className="block">
                  <span className="mb-1.5 block text-sm font-semibold">{label}</span>
                  <input
                    type={type}
                    value={form[key as keyof RiderForm]}
                    onChange={(event) => {
                      const value = event.target.value;
                      setForm({ ...form, [key]: value });
                      if (formErrors[key as keyof RiderForm]) {
                        setFormErrors((current) => ({ ...current, [key]: undefined }));
                      }
                    }}
                    placeholder={placeholder}
                    className={`h-12 w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-100 ${
                      formErrors[key as keyof RiderForm]
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-300 focus:border-emerald-600"
                    }`}
                  />
                  {formErrors[key as keyof RiderForm] && (
                    <span className="mt-1.5 block text-xs text-red-600">
                      {formErrors[key as keyof RiderForm]}
                    </span>
                  )}
                </label>
              ))}
            </div>

            <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                disabled={saving}
                onClick={closeForm}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={saveRider}
                className="flex-1 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingRider ? "Save changes" : "Add rider"}
              </button>
            </div>
          </div>
        </div>
      )}

      {restrictionRider && restrictionAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    restrictionAction === "Block" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                  }`}
                >
                  !
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {restrictionAction} rider
                  </h2>
                  <p className="text-sm text-slate-500">{restrictionRider.name}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <div
                className={`rounded-xl p-4 text-sm ${
                  restrictionAction === "Block"
                    ? "bg-red-50 text-red-800"
                    : "bg-amber-50 text-amber-800"
                }`}
              >
                {restrictionAction === "Suspend"
                  ? "Suspension temporarily prevents this rider from receiving new assignments. The rider remains in the system and can later be restored."
                  : "Blocking places a stronger restriction on this rider. They cannot receive new assignments until an authorised person restores them."}
              </div>

              <label className="mt-5 block">
                <span className="mb-1.5 block text-sm font-semibold">
                  Reason <span className="text-red-500">*</span>
                </span>
                <textarea
                  value={restrictionReason}
                  onChange={(event) => {
                    setRestrictionReason(event.target.value);
                    if (restrictionError) setRestrictionError("");
                  }}
                  rows={4}
                  placeholder={
                    restrictionAction === "Suspend"
                      ? "Explain why this rider is being suspended..."
                      : "Explain why this rider is being blocked..."
                  }
                  className={`w-full resize-none rounded-xl border p-3 text-sm outline-none transition focus:ring-2 ${
                    restrictionError
                      ? "border-red-400 bg-red-50/20 placeholder:text-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-300 focus:border-emerald-600 focus:ring-emerald-100"
                  }`}
                />
                {restrictionError && (
                  <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                    {restrictionError}
                  </p>
                )}
              </label>
            </div>

            <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                disabled={busyId === restrictionRider.id}
                onClick={() => {
                  setRestrictionRider(null);
                  setRestrictionAction(null);
                  setRestrictionReason("");
                }}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === restrictionRider.id}
                onClick={submitRestriction}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 ${
                  restrictionAction === "Block"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {busyId === restrictionRider.id
                  ? "Processing..."
                  : `Confirm ${restrictionAction}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold">{viewRider.name}</h2>
                    <StatusPill status={viewRider.accountStatus} kind="account" />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {viewRider.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewRider(null)}
                  className="rounded-lg p-1 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6">
              <section>
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Rider information
                </h3>
                <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
                  <div className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-semibold">{viewRider.phone}</span>
                  </div>
                  <div className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <span className="text-slate-500">Vehicle</span>
                    <span className="text-right font-semibold">{viewRider.bike}</span>
                  </div>
                  <div className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <span className="text-slate-500">Operational status</span>
                    <StatusPill status={viewRider.status} />
                  </div>
                  <div className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <span className="text-slate-500">Delivery records shown</span>
                    <span className="font-semibold">{viewRider.orders?.length ?? 0}</span>
                  </div>
                </div>
              </section>

              {viewRider.accountStatus !== "Active" && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Restriction
                  </h3>
                  <div
                    className={`mt-3 rounded-xl p-4 text-sm ${
                      viewRider.accountStatus === "Blocked"
                        ? "bg-red-50 text-red-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    <p className="font-semibold">{viewRider.accountStatus}</p>
                    <p className="mt-1">
                      {viewRider.accountStatus === "Blocked"
                        ? viewRider.blockedReason || "No reason recorded."
                        : viewRider.suspensionReason || "No reason recorded."}
                    </p>
                  </div>
                </section>
              )}
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row">
              {viewRider.accountStatus === "Active" && (
                <>
                  <button
                    type="button"
                    onClick={() => openEditForm(viewRider)}
                    className="flex-1 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Edit rider
                  </button>
                  <button
                    type="button"
                    onClick={() => openRestriction(viewRider, "Suspend")}
                    className="flex-1 rounded-xl border border-amber-300 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50"
                  >
                    Suspend
                  </button>
                  <button
                    type="button"
                    onClick={() => openRestriction(viewRider, "Block")}
                    className="flex-1 rounded-xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Block
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setRemoveRider(viewRider)}
                className="flex-1 rounded-xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {removeRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="px-6 py-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                !
              </div>
              <h2 className="mt-4 text-xl font-bold">Remove rider?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                You are removing <strong>{removeRider.name}</strong> from the rider
                roster. This cannot be undone. The backend will reject the action
                if the rider still has an active delivery.
              </p>
            </div>

            <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                disabled={busyId === removeRider.id}
                onClick={() => setRemoveRider(null)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === removeRider.id}
                onClick={confirmRemove}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {busyId === removeRider.id ? "Removing..." : "Remove rider"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function RidersPage() {
  return (
    <Suspense fallback={null}>
      <RidersContent />
    </Suspense>
  );
}
