import { Link } from "react-router-dom";
import type { Listing, CATEGORIES, CITIES } from "@/lib/types";

interface BreadcrumbsProps {
  items: { label: string; to?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
      <Link to="/" className="hover:text-brand-green-600 transition-colors">Início</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-slate-300">/</span>
          {item.to ? (
            <Link to={item.to} className="hover:text-brand-green-600 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-slate-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function getListingUrl(listing: Listing): string {
  const categorySlug = listing.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const citySlug = listing.city.toLowerCase();
  return `/${citySlug}/${categorySlug}/${listing.slug}`;
}
