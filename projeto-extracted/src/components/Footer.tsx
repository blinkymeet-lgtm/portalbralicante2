import { Link } from "react-router-dom";
import { CITIES } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="bg-brand-navy-950 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <img src="/LOGO_VESAO_BRANCA_atl.PNG" alt="Portal BR em Alicante" className="h-28 w-auto mb-4" />
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Conectando brasileiros aos melhores serviços e negócios na Espanha.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Cidades</h3>
            <ul className="space-y-2">
              {CITIES.map((c) => (
                <li key={c.name}>
                  <Link to={`/cidade/${c.name}`} className="text-sm text-slate-400 hover:text-brand-green transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Navegação</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-slate-400 hover:text-brand-green transition-colors">Início</Link></li>
              <li><Link to="/anuncios" className="text-sm text-slate-400 hover:text-brand-green transition-colors">Anúncios</Link></li>
              <li><Link to="/categorias" className="text-sm text-slate-400 hover:text-brand-green transition-colors">Categorias</Link></li>
              <li><Link to="/sobre" className="text-sm text-slate-400 hover:text-brand-green transition-colors">Sobre o Portal</Link></li>
              <li><Link to="/contato" className="text-sm text-slate-400 hover:text-brand-green transition-colors">Contato</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Portal BR em Alicante. Todos os direitos reservados.
          </p>
          <Link
            to="/admin"
            className="text-[10px] text-slate-700 hover:text-slate-500 transition-colors"
            aria-label="Admin"
          >
            &middot;
          </Link>
        </div>
      </div>
    </footer>
  );
}
