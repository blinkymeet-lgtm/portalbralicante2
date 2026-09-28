import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import * as Icons from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSEO } from "@/lib/seo";
import { CATEGORIES, type Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const catKey = CATEGORIES.find(
    (c) => c.key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === category?.toLowerCase()
  )?.key ?? "";
  const catInfo = CATEGORIES.find((c) => c.key === catKey);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: `${catInfo?.label ?? "Categoria"} — Portal BR em Alicante`,
    description: catInfo?.description ?? `Encontre ${catInfo?.label ?? "anúncios"} para brasileiros em Alicante, Benidorm, Torrevieja e Elche.`,
  });

  useEffect(() => {
    (async () => {
      if (!catKey) return;
      setLoading(true);
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("is_active", true)
        .eq("category", catKey)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (data) setListings(data);
      setLoading(false);
    })();
  }, [catKey]);

  if (!catInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400 text-lg">Categoria não encontrada</p>
        <Link to="/" className="text-sm text-brand-green-600 mt-2 inline-block">Voltar ao início</Link>
      </div>
    );
  }

  const iconMap = Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const Icon = iconMap[catInfo.icon] ?? Icons.Briefcase;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ label: catInfo.label }]} />

      <div className="flex items-center gap-3 mt-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-green-50 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-brand-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{catInfo.label}</h1>
          <p className="text-sm text-slate-500">
            {loading ? "Carregando..." : `${listings.length} ${listings.length === 1 ? "anúncio" : "anúncios"}`}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-3xl">{catInfo.description}</p>

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
          <p className="text-slate-400 text-lg mb-2">Nenhum anúncio nesta categoria ainda</p>
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
    </div>
  );
}
