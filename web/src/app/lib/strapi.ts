const { STRAPI_HOST, STRAPI_TOKEN } = process.env;

export function mediaURL(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = (STRAPI_HOST || "").replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${base}/${p}`;
}

function joinUrl(base = "", path = "") {
  const b = base.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

export async function query<T = any>(endpoint: string, init?: RequestInit): Promise<T> {
  if (!STRAPI_HOST) throw new Error("Falta STRAPI_HOST en el entorno");
  const fullUrl = joinUrl(STRAPI_HOST, `/api/${endpoint}`);

  const res = await fetch(fullUrl, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN ?? ""}`,
      "Content-Type": "application/json",
    },
    // next: { revalidate: 60 },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Strapi ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}
