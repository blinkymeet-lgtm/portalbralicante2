import { Link } from "react-router-dom";
import { Home, Search, MapPin, LayoutGrid } from "lucide-react";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/anuncios", label: "Pesquisar", icon: Search },
  { to: "/cidades", label: "Cidades", icon: MapPin },
  { to: "/categorias", label: "Categorias", icon: LayoutGrid },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-card">
      <div className="grid grid-cols-4 h-16">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-brand-green transition-colors"
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
