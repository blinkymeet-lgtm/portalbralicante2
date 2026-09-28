import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSEO } from "@/lib/seo";
import { CATEGORIES, CITIES, type Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import Breadcrumbs from "@/components/Breadcrumbs";

type SortMode = "featured" | "recent";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get("q") ?? "";
  const city = searchParams.get("cidade") ?? "";
  const category = searchParams.get("categoria") ?? "";
  const sort = (searchParams.get("ord") as SortMode) ?? "featured";
  const featuredOnly = searchParams.get("destaque") === "true";

  useSEO({
    title: query
      ? `"${query}" — Anúncios no Portal BR em Alicante`
      : "Anúncios — Portal BR em Alicante",
    description: "Pesquise restaurantes, serviços, lojas e negócios brasileiros em Alicante, Benidorm, Torrevieja e Elche.",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      let db = supabase.from("listings").select("*").eq("is_active", true);
      if (featuredOnly) db = db.eq("is_featured", true);
      const { data, error } = await db.order("created_at", { ascending: false });
      if (!error && data) setListings(data);
      setLoading(false);
    })();
  }, [featuredOnly]);

  const filtered = useMemo(() => {
    let result = [...listings];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.short_description?.toLowerCase().includes(q) ||
          l.full_description?.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q)
      );
    }
    if (city) result = result.filter((l) => l.city === city);
    if (category) result = result.filter((l) => l.category === category);

    if (sort === "featured") {
      result.sort((a, b) => {
        if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [listings, query, city, category, sort]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ label: "Anúncios" }]} />

      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Anúncios</h1>
        <p className="text-sm text-slate-500">
          {loading ? "Carregando..." : `${filtered.length} ${filtered.length === 1 ? "anúncio encontrado" : "anúncios encontrados"}`}
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              defaultValue={query}
              onChange={(e) => updateParam("q", e.target.value)}
              placeholder="O que você procura?"
              className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cidade</label>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => updateParam("cidade", "")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    !city ? "bg-brand-green-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Todas
                </button>
                {CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => updateParam("cidade", c.name)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      city === c.name ? "bg-brand-green-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Categoria</label>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => updateParam("categoria", "")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    !category ? "bg-brand-green-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Todas
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => updateParam("categoria", c.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      category === c.key ? "bg-brand-green-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ordenação</label>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => updateParam("ord", "featured")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    sort === "featured" ? "bg-brand-green-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Destaques primeiro
                </button>
                <button
                  onClick={() => updateParam("ord", "recent")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    sort === "recent" ? "bg-brand-green-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Mais recentes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {(query || city || category || featuredOnly) && (
          <div className="flex flex-wrap items-center gap-2">
            {query && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-brand-green-50 text-brand-green-700 rounded-full">
                "{query}"
                <button onClick={() => updateParam("q", "")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-brand-green-50 text-brand-green-700 rounded-full">
                <MapPin className="w-3 h-3" />{city}
                <button onClick={() => updateParam("cidade", "")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-brand-green-50 text-brand-green-700 rounded-full">
                {category}
                <button onClick={() => updateParam("categoria", "")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {featuredOnly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">
                Destaques
                <button onClick={() => updateParam("destaque", "")}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
              <div className="aspect-[4/3] bg-slate-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg mb-2">Nenhum anúncio encontrado</p>
          <p className="text-sm text-slate-500">Tente alterar os filtros ou pesquisar por outro termo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
