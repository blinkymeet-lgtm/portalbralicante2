import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    navigate(`/anuncios?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/LOGO_PORTAL_VESAO_atl.PNG" alt="Portal BR em Alicante" className="h-20 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-brand-green transition-colors">
              Início
            </Link>
            <Link to="/anuncios" className="text-sm font-medium text-slate-600 hover:text-brand-green transition-colors">
              Anúncios
            </Link>
            <Link to="/sobre" className="text-sm font-medium text-slate-600 hover:text-brand-green transition-colors">
              Sobre
            </Link>
            <Link to="/contato" className="text-sm font-medium text-slate-600 hover:text-brand-green transition-colors">
              Contato
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs ml-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="q"
                placeholder="O que você procura?"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors bg-slate-50/50"
              />
            </form>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 -mr-2 text-slate-700"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-1">
            <form onSubmit={handleSearch} className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="q"
                placeholder="O que você procura?"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-full border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none bg-slate-50/50"
              />
            </form>
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-slate-600 hover:text-brand-green rounded-lg hover:bg-slate-50 transition-colors">Início</Link>
            <Link to="/anuncios" onClick={() => setMenuOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-slate-600 hover:text-brand-green rounded-lg hover:bg-slate-50 transition-colors">Anúncios</Link>
            <Link to="/sobre" onClick={() => setMenuOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-slate-600 hover:text-brand-green rounded-lg hover:bg-slate-50 transition-colors">Sobre o Portal</Link>
            <Link to="/contato" onClick={() => setMenuOpen(false)} className="block py-2.5 px-2 text-sm font-medium text-slate-600 hover:text-brand-green rounded-lg hover:bg-slate-50 transition-colors">Contato</Link>
          </div>
        )}
      </div>
    </header>
  );
}
