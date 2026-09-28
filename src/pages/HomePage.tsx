import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronRight, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSEO } from "@/lib/seo";
import { CATEGORIES, CITIES, type Listing } from "@/lib/types";
import CategoryGrid from "@/components/CategoryGrid";
import CityCard from "@/components/CityCard";
import ListingCard from "@/components/ListingCard";
import SearchAutocomplete from "@/components/SearchAutocomplete";

export default function HomePage() {
  useSEO({
    title: "Portal BR em Alicante — Tudo o que o brasileiro precisa, perto de você",
    description: "Encontre serviços, restaurantes, lojas, profissionais e negócios brasileiros em Alicante, Benidorm, Torrevieja e Elche.",
  });

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [cityCounts, setCityCounts] = useState<Record<string, number>>({});
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const { data: feat } = await supabase
        .from("listings")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(8);
      if (feat) setFeatured(feat);

      const { data: all } = await supabase
        .from("listings")
        .select("city, category")
        .eq("is_active", true);

      if (all) {
        const cc: Record<string, number> = {};
        const cat: Record<string, number> = {};
        all.forEach((r) => {
          cc[r.city] = (cc[r.city] ?? 0) + 1;
          cat[r.category] = (cat[r.category] ?? 0) + 1;
        });
        setCityCounts(cc);
        setCategoryCounts(cat);
      }
    })();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("cidade", city);
    navigate(`/anuncios?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-brand-navy-950 overflow-hidden">
        {/* Subtle decorative accents */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-yellow-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        {/* Thin accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-brand-green-500" />
          <div className="w-12 bg-brand-yellow-400" />
          <div className="w-12 bg-brand-red-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-24">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <img src="/LOGO_VESAO_BRANCA_atl.PNG" alt="Portal BR em Alicante" className="h-36 sm:h-44 w-auto mx-auto mb-5" />
            <p className="text-lg sm:text-xl text-white font-semibold mb-2">
              Tudo o que o brasileiro precisa, perto de você.
            </p>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Encontre serviços, restaurantes, lojas, profissionais e negócios brasileiros em Alicante, Benidorm, Torrevieja e Elche.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-card-hover p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
            <SearchAutocomplete
              value={query}
              onChange={setQuery}
              onSelect={(v) => {
                setQuery(v);
                navigate(`/anuncios?q=${encodeURIComponent(v)}`);
              }}
            />
            <div className="relative sm:w-44">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-8 py-3 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 outline-none transition-all appearance-none bg-white"
              >
                <option value="">Onde?</option>
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn-primary"
            >
              Pesquisar
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Restaurante", "Barbearia", "Advogado", "Mercado", "Imobiliária"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  navigate(`/anuncios?q=${encodeURIComponent(tag)}`);
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-sm transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">O que você procura?</h2>
          <p className="text-sm text-slate-500">Navegue pelas categorias de serviços e negócios</p>
        </div>
        <CategoryGrid categories={CATEGORIES} counts={categoryCounts} />
      </section>

      {/* Cities */}
      <section className="bg-slate-50 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Encontre brasileiros perto de você</h2>
            <p className="text-sm text-slate-500">Selecione a sua cidade para ver os anúncios disponíveis</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CITIES.map((c) => (
              <CityCard key={c.name} city={c} count={cityCounts[c.name]} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-yellow-500" />
                Destaques
              </h2>
              <p className="text-sm text-slate-500">Anúncios em destaque na comunidade brasileira</p>
            </div>
            <button
              onClick={() => navigate("/anuncios?destaque=true")}
              className="text-sm font-medium text-brand-green hover:text-brand-green-dark flex items-center gap-1 shrink-0"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {/* SEO content */}
      <section className="bg-slate-50 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
            A comunidade brasileira na Espanha, num só lugar
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            O Portal BR em Alicante reúne os melhores serviços e negócios geridos por brasileiros
            em Alicante, Benidorm, Torrevieja e Elche. Desde restaurantes com autêntica comida brasileira,
            barbearias, mercados, advogados, agências de viagens e muito mais. Tudo pensado para
            que você encontre rapidamente o que precisa, com o mínimo de cliques.
          </p>
        </div>
      </section>
    </div>
  );
}
