import React from "react";
import { TESTIMONIALS } from "../data/mockData";

export default function Testimonials() {
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