import React from "react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-neutral-900 border-t border-neutral-800 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-3">
        <div>
          <h3 className="text-white font-bold text-2xl flex items-center gap-2">🚗 THE MECHANIC</h3>
          <p className="text-neutral-400 mt-4">Your car, in good hands. Serving Cebu since 2010.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
          <ul className="space-y-3 text-neutral-400">
            <li className="flex items-center gap-3">📍 123 Colon St., Cebu City</li>
            <li className="flex items-center gap-3">📞 (032) 123-4567</li>
            <li className="flex items-center gap-3">✉️ hello@themechanic.ph</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Operating Hours</h4>
          <ul className="space-y-3 text-neutral-400">
            <li>Monday - Saturday: 8:00 AM - 6:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-800 text-center">
        <p className="text-neutral-600 text-sm">© 2026 THE MECHANIC. Powered by React & Cloudflare Workers.</p>
      </div>
    </footer>
  );
}