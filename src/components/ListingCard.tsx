import { Link } from "react-router-dom";
import { MapPin, Star, StarHalf } from "lucide-react";
import type { Listing } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

function getCategoryIcon(catKey: string) {
  const cat = CATEGORIES.find((c) => c.key === catKey);
  return cat?.icon ?? "Briefcase";
}

function RatingStars({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= Math.floor(rating)) return <Star key={i} className="w-3.5 h-3.5 fill-brand-yellow-400 text-brand-yellow-400" />;
        if (i - 0.5 <= rating) return <StarHalf key={i} className="w-3.5 h-3.5 fill-brand-yellow-400 text-brand-yellow-400" />;
        return <Star key={i} className="w-3.5 h-3.5 text-slate-200" />;
      })}
      <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const categorySlug = listing.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const citySlug = listing.city.toLowerCase();
  const detailUrl = `/${citySlug}/${categorySlug}/${listing.slug}`;

  return (
    <Link
      to={detailUrl}
      className="group block bg-white rounded-2xl overflow-hidden shadow-soft border border-slate-100 hover:shadow-card-hover hover:border-brand-green-200 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
        {listing.main_image ? (
          <img
            src={listing.main_image}
            alt={listing.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200">
            <span className="text-4xl">{getCategoryIcon(listing.category)}</span>
          </div>
        )}
        {listing.is_featured && (
          <span className="absolute top-3 left-3 badge-featured">
            Destaque
          </span>
        )}
        <span className="absolute top-3 right-3 badge-category">
          {listing.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-base mb-1 line-clamp-1 group-hover:text-brand-green transition-colors">
          {listing.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{listing.city}</span>
        </div>
        {listing.short_description && (
          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
            {listing.short_description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <RatingStars rating={listing.rating} />
          <span className="text-xs font-medium text-brand-green group-hover:text-brand-green-dark">
            Ver detalhes &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
