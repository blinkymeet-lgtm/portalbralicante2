import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
}

function setMeta(attr: string, key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSEO({ title, description, image }: SEOProps) {
  useEffect(() => {
    document.title = title;
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
    setMeta("property", "og:title", title);
    setMeta("name", "twitter:title", title);
    setMeta("property", "og:type", "website");
    if (image) {
      setMeta("property", "og:image", image);
      setMeta("name", "twitter:image", image);
    }
  }, [title, description, image]);
}
