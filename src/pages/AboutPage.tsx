import { useSEO } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Users, MapPin, Heart, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  useSEO({
    title: "Sobre o Portal BR em Alicante",
    description: "O Portal BR em Alicante conecta brasileiros aos melhores serviços e negócios em Alicante, Benidorm, Torrevieja e Elche.",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ label: "Sobre o Portal" }]} />
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-4 mb-4">Sobre o Portal BR em Alicante</h1>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        O Portal BR em Alicante nasceu da necessidade de reunir, num só lugar, todos os serviços
        e negócios geridos por brasileiros na Espanha. Sabemos como pode ser difícil chegar
        num país novo e procurar um restaurante que sirva feijoada, uma barbearia que entenda
        o corte que você gosta, ou um advogado que fale a sua língua.
      </p>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        A nossa missão é simples: conectar a comunidade brasileira aos melhores serviços
        e negócios em Alicante, Benidorm, Torrevieja e Elche, com a maior facilidade possível.
        Acreditamos que a informação deve ser acessível, rápida e clara.
      </p>
      <p className="text-sm text-slate-600 leading-relaxed mb-8">
        Atualmente cobrimos três cidades da Costa Blanca, mas a nossa estrutura está
        preparada para crescer para outras cidades de Espanha. Se você tem um negócio
        ou oferece serviços para brasileiros, entre em contato conosco na aba{" "}
        <Link to="/contato" className="font-semibold text-brand-green-600 hover:text-brand-green-700 underline">CONTATO</Link>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Users, title: "Comunidade", desc: "Feito por brasileiros, para brasileiros." },
          { icon: MapPin, title: "Local", desc: "Foco em Alicante, Benidorm, Torrevieja e Elche." },
          { icon: Heart, title: "Confiança", desc: "Negócios verificados e recomendados." },
          { icon: Globe, title: "A crescer", desc: "Preparado para expandir a toda a Espanha." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="w-10 h-10 rounded-xl bg-brand-green-50 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-brand-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">{title}</h3>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
