import React from "react";

// SAMPLE reviews ni. Ilisi sa tinuod nga reviews sa shop sa dili pa mo-live para sa customers.
const TESTIMONIALS = [
  { name: "Marco D.", stars: 5, text: "My SUV was back on the road within a day. Great value and an honest estimate." },
  { name: "Jenny R.", stars: 5, text: "Booked my PMS online — smooth and easy. They even sent photos of the progress!" },
  { name: "Kuya Ben", stars: 4, text: "Excellent service, and they never push repairs you don't need. Thanks, The Mechanic!" },
  { name: "Rhea L.", stars: 5, text: "My aircon was blowing warm air. Fixed the same day and the price matched the quote." },
  { name: "Ate Joy", stars: 5, text: "Maayo kaayo ang serbisyo, dali ra ug dili mahal. Mobalik gyud ko sa sunod nga PMS!" },
  { name: "Dennis M.", stars: 4, text: "The wheel alignment made my car so much smoother. Clean shop and friendly staff." },
];

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