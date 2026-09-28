import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, Plus, BriefcaseBusiness, PartyPopper } from "lucide-react";
import { CATEGORIES, CITIES, DAYS_OF_WEEK, DAY_LABELS, type Listing } from "@/lib/types";
import { createListing, updateListing, fetchAllListings, uploadImage } from "@/lib/supabase";

interface FormData {
  name: string;
  category: string;
  city: string;
  short_description: string;
  full_description: string;
  main_image: string;
  gallery: string[];
  phone: string;
  whatsapp: string;
  instagram: string;
  website: string;
  address: string;
  google_maps_link: string;
  hours: Record<string, string>;
  is_active: boolean;
  is_featured: boolean;
  rating: string;
  job_title: string;
  job_type: string;
  job_salary: string;
  job_schedule: string;
  job_requirements: string;
  job_benefits: string;
  job_contact_email: string;
  event_date: string;
  event_time: string;
  event_end_date: string;
  event_location: string;
  event_price: string;
  event_age: string;
  event_organizer: string;
  event_tickets_link: string;
}

const emptyForm: FormData = {
  name: "", category: "Restaurantes", city: "Alicante",
  short_description: "", full_description: "",
  main_image: "", gallery: [],
  phone: "", whatsapp: "", instagram: "", website: "",
  address: "", google_maps_link: "",
  hours: {},
  is_active: true, is_featured: false, rating: "",
  job_title: "", job_type: "", job_salary: "", job_schedule: "",
  job_requirements: "", job_benefits: "", job_contact_email: "",
  event_date: "", event_time: "", event_end_date: "", event_location: "",
  event_price: "", event_age: "", event_organizer: "", event_tickets_link: "",
};

export default function AdminListingForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const all = await fetchAllListings();
        const item = (all as Listing[]).find((l) => l.id === id);
        if (item) {
          setForm({
            name: item.name, category: item.category, city: item.city,
            short_description: item.short_description ?? "", full_description: item.full_description ?? "",
            main_image: item.main_image ?? "", gallery: item.gallery ?? [],
            phone: item.phone ?? "", whatsapp: item.whatsapp ?? "", instagram: item.instagram ?? "", website: item.website ?? "",
            address: item.address ?? "", google_maps_link: item.google_maps_link ?? "",
            hours: item.hours ?? {},
            is_active: item.is_active, is_featured: item.is_featured,
            rating: item.rating?.toString() ?? "",
            job_title: item.job_title ?? "", job_type: item.job_type ?? "",
            job_salary: item.job_salary ?? "", job_schedule: item.job_schedule ?? "",
            job_requirements: item.job_requirements ?? "", job_benefits: item.job_benefits ?? "",
            job_contact_email: item.job_contact_email ?? "",
            event_date: item.event_date ?? "", event_time: item.event_time ?? "",
            event_end_date: item.event_end_date ?? "", event_location: item.event_location ?? "",
            event_price: item.event_price ?? "", event_age: item.event_age ?? "",
            event_organizer: item.event_organizer ?? "", event_tickets_link: item.event_tickets_link ?? "",
          });
        }
      } catch {
        // ignore
      }
      setLoading(false);
    })();
  }, [id, isEdit]);

  const update = (field: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleMainImageUpload = async (file: File) => {
    setUploadingMain(true);
    try {
      const url = await uploadImage(file);
      update("main_image", url);
    } catch (e) {
      setError("Erro ao carregar imagem: " + (e as Error).message);
    }
    setUploadingMain(false);
  };

  const handleGalleryUpload = async (files: FileList) => {
    setUploadingGallery(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadImage(file));
      }
      update("gallery", [...form.gallery, ...urls]);
    } catch (e) {
      setError("Erro ao carregar imagens: " + (e as Error).message);
    }
    setUploadingGallery(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        rating: form.rating ? parseFloat(form.rating) : null,
        gallery: form.gallery,
        hours: form.hours,
      };
      if (isEdit && id) {
        await updateListing(id, payload);
      } else {
        await createListing(payload);
      }
      navigate("/admin/anuncios");
    } catch (err) {
      setError((err as Error).message);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="animate-pulse space-y-3">
      <div className="h-8 bg-slate-200 rounded w-1/3" />
      <div className="h-64 bg-slate-100 rounded-2xl" />
    </div>;
  }

  return (
    <div>
      <Link to="/admin/anuncios" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-green-600 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar aos anúncios
      </Link>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
        {isEdit ? "Editar anúncio" : "Novo anúncio"}
      </h1>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-brand-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <section className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
          <h2 className="font-semibold text-slate-900 text-sm mb-4">Informações básicas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nome do negócio *</label>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Categoria *</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-white">
                {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cidade *</label>
              <select value={form.city} onChange={(e) => update("city", e.target.value)} className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-white">
                {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Avaliação (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => update("rating", e.target.value)} className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Descrição curta</label>
              <input value={form.short_description} onChange={(e) => update("short_description", e.target.value)} maxLength={150} className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" placeholder="Resumo que aparece no card" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Descrição completa</label>
              <textarea value={form.full_description} onChange={(e) => update("full_description", e.target.value)} rows={4} className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all resize-none" />
            </div>
          </div>
        </section>

        {/* Job-specific fields */}
        {form.category === "Vagas de Emprego" && (
          <section className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
            <h2 className="font-semibold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <BriefcaseBusiness className="w-4 h-4 text-brand-green-600" />
              Detalhes da vaga
            </h2>
            <p className="text-xs text-slate-400 mb-4">Preencha as informações específicas da vaga de emprego.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cargo / Título da vaga *</label>
                <input
                  value={form.job_title}
                  onChange={(e) => update("job_title", e.target.value)}
                  placeholder="Ex: Empregado de mesa"
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo de contrato</label>
                <select
                  value={form.job_type}
                  onChange={(e) => update("job_type", e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all bg-white"
                >
                  <option value="">Selecione...</option>
                  <option value="Tempo integral">Tempo integral</option>
                  <option value="Meio período">Meio período</option>
                  <option value="Temporário">Temporário</option>
                  <option value="Estágio">Estágio</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Por obra">Por obra</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Salário / Remuneração</label>
                <input
                  value={form.job_salary}
                  onChange={(e) => update("job_salary", e.target.value)}
                  placeholder="Ex: 1.200€/mês"
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Horário de trabalho</label>
                <input
                  value={form.job_schedule}
                  onChange={(e) => update("job_schedule", e.target.value)}
                  placeholder="Ex: Seg a Sex, 09h-17h"
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Requisitos da vaga</label>
                <textarea
                  value={form.job_requirements}
                  onChange={(e) => update("job_requirements", e.target.value)}
                  rows={4}
                  placeholder="Ex: Experiência anterior, idiomas, disponibilidade de veículo próprio..."
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all resize-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Benefícios oferecidos</label>
                <textarea
                  value={form.job_benefits}
                  onChange={(e) => update("job_benefits", e.target.value)}
                  rows={3}
                  placeholder="Ex: Refeições, transporte, formação, contrato estável..."
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all resize-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email para candidaturas</label>
                <input
                  type="email"
                  value={form.job_contact_email}
                  onChange={(e) => update("job_contact_email", e.target.value)}
                  placeholder="rh@empresa.com"
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
            </div>
          </section>
        )}

        {/* Event-specific fields */}
        {form.category === "Eventos" && (
          <section className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
            <h2 className="font-semibold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <PartyPopper className="w-4 h-4 text-brand-green-600" />
              Detalhes do evento
            </h2>
            <p className="text-xs text-slate-400 mb-4">Preencha as informações específicas do evento.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Data do evento *</label>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={(e) => update("event_date", e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Hora do evento</label>
                <input
                  type="time"
                  value={form.event_time}
                  onChange={(e) => update("event_time", e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Data de fim (opcional)</label>
                <input
                  type="date"
                  value={form.event_end_date}
                  onChange={(e) => update("event_end_date", e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Local do evento</label>
                <input
                  value={form.event_location}
                  onChange={(e) => update("event_location", e.target.value)}
                  placeholder="Ex: Sala de Festas Alicante"
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Preço / Entrada</label>
                <input
                  value={form.event_price}
                  onChange={(e) => update("event_price", e.target.value)}
                  placeholder="Ex: 10€ / Grátis"
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Idade mínima</label>
                <input
                  value={form.event_age}
                  onChange={(e) => update("event_age", e.target.value)}
                  placeholder="Ex: +18 / Livre"
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Organizador</label>
                <input
                  value={form.event_organizer}
                  onChange={(e) => update("event_organizer", e.target.value)}
                  placeholder="Ex: Associação Cultural BR"
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Link para bilhetes</label>
                <input
                  value={form.event_tickets_link}
                  onChange={(e) => update("event_tickets_link", e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
            </div>
          </section>
        )}

        {/* Contacts */}
        <section className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
          <h2 className="font-semibold text-slate-900 text-sm mb-4">Contatos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Telefone</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">WhatsApp</label>
              <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="+34600000000" className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Instagram</label>
              <input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="@nome" className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Website</label>
              <input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://..." className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
          <h2 className="font-semibold text-slate-900 text-sm mb-4">Localização</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Endereço</label>
              <input value={form.address} onChange={(e) => update("address", e.target.value)} className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Link do Google Maps</label>
              <input value={form.google_maps_link} onChange={(e) => update("google_maps_link", e.target.value)} className="mt-1 w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
            </div>
          </div>
        </section>

        {/* Hours — not shown for events */}
        {form.category !== "Eventos" && (
        <section className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
          <h2 className="font-semibold text-slate-900 text-sm mb-4">Horários de funcionamento</h2>
          <div className="space-y-2">
            {DAYS_OF_WEEK.map((day) => {
              const val = form.hours[day] ?? "";
              const isClosed = val === "Fechado";
              return (
                <div key={day} className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <span className="text-sm font-medium text-slate-700 w-32 shrink-0">{DAY_LABELS[day]}</span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isClosed}
                      onChange={(e) => {
                        const h = { ...form.hours };
                        if (e.target.checked) h[day] = "Fechado";
                        else delete h[day];
                        update("hours", h);
                      }}
                    />
                    Fechado
                  </label>
                  {!isClosed && (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={val.split("-")[0] ?? ""}
                        onChange={(e) => {
                          const open = e.target.value;
                          const close = val.split("-")[1] ?? "";
                          update("hours", { ...form.hours, [day]: close ? `${open}-${close}` : open });
                        }}
                        className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-brand-green"
                      />
                      <span className="text-slate-400 text-xs">às</span>
                      <input
                        type="time"
                        value={val.split("-")[1] ?? ""}
                        onChange={(e) => {
                          const open = val.split("-")[0] ?? "";
                          update("hours", { ...form.hours, [day]: `${open}-${e.target.value}` });
                        }}
                        className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-brand-green"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
        )}

        {/* Images */}
        <section className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
          <h2 className="font-semibold text-slate-900 text-sm mb-4">Imagens</h2>

          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Imagem principal</label>
            <div className="mt-2 flex items-center gap-3">
              {form.main_image ? (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                  <img src={form.main_image} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => update("main_image", "")} className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-green-400 flex items-center justify-center cursor-pointer transition-colors">
                  {uploadingMain ? <span className="text-xs text-slate-400">...</span> : <Upload className="w-5 h-5 text-slate-400" />}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleMainImageUpload(e.target.files[0])} />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Galeria de fotos</label>
            <div className="mt-2 flex flex-wrap gap-3">
              {form.gallery.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => update("gallery", form.gallery.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-green-400 flex items-center justify-center cursor-pointer transition-colors">
                {uploadingGallery ? <span className="text-xs text-slate-400">...</span> : <Plus className="w-5 h-5 text-slate-400" />}
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)} />
              </label>
            </div>
          </div>
        </section>

        {/* Settings */}
        <section className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
          <h2 className="font-semibold text-slate-900 text-sm mb-4">Configurações</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => update("is_active", e.target.checked)} className="w-5 h-5 rounded accent-brand-green-600" />
              <div>
                <span className="text-sm font-medium text-slate-900">Anúncio ativo</span>
                <p className="text-xs text-slate-500">Quando ativo, aparece no site público</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => update("is_featured", e.target.checked)} className="w-5 h-5 rounded accent-brand-yellow-500" />
              <div>
                <span className="text-sm font-medium text-slate-900">Anúncio em destaque</span>
                <p className="text-xs text-slate-500">Aparece primeiro na homepage e nas listagens</p>
              </div>
            </label>
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-3 sticky bottom-4">
          <Link to="/admin/anuncios" className="px-5 py-3 text-sm font-medium bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-brand-green-600 hover:bg-brand-green-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Publicar anúncio"}
          </button>
        </div>
      </form>
    </div>
  );
}
