import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, CheckCircle2, XCircle, Star, Plus } from "lucide-react";
import { fetchAdminStats } from "@/lib/supabase";
import type { AdminStats } from "@/lib/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await fetchAdminStats();
        setStats(s);
      } catch {
        // ignore
      }
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Total de anúncios", value: stats?.total ?? 0, icon: ListChecks, color: "bg-brand-navy-50 text-brand-navy-600" },
    { label: "Anúncios ativos", value: stats?.active ?? 0, icon: CheckCircle2, color: "bg-brand-green-50 text-brand-green-600" },
    { label: "Anúncios inativos", value: stats?.inactive ?? 0, icon: XCircle, color: "bg-slate-100 text-slate-600" },
    { label: "Anúncios em destaque", value: stats?.featured ?? 0, icon: Star, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Dashboard</h1>
        <Link
          to="/admin/anuncios/novo"
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-green-600 hover:bg-brand-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo anúncio
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
              {loading ? "—" : value}
            </p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link
          to="/admin/anuncios"
          className="block bg-white rounded-2xl border border-slate-100 p-5 hover:border-brand-green-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 text-sm">Gerir anúncios</h2>
              <p className="text-xs text-slate-500 mt-0.5">Ver, editar, ativar ou excluir anúncios</p>
            </div>
            <ListChecks className="w-5 h-5 text-slate-400" />
          </div>
        </Link>
      </div>
    </div>
  );
}
