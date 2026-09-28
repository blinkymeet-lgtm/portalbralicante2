import { useSEO } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Mail, MapPin, MessageCircle, Megaphone } from "lucide-react";

const WHATSAPP_NUMBER = "34631638487";
const WHATSAPP_MESSAGE = "Olá! Vim pelo Portal BR em Alicante, quero fazer uma parceria!";

export default function ContactPage() {
  useSEO({
    title: "Contato — Portal BR em Alicante",
    description: "Entre em contato com o Portal BR em Alicante. Dúvidas, sugestões ou parcerias.",
  });

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ label: "Contato" }]} />
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-4 mb-2">Contato</h1>
      <p className="text-sm text-slate-500 mb-8">
        Tem alguma dúvida, sugestão ou quer fazer uma parceria? Envie-nos uma mensagem.
      </p>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-4 bg-white rounded-2xl border border-slate-100 p-8 sm:p-10 text-center hover:border-brand-green hover:shadow-card-hover transition-all group"
      >
        <div className="w-16 h-16 rounded-2xl bg-brand-green-50 flex items-center justify-center group-hover:bg-brand-green-100 transition-colors">
          <Megaphone className="w-8 h-8 text-brand-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Quero anunciar</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Clique para falar com a nossa equipa no WhatsApp e tirar o seu anúncio do papel.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green-600 group-hover:bg-brand-green-700 text-white font-semibold text-sm rounded-xl transition-colors">
          <MessageCircle className="w-4 h-4" />
          Falar no WhatsApp
        </span>
      </a>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Mail, label: "Email", value: "contato@portalbralicante.site" },
          { icon: MessageCircle, label: "WhatsApp", value: "+34 631 63 84 87" },
          { icon: MapPin, label: "Localização", value: "Alicante, Espanha" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <Icon className="w-5 h-5 text-brand-green-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm text-slate-700 mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
