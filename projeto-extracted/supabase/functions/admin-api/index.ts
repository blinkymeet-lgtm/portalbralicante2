import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD") ?? "@Paz048855";

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(message: string, status: number) {
  return jsonResponse({ error: message }, status);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getPath(req: Request): string {
  const url = new URL(req.url);
  let p = url.pathname;
  const prefixes = [
    "/functions/v1/admin-api",
    "/admin-api",
  ];
  for (const prefix of prefixes) {
    if (p.startsWith(prefix)) {
      p = p.slice(prefix.length);
      break;
    }
  }
  if (p === "" || p === "/") return "/";
  if (!p.startsWith("/")) p = "/" + p;
  return p.replace(/\/+$/, "");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const path = getPath(req);
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    // POST /login — verify admin password
    if (path === "/login" && req.method === "POST") {
      const { password } = await req.json();
      if (password === ADMIN_PASSWORD) {
        return jsonResponse({ authenticated: true });
      }
      return errorResponse("Senha incorreta", 401);
    }

    // GET /listings — fetch all listings (including inactive)
    if (path === "/listings" && req.method === "GET") {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return errorResponse(error.message, 500);
      return jsonResponse(data);
    }

    // GET /stats — dashboard statistics
    if (path === "/stats" && req.method === "GET") {
      const { count: total, error: err1 } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true });
      if (err1) return errorResponse(err1.message, 500);

      const { count: active, error: err2 } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      if (err2) return errorResponse(err2.message, 500);

      const { count: inactive, error: err3 } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("is_active", false);
      if (err3) return errorResponse(err3.message, 500);

      const { count: featured, error: err4 } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("is_featured", true);
      if (err4) return errorResponse(err4.message, 500);

      return jsonResponse({ total, active, inactive, featured });
    }

    // POST /listings — create new listing
    if (path === "/listings" && req.method === "POST") {
      const body = await req.json();
      const slug = slugify(`${body.name}-${body.city}`);
      const { data, error } = await supabase
        .from("listings")
        .insert({
          ...body,
          slug,
          gallery: body.gallery ?? [],
          hours: body.hours ?? {},
        })
        .select()
        .single();
      if (error) return errorResponse(error.message, 500);
      return jsonResponse(data, 201);
    }

    // PUT /listings/:id — update listing
    const updateMatch = path.match(/^\/listings\/([a-f0-9-]+)$/);
    if (updateMatch && req.method === "PUT") {
      const id = updateMatch[1];
      const body = await req.json();
      const updateBody = { ...body, updated_at: new Date().toISOString() };
      if (updateBody.name && updateBody.city) {
        updateBody.slug = slugify(`${updateBody.name}-${updateBody.city}`);
      }
      const { data, error } = await supabase
        .from("listings")
        .update(updateBody)
        .eq("id", id)
        .select()
        .single();
      if (error) return errorResponse(error.message, 500);
      return jsonResponse(data);
    }

    // DELETE /listings/:id — delete listing
    const deleteMatch = path.match(/^\/listings\/([a-f0-9-]+)$/);
    if (deleteMatch && req.method === "DELETE") {
      const id = deleteMatch[1];
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", id);
      if (error) return errorResponse(error.message, 500);
      return jsonResponse({ success: true });
    }

    // PATCH /listings/:id/toggle — toggle active/featured
    const toggleMatch = path.match(/^\/listings\/([a-f0-9-]+)\/toggle$/);
    if (toggleMatch && req.method === "PATCH") {
      const id = toggleMatch[1];
      const { field } = await req.json();
      const { data: current } = await supabase
        .from("listings")
        .select(field)
        .eq("id", id)
        .single();
      if (!current) return errorResponse("Listing not found", 404);
      const newValue = !current[field];
      const { data, error } = await supabase
        .from("listings")
        .update({ [field]: newValue, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) return errorResponse(error.message, 500);
      return jsonResponse(data);
    }

    return errorResponse(`Not found: ${path}`, 404);
  } catch (err) {
    return errorResponse(err.message ?? "Internal server error", 500);
  }
});
