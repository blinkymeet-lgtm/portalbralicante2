import { useSEO } from "@/lib/seo";
import { CITIES } from "@/lib/types";
import CityCard from "@/components/CityCard";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CitiesPage() {
  useSEO({
    title: "Cidades — Portal BR Espanha",
    description: "Encontre brasileiros e serviços em Alicante, Benidorm, Torrevieja e outras cidades de Espanha.",
  });

  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("listings")
        .select("city")
        .eq("is_active", true);
      if (data) {
        const cc: Record<string, number> = {};
        data.forEach((r) => { cc[r.city] = (cc[r.city] ?? 0) + 1; });
        setCounts(cc);
      }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ label: "Cidades" }]} />
      <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-1">Cidades</h1>
      <p className="text-sm text-slate-500 mb-6">Encontre brasileiros perto de você</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {CITIES.map((c) => (
          <CityCard key={c.name} city={c} count={counts[c.name]} />
        ))}
      </div>
    </div>
  );
}
