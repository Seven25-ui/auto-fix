import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Booking from "./components/Booking";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import AdminPanel from "./components/AdminPanel";
import { SERVICES } from "./data/mockData";

export default function App() {
  const [selectedService, setSelectedService] = useState(SERVICES[0].name);
  const [isAdmin, setIsAdmin] = useState(window.location.hash === "#admin");

  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (isAdmin) return <AdminPanel />;

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