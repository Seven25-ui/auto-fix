import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Fallback kung wala pa ang settings table o mag-fail ang Supabase (dili madaot ang site)
export const DEFAULT_SETTINGS = {
  address: "123 Colon St., Cebu City",
  phone: "(032) 123-4567",
  email: "hello@themechanic.ph",
  hours_text: "Monday - Saturday: 8:00 AM - 6:00 PM",
  closed_text: "Sunday: Closed",
  since_year: 2010,
};

export default function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();
        if (!cancelled && !error && data) {
          setSettings({ ...DEFAULT_SETTINGS, ...data });
        }
      } catch {
        // gamiton ang defaults
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}