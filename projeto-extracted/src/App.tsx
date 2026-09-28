import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AdminAuthProvider } from "@/lib/admin-auth";

import PublicLayout from "@/layouts/PublicLayout";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import CityPage from "@/pages/CityPage";
import CategoryPage from "@/pages/CategoryPage";
import CategoriesPage from "@/pages/CategoriesPage";
import CitiesPage from "@/pages/CitiesPage";
import ListingDetailPage from "@/pages/ListingDetailPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";

import AdminLayout from "@/layouts/AdminLayout";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminListings from "@/pages/admin/AdminListings";
import AdminListingForm from "@/pages/admin/AdminListingForm";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center px-4">
        <p className="text-6xl font-bold text-slate-200 mb-2">404</p>
        <p className="text-slate-500 mb-4">Página não encontrada</p>
        <a href="/" className="text-sm font-medium text-brand-green-600 hover:text-brand-green-700">Voltar ao início</a>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/anuncios" element={<SearchPage />} />
            <Route path="/cidades" element={<CitiesPage />} />
            <Route path="/cidade/:city" element={<CityPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/categoria/:category" element={<CategoryPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/:city/:category/:slug" element={<ListingDetailPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="anuncios" element={<AdminListings />} />
            <Route path="anuncios/novo" element={<AdminListingForm />} />
            <Route path="anuncios/:id" element={<AdminListingForm />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
