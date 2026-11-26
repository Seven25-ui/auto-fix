import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const FIELDS = [
  { key: "address", label: "Address", max: 120, placeholder: "e.g. 123 Colon St., Cebu City" },
  { key: "phone", label: "Phone", max: 40, placeholder: "e.g. (032) 123-4567" },
  { key: "email", label: "Email", max: 80, placeholder: "e.g. hello@yourshop.ph" },
  { key: "hours_text", label: "Operating hours", max: 80, placeholder: "e.g. Monday - Saturday: 8:00 AM - 6:00 PM" },
  { key: "closed_text", label: "Closed days", max: 80, placeholder: "e.g. Sunday: Closed" },
];

const inputClass =
  "w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500";

export default function SettingsManager() {
  const [saved, setSaved] = useState(null); // last saved values
  const [form, setForm] = useState(null); // values nga gi-edit
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: err } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (cancelled) return;
      if (err) setError("Dili ma-load ang settings. I-check ang settings table ug RLS policy.");
      else if (!data) setError("Walay settings row (id = 1) sa Supabase.");
      else {
        setSaved(data);
        setForm(data);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const set = (key) => (e) => {
    setOk(false);
    setError("");
    setForm({ ...form, [key]: e.target.value });
  };

  const dirty =
    form && saved && Object.keys(form).some((k) => String(form[k] ?? "") !== String(saved[k] ?? ""));

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setOk(false);

    const payload = {};
    for (const f of FIELDS) {
      const v = String(form[f.key] ?? "").trim();
      if (!v) {
        setError(`Kinahanglan naay sulod ang "${f.label}".`);
        return;
      }
      if (v.length > f.max) {
        setError(`Taas kaayo ang "${f.label}" (max ${f.max} ka letra).`);
        return;
      }
      payload[f.key] = v;
    }
    const year = Number(form.since_year);
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      setError("Ang 'Since year' kinahanglan tunga sa 1900 ug 2100.");
      return;
    }
    payload.since_year = year;

    setSaving(true);
    const { data, error: err } = await supabase
      .from("settings")
      .update(payload)
      .eq("id", 1)
      .select();
    setSaving(false);

    if (err) {
      setError("Dili ma-save. I-check ang mga sulod ug sulayi og usab.");
      return;
    }
    if (!data || data.length === 0) {
      setError("Dili ma-save. Ang admin account ra ang makausab sa settings.");
      return;
    }
    setSaved(data[0]);
    setForm(data[0]);
    setOk(true);
  };

  if (loading) return <p className="text-neutral-400">Loading...</p>;
  if (!form) return <p className="text-red-400 text-sm">{error}</p>;

  return (
    <form onSubmit={save} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5">
      <p className="text-sm text-neutral-400">
        Kini nga impormasyon makita sa website (Footer ug Hero) ug gamiton sab sa chat AI.
      </p>

      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="text-sm font-medium text-neutral-400 mb-2 block">{f.label}</label>
          <input
            value={form[f.key] ?? ""}
            onChange={set(f.key)}
            maxLength={f.max}
            placeholder={f.placeholder}
            className={inputClass}
          />
        </div>
      ))}

      <div>
        <label className="text-sm font-medium text-neutral-400 mb-2 block">Since year</label>
        <input
          type="number"
          min={1900}
          max={2100}
          value={form.since_year ?? ""}
          onChange={set("since_year")}
          className={inputClass}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {ok && <p className="text-green-400 text-sm">Na-save na! Makita na kini sa website.</p>}

      <button
        type="submit"
        disabled={saving || !dirty}
        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg font-semibold"
      >
        {saving ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}