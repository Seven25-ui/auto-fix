import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

const STATUSES = ["pending", "confirmed", "done", "cancelled"];
const BADGE = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
  confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/40",
  done: "bg-green-500/15 text-green-400 border-green-500/40",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/40",
};

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
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
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
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

  const counts = STATUSES.reduce((a, s) => ({ ...a, [s]: rows.filter((r) => (r.status || "pending") === s).length }), {});
  const shown = filter === "all" ? rows : rows.filter((r) => (r.status || "pending") === filter);

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">🔧 Bookings</h1>
          <div className="flex gap-2">
            <button onClick={load} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm">{loading ? "..." : "Refresh"}</button>
            <button onClick={logout} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm">Logout</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["all", ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize border ${filter === s ? "bg-orange-500 border-orange-500" : "border-neutral-700 text-neutral-300"}`}>
              {s}{s !== "all" ? ` (${counts[s]})` : ` (${rows.length})`}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {shown.length === 0 && !loading && <p className="text-neutral-400">Walay bookings.</p>}

        <div className="space-y-3">
          {shown.map((b) => {
            const st = b.status || "pending";
            return (
              <div key={b.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-semibold">{b.customer_name}</p>
                  <p className="text-sm text-neutral-400">🚗 {b.plate_number || "-"} · 🛠 {b.service_name}</p>
                  <p className="text-sm text-neutral-400">📅 {b.preferred_date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full border capitalize ${BADGE[st] || BADGE.pending}`}>{st}</span>
                  <select value={st} onChange={(e) => setStatus(b.id, e.target.value)}
                    className="bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-sm capitalize">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}