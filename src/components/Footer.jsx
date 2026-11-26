import React, { useState, useEffect } from "react";
import useSettings from "../hooks/useSettings";

const isUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u.trim());

function LegalModal({ type, s, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const contact = [s.email, s.phone].filter(Boolean).join(" · ");

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 text-neutral-300 text-sm leading-relaxed"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-white">
            {type === "terms" ? "Terms of Service" : "Privacy Policy"}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-xl" aria-label="Close">✕</button>
        </div>
        <p className="text-neutral-500 mb-4">Last updated: November 2026</p>

        {type === "terms" ? (
          <div className="space-y-4">
            <section>
              <h3 className="text-white font-semibold mb-1">1. Bookings</h3>
              <p>Submitting a booking on this website (through the form or the AI chat) is a request for an appointment. It is confirmed only after THE MECHANIC contacts you. The shop may reschedule or decline a request, for example when fully booked or on days we are closed.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">2. Prices</h3>
              <p>Prices shown are starting prices ("from"). The final price depends on your vehicle and the work needed, and will be given to you after inspection and before work begins.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">3. AI assistant</h3>
              <p>The chat assistant gives general information and may make mistakes. Please confirm important details such as prices, availability and hours with the shop directly.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">4. Your information</h3>
              <p>Please provide accurate details, especially your mobile number, so we can reach you about your booking.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">5. Changes</h3>
              <p>We may update these terms from time to time. The latest version is always shown on this website.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">6. Contact</h3>
              <p>{contact || "Please contact the shop using the details in the footer."}</p>
            </section>
          </div>
        ) : (
          <div className="space-y-4">
            <section>
              <h3 className="text-white font-semibold mb-1">1. What we collect</h3>
              <p>When you book, we collect your name, mobile number, plate number (optional), the service you want and your preferred date. If you use the AI chat, we also process the messages you type there. The shop may add internal notes to your booking.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">2. Why we collect it</h3>
              <p>We use your information only to schedule and confirm your appointment, to call you back, and to serve you at the shop.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">3. Where it goes</h3>
              <p>Your booking is saved in our online database and sent to the shop as a notification so the staff can contact you. Chat messages are processed by an AI service to generate replies. We do not sell your personal information.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">4. How long we keep it</h3>
              <p>We keep booking records only as long as needed to provide our service and for the shop's records.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">5. Your rights</h3>
              <p>Under the Philippine Data Privacy Act of 2012 (RA 10173), you may ask to see, correct or delete the personal information we hold about you. Contact us using the details below.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">6. Contact</h3>
              <p>{contact || "Please contact the shop using the details in the footer."}</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Footer() {
  const s = useSettings();
  const [legal, setLegal] = useState(null);
  const phoneLink = s.phone ? `tel:${String(s.phone).replace(/[^0-9+]/g, "")}` : null;

  const socials = [
    ["Facebook", s.facebook_url],
    ["Instagram", s.instagram_url],
    ["TikTok", s.tiktok_url],
    ["Messenger", s.messenger_url],
  ].filter(([, url]) => isUrl(url));

  return (
    <footer id="contact" className="bg-neutral-900 border-t border-neutral-800 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-3">
        <div>
          <h3 className="text-white font-bold text-2xl flex items-center gap-2">🚗 THE MECHANIC</h3>
          <p className="text-neutral-400 mt-4">Your car, in good hands. Serving Cebu since {s.since_year}.</p>
          {socials.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {socials.map(([label, url]) => (
                <a
                  key={label}
                  href={url.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm border border-neutral-700 text-neutral-300 hover:border-orange-500 hover:text-orange-400 rounded-full transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
          <ul className="space-y-3 text-neutral-400">
            <li className="flex items-center gap-3">📍 {s.address}</li>
            <li className="flex items-center gap-3">
              📞{" "}
              {phoneLink ? (
                <a href={phoneLink} className="hover:text-orange-400 transition-colors">{s.phone}</a>
              ) : (
                s.phone
              )}
            </li>
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
      <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-neutral-600 text-sm">© {new Date().getFullYear()} THE MECHANIC. All rights reserved.</p>
        <div className="flex gap-4 text-sm">
          <button onClick={() => setLegal("terms")} className="text-neutral-500 hover:text-orange-400 transition-colors">Terms of Service</button>
          <button onClick={() => setLegal("privacy")} className="text-neutral-500 hover:text-orange-400 transition-colors">Privacy Policy</button>
        </div>
      </div>
      {legal && <LegalModal type={legal} s={s} onClose={() => setLegal(null)} />}
    </footer>
  );
}