import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Booking from "./components/Booking";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import { SERVICES } from "./data/mockData";

export default function App() {
  const [selectedService, setSelectedService] = useState(SERVICES[0].name);

  return (
    <div className="min-h-screen bg-neutral-950 font-sans selection:bg-orange-500 selection:text-white">
      <Navbar />
      <Hero />
      <Services onSelectService={setSelectedService} />
      <Booking selectedService={selectedService} />
      <Testimonials />
      <Footer />
      <ChatWidget />
    </div>
  );
}