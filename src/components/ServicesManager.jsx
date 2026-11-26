import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

const inputCls =
  "w-full bg-neutral-950 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500";

const EMPTY = { name: "", price: "", description: "", icon: "🔧", img: "" };

function ServiceRow({ s, onSave, onDelete }) {
  const [draft, setDraft] = useState(s);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(s);
  }, [s]);

  const dirty =
    draft.name !== s.name ||
    draft.price !== s.price ||
    (draft.description || "") !== (s.description || "") ||
    (draft.icon || "") !== (s.icon || "") ||
    (draft.img || "") !== (s.img || "") ||
    Number(draft.sort_order) !== Number(s.sort_order);

  const ch = (k) => (e) => setDraft({ ...draft, [k]: e.target.value });

  const save = async () => {
    setSaving(true);
    await onSave(s.id, {
      name: draft.name.trim(),
      price: draft.price.trim(),
      description: draft.description,
      icon: draft.icon,
      img: draft.img,
      sort_order: Number(draft.sort_order) || 0,
    });
    setSaving(false);
  };

  const toggle = () => onSave(s.id, { active: !s.active });

  const remove = () => {
    if (window.confirm(`I-delete ang "${s.name}"? Dili na kini mabalik. (Mas maayo ang Hide kung temporary ra.)`)) {
      onDelete(s.id);
    }
  };

  return (
    <div className={`bg-neutral-900 border rounded-xl p-4 space-y-3 ${s.active ? "border-neutral-800" : "border-neutral-800 opacity-60"}`}>
      <div className="grid gap-3 sm:grid-cols-[64px_1fr_140px_80px]">
        <input value={draft.icon || ""} onChange={ch("icon")} placeholder="🔧" className={`${inputCls} text-center text-lg`} aria-label="Icon" />
        <input value={draft.name} onChange={ch("name")} placeholder="Service name" className={inputCls} aria-label="Name" />
        <input value={draft.price} onChange={ch("price")} placeholder="₱1,500+" className={inputCls} aria-label="Price" />
        <input type="number" value={draft.sort_order} onChange={ch("sort_order")} className={inputCls} aria-label="Order" title="Order sa listahan" />
      </div>
      <textarea value={draft.description || ""} onChange={ch("description")} rows={2} placeholder="Description" className={`${inputCls} resize-y`} />
      <input value={draft.img || ""} onChange={ch("img")} placeholder="Image URL" className={inputCls} />

      <div className="flex flex-wrap items-center gap-2">
        {dirty && (
          <button onClick={save} disabled={saving} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 rounded-lg text-sm font-semibold">
            {saving ? "Saving..." : "Save changes"}
          </button>
        )}
        <span className={`text-xs px-2 py-1 rounded-full border ${s.active ? "border-green-500/40 text-green-400" : "border-neutral-600 text-neutral-400"}`}>
          {s.active ? "Visible sa site" : "Hidden"}
        </span>
        <div className="flex gap-2 sm:ml-auto">
          <button onClick={toggle} className="px-3 py-1.5 border border-neutral-700 hover:bg-neutral-800 rounded-lg text-sm text-neutral-300">
            {s.active ? "Hide" : "Show"}
          </button>
          <button onClick={remove} className="px-3 py-1.5 border border-red-500/40 hover:bg-red-500/10 rounded-lg text-sm text-red-400">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newS, setNewS] = useState(EMPTY);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) setError("Dili ma-load ang services. Na-run na ba ang SQL para sa services table?");
    else setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveService = async (id, patch) => {
    const { error } = await supabase.from("services").update(patch).eq("id", id);
    if (error) { setError("Dili ma-save ang usab."); return; }
    setError("");
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const deleteService = async (id) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { setError("Dili ma-delete ang service."); return; }
    setError("");
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const addService = async (e) => {
    e.preventDefault();
    if (!newS.name.trim() || !newS.price.trim()) {
      setError("Kinahanglan ang name ug price.");
      return;
    }
    setAdding(true);
    const nextOrder = rows.reduce((m, r) => Math.max(m, Number(r.sort_order) || 0), 0) + 1;
    const { data, error } = await supabase
      .from("services")
      .insert([{ ...newS, name: newS.name.trim(), price: newS.price.trim(), sort_order: nextOrder }])
      .select()
      .single();
    setAdding(false);
    if (error) { setError("Dili ma-add ang service."); return; }
    setError("");
    setRows((r) => [...r, data]);
    setNewS(EMPTY);
  };

  const ch = (k) => (e) => setNewS({ ...newS, [k]: e.target.value });

  return (
    <div className="space-y-6">
      <form onSubmit={addService} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <h2 className="font-semibold">Add new service</h2>
        <div className="grid gap-3 sm:grid-cols-[64px_1fr_160px]">
          <input value={newS.icon} onChange={ch("icon")} placeholder="🔧" className={`${inputCls} text-center text-lg`} aria-label="Icon" />
          <input value={newS.name} onChange={ch("name")} placeholder="Service name" className={inputCls} aria-label="Name" />
          <input value={newS.price} onChange={ch("price")} placeholder="₱1,500+" className={inputCls} aria-label="Price" />
        </div>
        <textarea value={newS.description} onChange={ch("description")} rows={2} placeholder="Description" className={`${inputCls} resize-y`} />
        <input value={newS.img} onChange={ch("img")} placeholder="Image URL (optional)" className={inputCls} />
        <button type="submit" disabled={adding} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 rounded-lg text-sm font-semibold">
          {adding ? "Adding..." : "Add service"}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {loading && <p className="text-neutral-400 text-sm">Loading...</p>}
      {!loading && rows.length === 0 && !error && <p className="text-neutral-400">Wala pay services. Pag-add sa taas.</p>}

      <div className="space-y-3">
        {rows.map((s) => (
          <ServiceRow key={s.id} s={s} onSave={saveService} onDelete={deleteService} />
        ))}
      </div>
    </div>
  );
}