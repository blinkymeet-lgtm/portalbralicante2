import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const functionUrl = `${supabaseUrl}/functions/v1/admin-api`;

export async function adminLogin(password: string): Promise<boolean> {
  const res = await fetch(`${functionUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.authenticated === true;
}

export async function fetchAllListings() {
  const res = await fetch(`${functionUrl}/listings`, {
    headers: { Authorization: `Bearer ${supabaseAnonKey}` },
  });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export async function fetchAdminStats() {
  const res = await fetch(`${functionUrl}/stats`, {
    headers: { Authorization: `Bearer ${supabaseAnonKey}` },
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function createListing(data: Record<string, unknown>) {
  const res = await fetch(`${functionUrl}/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to create listing");
  }
  return res.json();
}

export async function updateListing(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${functionUrl}/listings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to update listing");
  }
  return res.json();
}

export async function deleteListing(id: string) {
  const res = await fetch(`${functionUrl}/listings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${supabaseAnonKey}` },
  });
  if (!res.ok) throw new Error("Failed to delete listing");
  return res.json();
}

export async function toggleListingField(id: string, field: "is_active" | "is_featured") {
  const res = await fetch(`${functionUrl}/listings/${id}/toggle`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ field }),
  });
  if (!res.ok) throw new Error("Failed to toggle");
  return res.json();
}

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from("listings")
    .upload(fileName, file);
  if (error) throw new Error(error.message);
  const { data: urlData } = supabase.storage
    .from("listings")
    .getPublicUrl(data.path);
  return urlData.publicUrl;
}
