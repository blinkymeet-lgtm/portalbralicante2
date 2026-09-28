# Publicar no Netlify

Este projeto foi preparado para Vite + React + React Router.

## Configuração no Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Node: `20`

Defina estas variáveis em **Site configuration → Environment variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Os valores usados atualmente estão no ficheiro `.env` local do projeto. Para produção, é preferível configurar as variáveis diretamente no Netlify.

## Supabase

A área `/admin` usa a Edge Function `admin-api` do Supabase. A função precisa continuar publicada no projeto Supabase e ter as variáveis/segredos necessários configurados, incluindo `ADMIN_PASSWORD` e a chave de service role usada pela função.

## SPA routing

Foi adicionado `public/_redirects` e uma regra equivalente em `netlify.toml` para evitar 404 ao abrir diretamente URLs como `/anuncios`, `/cidade/...` ou `/admin`.
