import React from "react";
import { motion } from "framer-motion";
import useSettings from "../hooks/useSettings";

export default function Hero() {
  const { since_year } = useSettings();

  return (
    <section className="relative bg-neutral-950 text-white overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2000&auto=format&fit=crop"
          alt="Car in garage"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-900/40" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-32 md:py-48 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex justify-center mb-6">
            <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-semibold px-4 py-2 rounded-full border border-orange-500/30 backdrop-blur-sm">
              🏆 Trusted Auto Repair Since {since_year}
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