import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X } from "lucide-react";

interface Suggestion {
  type: "category" | "city" | "term";
  label: string;
  value: string;
  icon: string;
}

const CATEGORY_SUGGESTIONS: Suggestion[] = [
  { type: "category", label: "Culinária", value: "Culinária", icon: "UtensilsCrossed" },
  { type: "category", label: "Barbearias", value: "Barbearias", icon: "Scissors" },
  { type: "category", label: "Mercados", value: "Mercados", icon: "ShoppingCart" },
  { type: "category", label: "Imóveis", value: "Imóveis", icon: "Home" },
  { type: "category", label: "Assessoria de Documentação", value: "Assessoria de Documentação", icon: "Scale" },
  { type: "category", label: "Viagens", value: "Viagens", icon: "Plane" },
  { type: "category", label: "Eventos", value: "Eventos", icon: "PartyPopper" },
  { type: "category", label: "Lojas", value: "Lojas", icon: "ShoppingBag" },
  { type: "category", label: "Cuidados pessoais e estética", value: "Cuidados pessoais e estética", icon: "Sparkles" },
  { type: "category", label: "Serviços", value: "Serviços", icon: "Wrench" },
  { type: "category", label: "Esporte e Fitness", value: "Esporte e Fitness", icon: "Dumbbell" },
];

const CITY_SUGGESTIONS: Suggestion[] = [
  { type: "city", label: "Alicante", value: "Alicante", icon: "MapPin" },
  { type: "city", label: "Benidorm", value: "Benidorm", icon: "MapPin" },
  { type: "city", label: "Torrevieja", value: "Torrevieja", icon: "MapPin" },
  { type: "city", label: "Elche", value: "Elche", icon: "MapPin" },
];

const POPULAR_TERMS: Suggestion[] = [
  { type: "term", label: "Restaurante brasileiro", value: "Restaurante brasileiro", icon: "TrendingUp" },
  { type: "term", label: "Barbearia", value: "Barbearia", icon: "TrendingUp" },
  { type: "term", label: "Assessoria", value: "Assessoria", icon: "TrendingUp" },
  { type: "term", label: "Mercado brasileiro", value: "Mercado brasileiro", icon: "TrendingUp" },
  { type: "term", label: "Imóveis", value: "Imóveis", icon: "TrendingUp" },
];

const ALL_SUGGESTIONS = [...CATEGORY_SUGGESTIONS, ...CITY_SUGGESTIONS, ...POPULAR_TERMS];

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export default function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "O que você procura?",
}: SearchAutocompleteProps) {
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!value.trim()) return POPULAR_TERMS;
    const q = value.toLowerCase();
    return ALL_SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(q));
  }, [value]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!focused || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? filtered.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      onSelect(filtered[activeIndex].value);
      setFocused(false);
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  };

  const handleSelect = (s: Suggestion) => {
    onSelect(s.value);
    setFocused(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-3 text-sm rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 outline-none transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            setActiveIndex(-1);
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Limpar"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {focused && filtered.length > 0 && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 max-h-72 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-1 duration-100"
        >
          {!value.trim() && (
            <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Sugestões populares
            </div>
          )}
          {filtered.map((s, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={`${s.type}-${s.label}`}
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => handleSelect(s)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-brand-green-50 text-brand-green-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    s.type === "category"
                      ? "bg-brand-green-500"
                      : s.type === "city"
                      ? "bg-brand-navy-500"
                      : "bg-brand-yellow-400"
                  }`}
                />
                <span className="flex-1">{s.label}</span>
                <span className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">
                  {s.type === "category" ? "Categoria" : s.type === "city" ? "Cidade" : "Termo"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
