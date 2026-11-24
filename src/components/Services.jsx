import React from "react";
import { SERVICES } from "../data/mockData";

export default function Services({ onSelectService }) {
  const handleBookClick = (serviceName) => {
    onSelectService(serviceName);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

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

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-white font-semibold text-xl">{s.name}</h3>
                <p className="text-neutral-400 text-sm mt-3 leading-relaxed flex-1">{s.desc}</p>
                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <p className="text-orange-500 font-bold text-lg">From {s.price}</p>
                  <button
                    onClick={() => handleBookClick(s.name)}
                    className="text-sm font-semibold text-white bg-neutral-800 hover:bg-orange-500 px-4 py-2 rounded-lg transition-colors"
                  >
                    Book →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}