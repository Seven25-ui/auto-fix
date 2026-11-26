import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useServices from "../hooks/useServices";
import { supabase } from "../lib/supabase";

export default function Booking({ selectedService }) {
  const { services } = useServices();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    plate: "",
    service: selectedService || "",
    date: "",
  });

  // Kung wala pay napili nga service, ibutang ang una sa listahan kung na-load na
  useEffect(() => {
    if (!form.service && services.length > 0) {
      setForm((prev) => ({ ...prev, service: services[0].name }));
    }
  }, [services, form.service]);

  useEffect(() => {
    if (selectedService) {
      setForm((prev) => ({ ...prev, service: selectedService }));
      setSent(false);
      setErrorMsg("");
    }
  }, [selectedService]);

  const set = (k) => (e) => {
    setErrorMsg("");
    setForm({ ...form, [k]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date) {
      setErrorMsg("Palihug isulod ang imong Full Name ug Preferred Date.");
      return;
    }
    if (!form.service) {
      setErrorMsg("Palihug pili og service.");
      return;
    }
    if (form.date < today) {
      setErrorMsg("Ang petsa kinahanglan karon o sa umaabot nga adlaw.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      if (supabase) {
        const { error } = await supabase.from("bookings").insert([
          {
            customer_name: form.name.trim(),
            plate_number: form.plate.trim().toUpperCase() || null,
            service_name: form.service,
            preferred_date: form.date,
          },
        ]);
        if (error) throw error;
      }
      setSent(true);
    } catch (err) {
      if (err?.code === "42501") {
        setErrorMsg("Palihug pili og petsa nga karon o sa umaabot nga adlaw.");
      } else if (err?.code === "23514") {
        setErrorMsg("Taas kaayo ang gisulod nga Name o Plate Number. Palihug paiklia.");
      } else {
        setErrorMsg("Dili pa ma-save karon. Palihug sulayi og usab.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 bg-neutral-900">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Book an Appointment</h2>
          <p className="text-neutral-400 text-lg">Fill in your details and we'll call you back within 30 minutes.</p>
        </div>
        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-500/10 border border-green-500/40 text-green-400 rounded-2xl p-10 text-center">
            <p className="text-6xl mb-4">✅</p>
            <p className="font-semibold text-xl">Thanks, {form.name}!</p>
            <p className="mt-2">We received your booking for <span className="font-semibold text-white">{form.service}</span> on <span className="font-semibold text-white">{form.date}</span>.</p>
            <button
              onClick={() => {
                setSent(false);
                setForm({ name: "", plate: "", service: selectedService || services[0]?.name || "", date: "" });
              }}
              className="mt-6 text-sm underline text-green-300 hover:text-white"
            >
              Book another appointment
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 space-y-5 shadow-2xl">
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-xl px-4 py-3">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-neutral-400 mb-2 block">Full Name</label>
              <input value={form.name} onChange={set("name")} maxLength={80} placeholder="e.g. Juan Dela Cruz" className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-400 mb-2 block">Plate Number</label>
              <input value={form.plate} onChange={set("plate")} maxLength={20} placeholder="e.g. ABC 1234" className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-400 mb-2 block">Service Type</label>
              <select value={form.service} onChange={set("service")} className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                {services.map((s) => <option key={s.id || s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-400 mb-2 block">Preferred Date</label>
              <input type="date" min={today} value={form.date} onChange={set("date")} className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 mt-2"
            >
              {submitting ? "Submitting..." : "Submit Booking"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}