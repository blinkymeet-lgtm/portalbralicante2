import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Pencil, Trash2, Eye, Star, StarOff, Power, PowerOff, Search,
} from "lucide-react";
import { fetchAllListings, deleteListing, toggleListingField } from "@/lib/supabase";
import type { Listing } from "@/lib/types";

export default function AdminListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllListings();
      setListings(data);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    await deleteListing(id);
    setConfirmDelete(null);
    load();
  };

  const handleToggle = async (id: string, field: "is_active" | "is_featured") => {
    await toggleListingField(id, field);
    load();
  };

  const filtered = listings.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.category.toLowerCase().includes(search.toLowerCase()) ||
    l.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Anúncios</h1>
        <Link
          to="/admin/anuncios/novo"
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-green-600 hover:bg-brand-green-700 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Novo anúncio
        </Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar anúncios..."
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-sm mb-3">Nenhum anúncio encontrado</p>
          <Link to="/admin/anuncios/novo" className="text-sm text-brand-green-600 font-medium">
            Criar primeiro anúncio &rarr;
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-semibold">Anúncio</th>
                  <th className="text-left px-4 py-3 font-semibold">Categoria</th>
                  <th className="text-left px-4 py-3 font-semibold">Cidade</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 font-semibold">Destaque</th>
                  <th className="text-left px-4 py-3 font-semibold">Data</th>
                  <th className="text-right px-4 py-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {l.main_image && <img src={l.main_image} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <span className="font-medium text-slate-900 line-clamp-1">{l.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{l.category}</td>
                    <td className="px-4 py-3 text-slate-600">{l.city}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${l.is_active ? "bg-brand-green-50 text-brand-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {l.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${l.is_featured ? "bg-amber-50 text-amber-700" : "text-slate-400"}`}>
                        {l.is_featured ? "Destaque" : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(l.created_at).toLocaleDateString("pt-PT")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/${l.city.toLowerCase()}/${l.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}/${l.slug}`} target="_blank" className="p-1.5 text-slate-400 hover:text-brand-navy-600 transition-colors" title="Visualizar">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link to={`/admin/anuncios/${l.id}`} className="p-1.5 text-slate-400 hover:text-brand-green-600 transition-colors" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleToggle(l.id, "is_active")} className="p-1.5 text-slate-400 hover:text-brand-green-600 transition-colors" title={l.is_active ? "Desativar" : "Ativar"}>
                          {l.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleToggle(l.id, "is_featured")} className="p-1.5 text-slate-400 hover:text-amber-600 transition-colors" title={l.is_featured ? "Remover destaque" : "Destacar"}>
                          {l.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setConfirmDelete(l.id)} className="p-1.5 text-slate-400 hover:text-brand-red-600 transition-colors" title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((l) => (
              <div key={l.id} className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    {l.main_image && <img src={l.main_image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">{l.name}</h3>
                    <p className="text-xs text-slate-500">{l.category} · {l.city}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${l.is_active ? "bg-brand-green-50 text-brand-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {l.is_active ? "Ativo" : "Inativo"}
                      </span>
                      {l.is_featured && (
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-700">Destaque</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to={`/admin/anuncios/${l.id}`} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                    <Pencil className="w-3.5 h-3.5" /> Editar
                  </Link>
                  <Link to={`/${l.city.toLowerCase()}/${l.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}/${l.slug}`} target="_blank" className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Ver
                  </Link>
                  <button onClick={() => handleToggle(l.id, "is_active")} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                    {l.is_active ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                    {l.is_active ? "Desativar" : "Ativar"}
                  </button>
                  <button onClick={() => handleToggle(l.id, "is_featured")} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                    {l.is_featured ? <StarOff className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                    Destaque
                  </button>
                  <button onClick={() => setConfirmDelete(l.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors ml-auto">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-900 mb-2">Excluir anúncio?</h3>
            <p className="text-sm text-slate-500 mb-5">Esta ação não pode ser desfeita. O anúncio será permanentemente removido.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                Cancelar
              </button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 text-sm font-medium bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl transition-colors">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
