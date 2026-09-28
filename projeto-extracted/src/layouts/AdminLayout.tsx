import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/lib/admin-auth";
import { useEffect } from "react";
import { LayoutDashboard, List, LogOut, ArrowLeft } from "lucide-react";

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login", { replace: true });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-brand-navy-950 text-white sticky top-0 z-30 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/LOGO_VESAO_BRANCA_atl.PNG" alt="Portal BR em Alicante" className="h-20 w-auto" />
            <span className="text-slate-400 text-xs hidden sm:inline">Administração</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="p-2 text-slate-400 hover:text-white transition-colors" aria-label="Voltar ao site">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors" aria-label="Sair">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:block w-56 bg-white border-r border-slate-200 shrink-0">
          <nav className="p-4 space-y-1">
            <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-navy-50 hover:text-brand-navy-700 rounded-xl transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link to="/admin/anuncios" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-navy-50 hover:text-brand-navy-700 rounded-xl transition-colors">
              <List className="w-4 h-4" /> Anúncios
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200">
        <div className="grid grid-cols-3 h-14">
          <Link to="/admin" className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-brand-navy-700">
            <LayoutDashboard className="w-5 h-5" /><span className="text-[10px]">Dashboard</span>
          </Link>
          <Link to="/admin/anuncios" className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-brand-navy-700">
            <List className="w-5 h-5" /><span className="text-[10px]">Anúncios</span>
          </Link>
          <button onClick={handleLogout} className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-brand-red-500">
            <LogOut className="w-5 h-5" /><span className="text-[10px]">Sair</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
