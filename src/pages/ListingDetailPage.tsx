import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Phone, Globe, Instagram, Clock, Star, StarHalf,
  Navigation, MessageCircle, ChevronLeft, Share2, BriefcaseBusiness, Mail, Banknote, CalendarClock, FileCheck, Gift, Send, PartyPopper, CalendarDays, Ticket, User,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSEO } from "@/lib/seo";
import { CATEGORIES, CITIES, DAY_LABELS, DAYS_OF_WEEK, type Listing } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs";
import ListingCard from "@/components/ListingCard";

function RatingStars({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= Math.floor(rating)) return <Star key={i} className="w-4 h-4 fill-brand-yellow-400 text-brand-yellow-400" />;
        if (i - 0.5 <= rating) return <StarHalf key={i} className="w-4 h-4 fill-brand-yellow-400 text-brand-yellow-400" />;
        return <Star key={i} className="w-4 h-4 text-slate-300" />;
      })}
      <span className="text-sm text-slate-600 ml-1 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ListingDetailPage() {
  const { city, category, slug } = useParams<{ city: string; category: string; slug: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [related, setRelated] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useSEO({
    title: listing ? `${listing.name} — ${listing.city} | Portal BR em Alicante` : "Carregando...",
    description: listing?.short_description ?? undefined,
    image: listing?.main_image ?? undefined,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("slug", slug ?? "")
        .eq("is_active", true)
        .maybeSingle();
      if (data) {
        setListing(data);
        const { data: rel } = await supabase
          .from("listings")
          .select("*")
          .eq("is_active", true)
          .eq("city", data.city)
          .neq("id", data.id)
          .order("is_featured", { ascending: false })
          .limit(4);
        if (rel) setRelated(rel);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
          <div className="h-6 bg-slate-200 rounded w-1/2" />
          <div className="h-20 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400 text-lg mb-2">Anúncio não encontrado</p>
        <Link to="/anuncios" className="text-sm text-brand-green-600 font-medium">Ver todos os anúncios</Link>
      </div>
    );
  }

  const allImages = [listing.main_image, ...listing.gallery].filter(Boolean) as string[];
  const whatsappClean = listing.whatsapp?.replace(/[^0-9]/g, "");
  const whatsappUrl = whatsappClean ? `https://wa.me/${whatsappClean}` : null;
  const instagramUrl = listing.instagram
    ? (listing.instagram.startsWith("@")
      ? `https://instagram.com/${listing.instagram.slice(1)}`
      : listing.instagram)
    : null;

  const catInfo = CATEGORIES.find((c) => c.key === listing.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[
        { label: listing.city, to: `/cidade/${listing.city.toLowerCase()}` },
        { label: listing.category, to: `/categoria/${listing.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}` },
        { label: listing.name },
      ]} />

      <Link to={`/cidade/${listing.city.toLowerCase()}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-green-600 mt-4 mb-4 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: images + description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden bg-slate-100 relative aspect-[16/10]">
            <img
              src={allImages[activeImage] ?? ""}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
            {listing.is_featured && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wide bg-brand-yellow-400 text-amber-900 rounded-full shadow-md">
                Destaque
              </span>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-brand-green-500" : "border-transparent hover:border-slate-300"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{listing.name}</h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {catInfo && (
                    <span className="px-2.5 py-1 text-xs font-medium bg-brand-green-50 text-brand-green-700 rounded-full">
                      {catInfo.label}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="w-4 h-4" />{listing.city}
                  </span>
                  <RatingStars rating={listing.rating} />
                </div>
              </div>
              <button
                onClick={() => navigator.share?.({ title: listing.name, url: window.location.href }).catch(() => {})}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Compartilhar"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {listing.short_description && (
              <p className="text-base text-slate-700 font-medium mt-4">{listing.short_description}</p>
            )}
            {listing.full_description && (
              <p className="text-sm text-slate-600 mt-3 leading-relaxed whitespace-pre-line">{listing.full_description}</p>
            )}
          </div>

          {/* Job-specific details */}
          {listing.category === "Vagas de Emprego" && (listing.job_title || listing.job_type || listing.job_salary || listing.job_schedule || listing.job_requirements || listing.job_benefits) && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <BriefcaseBusiness className="w-5 h-5 text-brand-green-600" />
                Detalhes da vaga
              </h2>

              {listing.job_title && (
                <div className="flex items-start gap-3">
                  <BriefcaseBusiness className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cargo</p>
                    <p className="text-sm text-slate-900 font-medium">{listing.job_title}</p>
                  </div>
                </div>
              )}

              {listing.job_type && (
                <div className="flex items-start gap-3">
                  <FileCheck className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo de contrato</p>
                    <p className="text-sm text-slate-900 font-medium">{listing.job_type}</p>
                  </div>
                </div>
              )}

              {listing.job_salary && (
                <div className="flex items-start gap-3">
                  <Banknote className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Salário / Remuneração</p>
                    <p className="text-sm text-slate-900 font-medium">{listing.job_salary}</p>
                  </div>
                </div>
              )}

              {listing.job_schedule && (
                <div className="flex items-start gap-3">
                  <CalendarClock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Horário de trabalho</p>
                    <p className="text-sm text-slate-900 font-medium">{listing.job_schedule}</p>
                  </div>
                </div>
              )}

              {listing.job_requirements && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Requisitos</p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{listing.job_requirements}</p>
                </div>
              )}

              {listing.job_benefits && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" /> Benefícios
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{listing.job_benefits}</p>
                </div>
              )}
            </div>
          )}

          {/* Event-specific details */}
          {listing.category === "Eventos" && (listing.event_date || listing.event_time || listing.event_location || listing.event_price || listing.event_age || listing.event_organizer) && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <PartyPopper className="w-5 h-5 text-brand-green-600" />
                Detalhes do evento
              </h2>

              {listing.event_date && (
                <div className="flex items-start gap-3">
                  <CalendarDays className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Data</p>
                    <p className="text-sm text-slate-900 font-medium">
                      {new Date(listing.event_date + "T00:00:00").toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      {listing.event_end_date && (
                        <> — {new Date(listing.event_end_date + "T00:00:00").toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" })}</>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {listing.event_time && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Hora</p>
                    <p className="text-sm text-slate-900 font-medium">{listing.event_time}</p>
                  </div>
                </div>
              )}

              {listing.event_location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Local</p>
                    <p className="text-sm text-slate-900 font-medium">{listing.event_location}</p>
                  </div>
                </div>
              )}

              {listing.event_price && (
                <div className="flex items-start gap-3">
                  <Banknote className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Preço / Entrada</p>
                    <p className="text-sm text-slate-900 font-medium">{listing.event_price}</p>
                  </div>
                </div>
              )}

              {listing.event_age && (
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Idade mínima</p>
                    <p className="text-sm text-slate-900 font-medium">{listing.event_age}</p>
                  </div>
                </div>
              )}

              {listing.event_organizer && (
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Organizador</p>
                    <p className="text-sm text-slate-900 font-medium">{listing.event_organizer}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hours */}
          {listing.category !== "Eventos" && listing.hours && Object.keys(listing.hours).length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-green-600" />
                Horário de funcionamento
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const val = listing.hours[day];
                  return (
                    <div key={day} className="flex items-center justify-between text-sm py-1 border-b border-slate-50 last:border-0">
                      <span className="text-slate-600">{DAY_LABELS[day]}</span>
                      <span className={val === "Fechado" ? "text-brand-red-500 font-medium" : "text-slate-900 font-medium"}>
                        {val || "Fechado"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: contact + location */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
            <h2 className="font-semibold text-slate-900 mb-1">Contato e localização</h2>

            {listing.address && (
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>{listing.address}</span>
              </div>
            )}
            {listing.phone && (
              <a href={`tel:${listing.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand-green-600 transition-colors">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{listing.phone}</span>
              </a>
            )}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand-green-600 transition-colors">
                <Instagram className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{listing.instagram}</span>
              </a>
            )}
            {listing.website && (
              <a href={listing.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand-green-600 transition-colors">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{listing.website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
            {listing.category === "Vagas de Emprego" && listing.job_contact_email && (
              <a href={`mailto:${listing.job_contact_email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand-green-600 transition-colors">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{listing.job_contact_email}</span>
              </a>
            )}

            <div className="pt-2 space-y-2">
              {listing.category === "Vagas de Emprego" && listing.job_contact_email ? (
                <a
                  href={`mailto:${listing.job_contact_email}?subject=${encodeURIComponent(`Candidatura: ${listing.job_title ?? listing.name}`)}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-green-500 hover:bg-brand-green-600 text-white font-semibold text-sm rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                  Enviar candidatura
                </a>
              ) : null}
              {listing.category === "Eventos" && listing.event_tickets_link ? (
                <a
                  href={listing.event_tickets_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-green-500 hover:bg-brand-green-600 text-white font-semibold text-sm rounded-xl transition-colors"
                >
                  <Ticket className="w-5 h-5" />
                  Comprar bilhetes
                </a>
              ) : null}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-green-500 hover:bg-brand-green-600 text-white font-semibold text-sm rounded-xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp
                </a>
              )}
              {listing.google_maps_link && (
                <a
                  href={listing.google_maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-navy-600 hover:bg-brand-navy-700 text-white font-semibold text-sm rounded-xl transition-colors"
                >
                  <Navigation className="w-5 h-5" />
                  Abrir no Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Outros anúncios em {listing.city}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
