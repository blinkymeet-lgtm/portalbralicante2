import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { CityInfo } from "@/lib/types";

export default function CityCard({ city, count }: { city: CityInfo; count?: number }) {
  const slug = city.name.toLowerCase();
  return (
    <Link
      to={`/cidade/${slug}`}
      className="group relative block rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="aspect-[3/2] overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-brand-navy-950/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-white font-bold text-xl mb-1 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-brand-green-400" />
          {city.name}
        </h3>
        <p className="text-white/80 text-sm mb-3 line-clamp-1">{city.description}</p>
        <div className="flex items-center justify-between">
          {count !== undefined && (
            <span className="text-white/60 text-xs">{count} anúncios ativos</span>
          )}
          <span className="text-xs font-semibold text-brand-green-400 group-hover:text-brand-green-300 transition-colors">
            Ver anúncios &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
