import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "@/lib/admin-auth";
import { Lock, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await login(password);
    if (ok) {
      navigate("/admin", { replace: true });
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-navy-950 flex items-center justify-center px-4">
      {/* Thin accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-brand-green-500" />
        <div className="w-12 bg-brand-yellow-400" />
        <div className="w-12 bg-brand-red-500" />
      </div>

      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <img src="/LOGO_VESAO_BRANCA_atl.PNG" alt="Portal BR em Alicante" className="h-28 w-auto" />
        </Link>

        <div className="bg-white rounded-2xl shadow-card-hover p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-navy-50 flex items-center justify-center">
              <Lock className="w-5 h-5 text-brand-navy-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Administração</h1>
              <p className="text-xs text-slate-500">Introduza a senha para continuar</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="mt-1 input-base"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-xs text-brand-red-500 font-medium">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-brand-navy-700 hover:bg-brand-navy-800 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              {loading ? "A verificar..." : "Entrar"}
            </button>
          </form>
        </div>

        <Link to="/" className="flex items-center justify-center gap-1 mt-6 text-sm text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao site
        </Link>
      </div>
    </div>
  );
}
