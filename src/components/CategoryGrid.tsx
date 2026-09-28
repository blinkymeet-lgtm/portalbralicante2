import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import type { Category } from "@/lib/types";

type IconMap = Record<string, React.ComponentType<{ className?: string }>>;

export default function CategoryGrid({ categories, counts }: { categories: Category[]; counts?: Record<string, number> }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
      {categories.map(({ key, label, icon }) => {
        const iconMap = Icons as unknown as IconMap;
        const Icon = iconMap[icon] ?? Icons.Briefcase;
        const slug = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return (
          <Link
            key={key}
            to={`/categoria/${slug}`}
            className="group flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-2xl border border-slate-100 hover:border-brand-green-200 hover:shadow-card transition-all duration-300"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-navy-50 group-hover:bg-brand-green-50 flex items-center justify-center transition-colors duration-300">
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-brand-navy-600 group-hover:text-brand-green transition-colors duration-300" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-700 text-center leading-tight">
              {label}
            </span>
            {counts && counts[key] !== undefined && (
              <span className="text-[10px] text-slate-400">
                {counts[key]} {counts[key] === 1 ? "anúncio" : "anúncios"}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
