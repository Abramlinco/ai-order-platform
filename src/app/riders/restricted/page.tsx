"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Rider = {
  id: string;
  name: string;
  phone: string;
  bike: string;
  status: "Available" | "Busy" | "Offline";
  accountStatus: "Suspended" | "Blocked";
  suspensionReason?: string | null;
  suspendedAt?: string | null;
  blockedReason?: string | null;
  blockedAt?: string | null;
  orders?: { id: string; status: string; updatedAt: string }[];
};

export default function RestrictedRidersPage() {
  const router = useRouter();

  const [riders, setRiders] = useState<Rider[]>([]);
  const [filter, setFilter] = useState<"All" | "Suspended" | "Blocked">("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [removeRider, setRemoveRider] = useState<Rider | null>(null);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/riders/restricted", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load restricted riders.");
      }

      setRiders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load restricted riders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visibleRiders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return riders.filter((rider) => {
      const matchesFilter =
        filter === "All" || rider.accountStatus === filter;

      const matchesSearch =
        !query ||
        [rider.name, rider.id, rider.phone, rider.bike, rider.accountStatus]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [riders, filter, search]);

  async function restoreRider(rider: Rider) {
    setBusyId(rider.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/riders/${rider.id}/restriction`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "Restore" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to restore rider.");
      }

      setRiders((current) => current.filter((item) => item.id !== rider.id));
      setNotice(`${rider.name} has been restored to Active.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore rider.");
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

      setRiders((current) =>
        current.filter((item) => item.id !== removeRider.id)
      );
      setNotice(`${removeRider.name} was removed.`);
      setRemoveRider(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rider could not be removed.");
    } finally {
      setBusyId(null);
    }
  }

  const suspendedCount = riders.filter(
    (rider) => rider.accountStatus === "Suspended"
  ).length;
  const blockedCount = riders.filter(
    (rider) => rider.accountStatus === "Blocked"
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f9fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.push("/riders")}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            ← Back to riders
          </button>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Rider controls
              </div>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Restricted riders
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Suspended and blocked riders remain in the system but cannot receive new assignments.
              </p>
            </div>

            <div className="flex gap-2 text-sm">
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                <span className="font-bold text-amber-700">{suspendedCount}</span>
                <span className="ml-1 text-amber-700">Suspended</span>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                <span className="font-bold text-red-700">{blockedCount}</span>
                <span className="ml-1 text-red-700">Blocked</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        {(error || notice) && (
          <div className="mb-5 space-y-3">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {notice && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {notice}
              </div>
            )}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["All", "Suspended", "Blocked"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                    filter === item
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search restricted riders..."
              className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 lg:max-w-sm"
            />
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : visibleRiders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                ✓
              </div>
              <h2 className="mt-4 font-semibold">No restricted riders</h2>
              <p className="mt-1 text-sm text-slate-500">
                This view will show riders whenever a suspension or block is active.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {visibleRiders.map((rider) => {
                const isBlocked = rider.accountStatus === "Blocked";
                const reason = isBlocked
                  ? rider.blockedReason
                  : rider.suspensionReason;
                const restrictedAt = isBlocked
                  ? rider.blockedAt
                  : rider.suspendedAt;

                return (
                  <article key={rider.id} className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-bold">{rider.name}</h2>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                              isBlocked
                                ? "bg-red-50 text-red-700 ring-red-200"
                                : "bg-amber-50 text-amber-700 ring-amber-200"
                            }`}
                          >
                            {rider.accountStatus}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {rider.id} · {rider.phone}
                        </p>

                        <p className="mt-4 text-sm font-semibold">{rider.bike}</p>

                        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                          <div className="rounded-lg bg-slate-50 px-3 py-2">
                            <span className="text-xs text-slate-400">Reason</span>
                            <p className="mt-0.5 text-slate-700">
                              {reason || "No reason recorded."}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 px-3 py-2">
                            <span className="text-xs text-slate-400">
                              Restricted on
                            </span>
                            <p className="mt-0.5 text-slate-700">
                              {restrictedAt
                                ? new Date(restrictedAt).toLocaleString()
                                : "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          disabled={busyId === rider.id}
                          onClick={() => restoreRider(rider)}
                          className="rounded-xl border border-emerald-300 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                        >
                          {busyId === rider.id ? "Processing..." : "Restore"}
                        </button>

                        <button
                          type="button"
                          disabled={busyId === rider.id}
                          onClick={() => setRemoveRider(rider)}
                          className="rounded-xl border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {removeRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="px-6 py-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                !
              </div>
              <h2 className="mt-4 text-xl font-bold">Remove rider?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Remove <strong>{removeRider.name}</strong> permanently. The
                backend will protect the operation if an active delivery exists.
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
