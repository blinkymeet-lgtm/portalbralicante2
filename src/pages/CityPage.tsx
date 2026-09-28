import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useSEO } from "@/lib/seo";
import { CITIES, type Listing } from "@/lib/types";
import CityCard from "@/components/CityCard";
import ListingCard from "@/components/ListingCard";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CityPage() {
  const { city } = useParams<{ city: string }>();
  const cityName = CITIES.find((c) => c.name.toLowerCase() === city?.toLowerCase())?.name ?? city ?? "";
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useSEO({
    title: `Brasileiros em ${cityName} — Portal BR em Alicante`,
    description: `Serviços, restaurantes, lojas e negócios brasileiros em ${cityName}. Encontre tudo o que precisa perto de você.`,
    image: CITIES.find((c) => c.name === cityName)?.image,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("is_active", true)
        .eq("city", cityName)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (data) setListings(data);

      const { data: all } = await supabase
        .from("listings")
        .select("city")
        .eq("is_active", true);
      if (all) {
        const cc: Record<string, number> = {};
        all.forEach((r) => { cc[r.city] = (cc[r.city] ?? 0) + 1; });
        setCounts(cc);
      }
      setLoading(false);
    })();
  }, [cityName]);

  const cityInfo = CITIES.find((c) => c.name === cityName);

  return (
    <div>
      {cityInfo && (
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <img src={cityInfo.image} alt={cityInfo.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 to-brand-navy-950/30" />
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <Breadcrumbs items={[{ label: cityName }]} />
            <h1 className="text-2xl sm:text-4xl font-bold text-white mt-2">{cityName}</h1>
            <p className="text-sm text-white/80 mt-1">{cityInfo.description}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!cityInfo && <Breadcrumbs items={[{ label: cityName }]} />}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            {loading ? "Carregando..." : `${listings.length} ${listings.length === 1 ? "anúncio ativo" : "anúncios ativos"}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg mb-2">Nenhum anúncio ativo em {cityName}</p>
            <Link to="/anuncios" className="text-sm text-brand-green-600 font-medium hover:text-brand-green-700">
              Ver todos os anúncios &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}

        {/* Other cities */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Outras cidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CITIES.filter((c) => c.name !== cityName).map((c) => (
              <CityCard key={c.name} city={c} count={counts[c.name]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
