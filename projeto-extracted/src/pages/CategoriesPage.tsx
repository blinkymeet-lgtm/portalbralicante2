import { useSEO } from "@/lib/seo";
import { CATEGORIES } from "@/lib/types";
import CategoryGrid from "@/components/CategoryGrid";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CategoriesPage() {
  useSEO({
    title: "Categorias — Portal BR Espanha",
    description: "Navegue por categorias: restaurantes, barbearias, mercados, advogados, imobiliárias e mais.",
  });

  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("listings")
        .select("category")
        .eq("is_active", true);
      if (data) {
        const cc: Record<string, number> = {};
        data.forEach((r) => { cc[r.category] = (cc[r.category] ?? 0) + 1; });
        setCounts(cc);
      }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ label: "Categorias" }]} />
      <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-1">Categorias</h1>
      <p className="text-sm text-slate-500 mb-6">Navegue pelos tipos de serviços e negócios</p>
      <CategoryGrid categories={CATEGORIES} counts={counts} />
    </div>
  );
}
