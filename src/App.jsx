import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Mock data ----------
const SERVICES = [
  { 
    icon: "🔧", 
    name: "General Tune-Up", 
    desc: "Full inspection, oil change, filter replacement, and fluid top-up.", 
    price: "₱1,500+",
    img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    icon: "🛞", 
    name: "Wheel Alignment & Balancing", 
    desc: "Computerized alignment for smoother, safer driving.", 
    price: "₱1,200",
    img: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    icon: "🔋", 
    name: "Battery & Electrical", 
    desc: "Battery testing, replacement, alternator and starter repair.", 
    price: "₱800+",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    icon: "❄️", 
    name: "Aircon Cleaning & Repair", 
    desc: "Compressor service, Freon recharge, full system diagnostics.", 
    price: "₱2,500+",
    img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    icon: "🛢️", 
    name: "Oil Change Express", 
    desc: "Genuine oil and filters, done in 30 minutes.", 
    price: "₱900",
    img: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    icon: "🚗", 
    name: "Preventive Maintenance (PMS)", 
    desc: "Scheduled 5k / 10k / 20k / 40k km checkups.", 
    price: "₱2,000+",
    img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop" 
  },
];

const TESTIMONIALS = [
  { name: "Marco D.", text: "My SUV was back on the road within a day. Great value and an honest estimate.", stars: 5 },
  { name: "Jenny R.", text: "Booked my PMS online — smooth and easy. They even sent photos of the progress!", stars: 5 },
  { name: "Kuya Ben", text: "Excellent service, and they never push repairs you don't need. Thanks, The Mechanic!", stars: 4 },
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
    { from: "ai", text: "Hi! I'm The Mechanic AI. What's going on with your car, or what service are you looking for? 🚗" },
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
                <p className="text-white font-semibold text-sm">The Mechanic AI</p>
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
    <section className="relative bg-neutral-950 text-white overflow-hidden">
      {/* BACKGROUND IMAGE - Bag-ong Link */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2000&auto=format&fit=crop" 
          alt="Car in garage" 
          className="w-full h-full object-cover opacity-30"
        />
        {/* Dark Overlay aron klaro ang text */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-900/40"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-32 md:py-48 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          
          <div className="flex justify-center mb-6">
            <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-semibold px-4 py-2 rounded-full border border-orange-500/30 backdrop-blur-sm">
              🏆 Trusted Auto Repair Since 2010
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-center tracking-tight drop-shadow-lg">
            Your Car, <br className="hidden md:block" />
            <span className="text-orange-500">In Good Hands</span>
          </h1>
          
          <p className="mt-6 text-neutral-300 max-w-2xl mx-auto text-center text-lg md:text-xl drop-shadow-md">
            Expert mechanics, transparent pricing, and a 24/7 AI assistant ready to answer your questions.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#booking" className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-lg font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5">
              Book Appointment
            </a>
            <a href="#services" className="border border-neutral-500 hover:border-orange-500 px-8 py-4 rounded-lg font-semibold transition-all hover:bg-neutral-800/50 backdrop-blur-sm">
              View Services
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="py-24 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-neutral-400 text-lg">Transparent pricing. No hidden fees.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.name} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all hover:-translate-y-1 shadow-lg group flex flex-col">
              
              {/* IMAGE SECTION */}
              <div className="h-48 overflow-hidden relative bg-neutral-800">
                <img 
                  src={s.img} 
                  alt={s.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-neutral-900/80 backdrop-blur-md w-10 h-10 flex items-center justify-center rounded-lg text-xl shadow-lg">
                  {s.icon}
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-white font-semibold text-xl">{s.name}</h3>
                <p className="text-neutral-400 text-sm mt-3 leading-relaxed flex-1">{s.desc}</p>
                <p className="text-orange-500 font-bold text-lg mt-6">From {s.price}</p>
              </div>
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
            <p className="mt-2">We received your booking for {form.service} on {form.date}.</p>
            <button onClick={() => setSent(false)} className="mt-6 text-sm underline text-green-300 hover:text-white">Book another appointment</button>
          </motion.div>
        ) : (
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 space-y-5 shadow-2xl">
            <div>
              <label className="text-sm font-medium text-neutral-400 mb-2 block">Full Name</label>
              <input value={form.name} onChange={set("name")} placeholder="e.g. Juan Dela Cruz" className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-400 mb-2 block">Plate Number</label>
              <input value={form.plate} onChange={set("plate")} placeholder="e.g. ABC 1234" className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-400 mb-2 block">Service Type</label>
              <select value={form.service} onChange={set("service")} className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                {SERVICES.map((s) => <option key={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-400 mb-2 block">Preferred Date</label>
              <input type="date" value={form.date} onChange={set("date")} className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" />
            </div>
            <button onClick={() => form.name && form.date && setSent(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 mt-2">
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
    <section className="py-24 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
          <p className="text-neutral-400 text-lg">Don't just take our word for it.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-neutral-700 transition-colors">
              <p className="text-orange-400 text-lg">{"⭐".repeat(t.stars)}</p>
              <p className="text-neutral-200 mt-4 leading-relaxed">"{t.text}"</p>
              <p className="text-neutral-500 text-sm mt-6 font-bold">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 pt-16 pb-8">
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

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 font-sans selection:bg-orange-500 selection:text-white">
      <nav className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* LOGO: Left side */}
          <span className="text-white font-extrabold text-2xl tracking-tight flex items-center gap-2 cursor-pointer">
            <span className="text-orange-500">🚗</span> THE MECHANIC
          </span>
          
          {/* NAVIGATION LINKS: Center */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-300">
            <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
            <a href="#booking" className="hover:text-orange-500 transition-colors">Booking</a>
            <a href="#booking" className="hover:text-orange-500 transition-colors">Contact</a>
          </div>

          {/* BOOKING BUTTON: Right side */}
          <div className="hidden md:block">
            <a href="#booking" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
              Book Now
            </a>
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