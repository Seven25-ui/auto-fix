import React from "react";
import useSettings from "../hooks/useSettings";

export default function Footer() {
  const s = useSettings();

  return (
    <footer id="contact" className="bg-neutral-900 border-t border-neutral-800 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-3">
        <div>
          <h3 className="text-white font-bold text-2xl flex items-center gap-2">🚗 THE MECHANIC</h3>
          <p className="text-neutral-400 mt-4">Your car, in good hands. Serving Cebu since {s.since_year}.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
          <ul className="space-y-3 text-neutral-400">
            <li className="flex items-center gap-3">📍 {s.address}</li>
            <li className="flex items-center gap-3">📞 {s.phone}</li>
            <li className="flex items-center gap-3">✉️ {s.email}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Operating Hours</h4>
          <ul className="space-y-3 text-neutral-400">
            <li>{s.hours_text}</li>
            <li>{s.closed_text}</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-800 text-center">
        <p className="text-neutral-600 text-sm">© 2026 THE MECHANIC. Powered by React & Cloudflare Workers.</p>
      </div>
    </footer>
  );
}