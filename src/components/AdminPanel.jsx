import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import ServicesManager from "./ServicesManager";
import SettingsManager from "./SettingsManager";

const STATUSES = ["pending", "confirmed", "done", "cancelled"];
const BADGE = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
  confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/40",
  done: "bg-green-500/15 text-green-400 border-green-500/40",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/40",
};

// YYYY-MM-DD in local time (Philippines), para sa "Today" filter
const todayStr = () => new Date().toLocaleDateString("en-CA");
const dateOnly = (d) => (d ? String(d).slice(0, 10) : "");

function BookingCard({ b, onStatus, onDelete, onSaveNotes }) {
  const st = b.status || "pending";
  const [notes, setNotes] = useState(b.notes || "");
  const [saving, setSaving] = useState(false);
  const dirty = notes !== (b.notes || "");

  useEffect(() => {
    setNotes(b.notes || "");
  }, [b.notes]);

  const save = async () => {
    setSaving(true);
    await onSaveNotes(b.id, notes);
    setSaving(false);
  };

  const cancelBooking = () => {
    if (window.confirm(`I-cancel ang booking ni ${b.customer_name}?`)) onStatus(b.id, "cancelled");
  };

  const remove = () => {
    if (window.confirm(`I-delete gyud ang booking ni ${b.customer_name}? Dili na kini mabalik.`)) onDelete(b.id);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <p className="font-semibold">{b.customer_name}</p>
          <p className="text-sm text-neutral-400">🚗 {b.plate_number || "-"} · 🛠 {b.service_name}</p>
          <p className="text-sm text-neutral-400">📅 {b.preferred_date}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full border capitalize ${BADGE[st] || BADGE.pending}`}>{st}</span>
          <select
            value={st}
            onChange={(e) => onStatus(b.id, e.target.value)}
            className="bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-sm capitalize"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (pananglitan: gi-call na, naghulat og parts...)"
          rows={2}
          className="w-full bg-neutral-950 border border-neutral-700 text-sm text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 resize-y"
        />
        <div className="flex flex-wrap items-center gap-2">
          {dirty && (
            <button
              onClick={save}
              disabled={saving}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 rounded-lg text-sm font-semibold"
            >
              {saving ? "Saving..." : "Save notes"}
            </button>
          )}
          <div className="flex gap-2 sm:ml-auto">
            {st !== "cancelled" && (
              <button
                onClick={cancelBooking}
                className="px-3 py-1.5 border border-neutral-700 hover:bg-neutral-800 rounded-lg text-sm text-neutral-300"
              >
                Cancel booking
              </button>
            )}
            <button
              onClick={remove}
              className="px-3 py-1.5 border border-red-500/40 hover:bg-red-500/10 rounded-lg text-sm text-red-400"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [todayOnly, setTodayOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [tab, setTab] = useState("bookings");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("preferred_date", { ascending: true });
    if (error) setError("Dili ma-load ang bookings. I-check ang RLS policy.");
    else setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session) load();
  }, [session, load]);

  const login = async (e) => {
    e.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError("Sayop ang email o password.");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setRows([]);
  };

  const setStatus = async (id, status) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { setError("Dili ma-update ang status."); return; }
    setError("");
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const saveNotes = async (id, notes) => {
    const { error } = await supabase.from("bookings").update({ notes }).eq("id", id);
    if (error) { setError("Dili ma-save ang notes. Naa na ba ang 'notes' column sa table?"); return; }
    setError("");
    setRows((r) => r.map((x) => (x.id === id ? { ...x, notes } : x)));
  };

  const deleteBooking = async (id) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) { setError("Dili ma-delete. I-check ang DELETE policy sa Supabase."); return; }
    setError("");
    setRows((r) => r.filter((x) => x.id !== id));
  };

  if (!supabase) return <p className="p-8 text-white">Supabase is not configured.</p>;
  if (checking) return <div className="min-h-screen bg-neutral-950" />;

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
        <form onSubmit={login} className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-4">
          <h1 className="text-2xl font-bold text-white text-center">🔧 Admin Login</h1>
          {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" />
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl">Login</button>
        </form>
      </div>
    );
  }

  const counts = STATUSES.reduce(
    (a, s) => ({ ...a, [s]: rows.filter((r) => (r.status || "pending") === s).length }),
    {}
  );
  const today = todayStr();
  const todayCount = rows.filter((r) => dateOnly(r.preferred_date) === today).length;
  const q = search.trim().toLowerCase();

  const shown = rows
    .filter((r) => filter === "all" || (r.status || "pending") === filter)
    .filter((r) => !todayOnly || dateOnly(r.preferred_date) === today)
    .filter(
      (r) =>
        !q ||
        (r.plate_number || "").toLowerCase().includes(q) ||
        (r.customer_name || "").toLowerCase().includes(q)
    )
    .sort((a, b) => {
      const A = String(a.preferred_date || "");
      const B = String(b.preferred_date || "");
      return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
    });

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">🔧 Admin</h1>
          <div className="flex gap-2">
            {tab === "bookings" && (
              <button onClick={load} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm">{loading ? "..." : "Refresh"}</button>
            )}
            <button onClick={logout} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm">Logout</button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-neutral-800">
          {[["bookings", "Bookings"], ["services", "Services"], ["settings", "Settings"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-sm font-semibold -mb-px border-b-2 ${tab === key ? "border-orange-500 text-white" : "border-transparent text-neutral-400 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "services" ? (
          <ServicesManager />
        ) : tab === "settings" ? (
          <SettingsManager />
        ) : (
          <>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pangitaa sa plate o ngalan..."
            className="flex-1 bg-neutral-900 border border-neutral-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={() => setSortAsc((v) => !v)}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm whitespace-nowrap"
          >
            Date: {sortAsc ? "Earliest first" : "Latest first"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["all", ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize border ${filter === s ? "bg-orange-500 border-orange-500" : "border-neutral-700 text-neutral-300"}`}>
              {s}{s !== "all" ? ` (${counts[s]})` : ` (${rows.length})`}
            </button>
          ))}
          <button
            onClick={() => setTodayOnly((v) => !v)}
            className={`px-4 py-1.5 rounded-full text-sm border ${todayOnly ? "bg-orange-500 border-orange-500" : "border-neutral-700 text-neutral-300"}`}
          >
            Today ({todayCount})
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {shown.length === 0 && !loading && <p className="text-neutral-400">Walay bookings.</p>}

        <div className="space-y-3">
          {shown.map((b) => (
            <BookingCard
              key={b.id}
              b={b}
              onStatus={setStatus}
              onDelete={deleteBooking}
              onSaveNotes={saveNotes}
            />
          ))}
        </div>
          </>
        )}
      </div>
    </div>
  );
}