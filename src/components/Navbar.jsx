import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <a href="#" className="text-white font-extrabold text-2xl tracking-tight flex items-center gap-2">
          <span className="text-orange-500">🚗</span> THE MECHANIC
        </a>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-300">
          <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
          <a href="#booking" className="hover:text-orange-500 transition-colors">Booking</a>
          <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
        </div>

        {/* DESKTOP CTA */}
        <div className="hidden md:block">
          <a href="#booking" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
            Book Now
          </a>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-neutral-300 hover:text-white text-2xl p-2"
          aria-label="Toggle Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-neutral-900 border-b border-neutral-800 px-6 overflow-hidden"
          >
            <div className="py-4 flex flex-col gap-4 text-neutral-300 font-medium">
              <a href="#services" onClick={() => setMenuOpen(false)} className="hover:text-orange-500">Services</a>
              <a href="#booking" onClick={() => setMenuOpen(false)} className="hover:text-orange-500">Booking</a>
              <a href="#contact" onClick={() => setMenuOpen(false)} className="hover:text-orange-500">Contact</a>
              <a
                href="#booking"
                onClick={() => setMenuOpen(false)}
                className="bg-orange-500 text-white text-center py-2.5 rounded-lg font-semibold"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}