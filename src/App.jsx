import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Mock data ----------
const SERVICES = [
  { icon: "🔧", name: "General Tune-Up", desc: "Full inspection, oil change, filter replacement, and fluid top-up.", price: "₱1,500+" },
  { icon: "🛞", name: "Wheel Alignment & Balancing", desc: "Computerized alignment for smoother, safer driving.", price: "₱1,200" },
  { icon: "🔋", name: "Battery & Electrical", desc: "Battery testing, replacement, alternator and starter repair.", price: "₱800+" },
  { icon: "❄️", name: "Aircon Cleaning & Repair", desc: "Compressor service, Freon recharge, full system diagnostics.", price: "₱2,500+" },
  { icon: "🛢️", name: "Oil Change Express", desc: "Genuine oil and filters, done in 30 minutes.", price: "₱900" },
  { icon: "🚗", name: "Preventive Maintenance (PMS)", desc: "Scheduled 5k / 10k / 20k / 40k km checkups.", price: "₱2,000+" },
];

const TESTIMONIALS = [
  { name: "Marco D.", text: "My SUV was back on the road within a day. Great value and an honest estimate.", stars: 5 },
  { name: "Jenny R.", text: "Booked my PMS online — smooth and easy. They even sent photos of the progress!", stars: 5 },
  { name: "Kuya Ben", text: "Excellent service, and they never push repairs you don't need. Thanks, AutoFix!", stars: 4 },
];

// ---------- Chat Widget (mock AI, demo) ----------
const CANNED_REPLIES = [
  "Thanks for reaching out! For tune-ups and PMS, our typical turnaround is 1-2 days. Would you like to book an appointment now?",
  "Noted! Here are our rates: Oil Change ₱900, Tune-Up ₱1,500+, Aircon service ₱2,500+. Anything else you'd like to know?",
  "We take care of every vehicle that comes in. We can schedule yours as early as tomorrow. Shall I book you in?",
];

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm AutoFix AI. What's going on with your car, or what service are you looking for? 🔧" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [replyIdx, setReplyIdx] = useState(0);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "ai", text: CANNED_REPLIES[replyIdx % CANNED_REPLIES.length] }]);
      setReplyIdx((i) => i + 1);
    }, 900);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-2xl shadow-lg shadow-orange-500/40 transition-colors"
        aria-label="Open chat"
      >
        {open ? "✕" : "💬"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-5 z-50 w-[340px] max-w-[calc(100vw-2.5rem)] bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-orange-500 px-4 py-3 flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <p className="text-white font-semibold text-sm">AutoFix AI Assistant</p>
                <p className="text-orange-100 text-xs">Powered by Cloudflare Workers AI</p>
              </div>
            </div>
            <div className="h-72 overflow-y-auto p-3 space-y-2 bg-neutral-950">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    m.from === "user" ? "bg-orange-500 text-white rounded-br-sm" : "bg-neutral-800 text-neutral-100 rounded-bl-sm"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 px-3 py-2 rounded-xl rounded-bl-sm">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="p-3 border-t border-neutral-700 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your question..."
                className="flex-1 bg-neutral-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button onClick={send} className="bg-orange-500 hover:bg-orange-600 text-white px-3 rounded-lg text-sm">➤</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------- Sections ----------
export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-orange-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            🏆 Trusted Auto Repair Since 2010
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Your Car, <span className="text-orange-500">In Good Hands</span>
          </h1>
          <p className="mt-4 text-neutral-300 max-w-xl text-lg">
            Expert mechanics, transparent pricing, and a 24/7 AI assistant ready to answer your questions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#booking" className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition-colors">Book Appointment</a>
            <a href="#services" className="border border-neutral-600 hover:border-orange-500 px-6 py-3 rounded-lg font-semibold transition-colors">View Services</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="py-20 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-2">Our Services</h2>
        <p className="text-neutral-400 mb-10">Transparent pricing. No hidden fees.</p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.name} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-500/50 transition-colors">
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="text-white font-semibold text-lg">{s.name}</h3>
              <p className="text-neutral-400 text-sm mt-2">{s.desc}</p>
              <p className="text-orange-500 font-semibold mt-3">From {s.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Booking() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", plate: "", service: SERVICES[0].name, date: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section id="booking" className="py-20 bg-neutral-900">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-2">Book an Appointment</h2>
        <p className="text-neutral-400 mb-8">Fill in your details and we'll call you back within 30 minutes.</p>
        {sent ? (
          <div className="bg-green-500/10 border border-green-500/40 text-green-400 rounded-xl p-6 text-center">
            <p className="text-4xl mb-2">✅</p>
            <p className="font-semibold">Thanks, {form.name}! We received your booking for {form.service}.</p>
          </div>
        ) : (
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-4">
            <input value={form.name} onChange={set("name")} placeholder="Your name" className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500" />
            <input value={form.plate} onChange={set("plate")} placeholder="Plate number (e.g. ABC 1234)" className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500" />
            <select value={form.service} onChange={set("service")} className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500">
              {SERVICES.map((s) => <option key={s.name}>{s.name}</option>)}
            </select>
            <input type="date" value={form.date} onChange={set("date")} className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500" />
            <button onClick={() => form.name && form.date && setSent(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors">
              Submit Booking
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-10">What Our Customers Say</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <p className="text-orange-400">{"⭐".repeat(t.stars)}</p>
              <p className="text-neutral-200 text-sm mt-3">"{t.text}"</p>
              <p className="text-neutral-500 text-xs mt-4 font-semibold">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-white font-bold text-xl">🔧 AutoFix</h3>
          <p className="text-neutral-400 text-sm mt-2">Your car, in good hands.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <p className="text-neutral-400 text-sm">📍 123 Colon St., Cebu City</p>
          <p className="text-neutral-400 text-sm">📞 (032) 123-4567</p>
          <p className="text-neutral-400 text-sm">✉️ hello@autofix.ph</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Hours</h4>
          <p className="text-neutral-400 text-sm">Mon - Sat: 8:00 AM - 6:00 PM</p>
          <p className="text-neutral-400 text-sm">Sun: Closed</p>
        </div>
      </div>
      <p className="text-center text-neutral-600 text-xs pb-6">© 2026 AutoFix Mechanic Shop. Powered by Cloudflare Workers.</p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 font-sans">
      <nav className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-white font-bold text-lg">🔧 AutoFix</span>
          <div className="hidden md:flex gap-6 text-sm text-neutral-300">
            <a href="#services" className="hover:text-orange-500">Services</a>
            <a href="#booking" className="hover:text-orange-500">Booking</a>
            <a href="#booking" className="hover:text-orange-500">Contact</a>
          </div>
        </div>
      </nav>
      <Hero />
      <Services />
      <Booking />
      <Testimonials />
      <Footer />
      <ChatWidget />
    </div>
  );
}
