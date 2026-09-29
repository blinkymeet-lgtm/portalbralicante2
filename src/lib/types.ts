export interface Listing {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  short_description: string | null;
  full_description: string | null;
  main_image: string | null;
  gallery: string[];
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  website: string | null;
  address: string | null;
  google_maps_link: string | null;
  hours: Record<string, string>;
  is_active: boolean;
  is_featured: boolean;
  rating: number | null;
  job_title: string | null;
  job_type: string | null;
  job_salary: string | null;
  job_schedule: string | null;
  job_requirements: string | null;
  job_benefits: string | null;
  job_contact_email: string | null;
  event_date: string | null;
  event_time: string | null;
  event_end_date: string | null;
  event_location: string | null;
  event_price: string | null;
  event_age: string | null;
  event_organizer: string | null;
  event_tickets_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total: number;
  active: number;
  inactive: number;
  featured: number;
}

export interface Category {
  key: string;
  label: string;
  icon: string;
  description: string;
}

export interface CityInfo {
  name: string;
  description: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  { key: "Culinária", label: "Culinária", icon: "UtensilsCrossed", description: "Restaurantes e locais para comer: comida brasileira, lanches rápidos, padarias, cafeterias e muito mais. Encontre sabores de casa na Costa Blanca." },
  { key: "Barbearias", label: "Barbearias", icon: "Scissors", description: "Barbearias e salões de cabeleireiro com profissionais brasileiros. Cortes, barba, pigmentação e tratamentos capilares em Alicante e região." },
  { key: "Mercados", label: "Mercados", icon: "ShoppingCart", description: "Mercados e lojas de produtos brasileiros e latinos. Compre alimentos, temperos, bebidas e produtos importados perto de si." },
  { key: "Imóveis", label: "Imóveis", icon: "Home", description: "Arrendar, comprar ou vender casas e apartamentos na Costa Blanca. Encontre a sua casa na Espanha com profissionais que falam a sua língua." },
  { key: "Assessoria de Documentação", label: "Assessoria de Documentação", icon: "Scale", description: "Assessoria e serviços de documentação: NIE, empadronamento, tradução juramentada, legalização, residência, trabalho e gestões junto a organismos públicos espanhóis. Apoio completo para brasileiros na Espanha." },
  { key: "Viagens", label: "Viagens", icon: "Plane", description: "Agências de viagens e transporte: passagens, excursões, transfers de aeroporto e pacotes turísticos para brasileiros na Europa." },
  { key: "Eventos", label: "Eventos", icon: "PartyPopper", description: "Organização de eventos, festas, catering, decoração, música e entretenimento. Tudo para tornar a sua celebração inesquecível." },
  { key: "Lojas", label: "Lojas", icon: "ShoppingBag", description: "Lojas e comércios: moda, calçado, acessórios, eletrónica, artigos para casa e muito mais. Compre de quem entende o que o brasileiro procura." },
  { key: "Cuidados pessoais e estética", label: "Cuidados pessoais e estética", icon: "Sparkles", description: "Salões de beleza, estética, manicure, depilação, massagens e tratamentos estéticos. Cuide de si com profissionais de confiança." },
  { key: "Vagas de Emprego", label: "Vagas de Emprego", icon: "BriefcaseBusiness", description: "Oportunidades de trabalho para brasileiros na Costa Blanca. Vagas em restaurantes, comércio, serviços, construção e mais. Candidate-se diretamente." },
  { key: "Serviços", label: "Serviços", icon: "Wrench", description: "Serviços diversos: limpeza, reparação, construção, pintura, eletricidade, canalização e outros profissionais qualificados à sua disposição." },
  { key: "Esporte e Fitness", label: "Esporte e Fitness", icon: "Dumbbell", description: "Academias, personal trainers, artes marciais, futebol, vôlei e atividades desportivas para brasileiros na Costa Blanca. Mantenha-se ativo e saudável na Espanha." },
];

export const CITIES: CityInfo[] = [
  {
    name: "Alicante",
    description: "Serviços e negócios para brasileiros em Alicante.",
    image: "https://images.pexels.com/photos/16046608/pexels-photo-16046608.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: "Benidorm",
    description: "Encontre empresas, restaurantes e serviços em Benidorm.",
    image: "https://images.pexels.com/photos/33739349/pexels-photo-33739349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: "Torrevieja",
    description: "Descubra negócios e serviços brasileiros em Torrevieja.",
    image: "https://images.pexels.com/photos/28773424/pexels-photo-28773424.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: "Elche",
    description: "Negócios e serviços brasileiros em Elche, a cidade das palmeiras.",
    image: "https://images.pexels.com/photos/13114608/pexels-photo-13114608.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
];

export const DAYS_OF_WEEK = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
] as const;

export const DAY_LABELS: Record<string, string> = {
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
  domingo: "Domingo",
};
