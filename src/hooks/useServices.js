import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { SERVICES as FALLBACK } from "../data/mockData";

const normalize = (r) => ({
  id: r.id,
  name: r.name,
  price: r.price,
  desc: r.description || "",
  icon: r.icon || "🔧",
  img: r.img || "",
});

// Kuha sa active nga services gikan sa Supabase.
// Kung walay Supabase o naay error, mogamit sa daan nga mockData para dili mawala ang site.
export default function useServices() {
  const [services, setServices] = useState(supabase ? [] : FALLBACK);
  const [loading, setLoading] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setServices(FALLBACK);
        else setServices((data || []).map(normalize));
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { services, loading };
}