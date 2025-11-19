import { query } from "@/app/lib/strapi";

type StrapiV5Home = {
  data?: {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string | null;
    title?: string | null;
    // Rich Text (blocks) en v5
    description?: Array<{
      type: string;
      children?: Array<{ type: string; text?: string }>;
    }> | null;
  } | null;
  meta?: unknown;
};

type StrapiV4Home = {
  data?: {
    id: number;
    attributes?: {
      title?: string | null;
      description?: any; // por compat
      createdAt?: string;
      updatedAt?: string;
      publishedAt?: string | null;
    };
  } | null;
  meta?: unknown;
};

function blocksToText(blocks: any): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((node) => {
      if (node?.type === "paragraph" && Array.isArray(node.children)) {
        return node.children.map((c: any) => c?.text ?? "").join("");
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export async function getHomeInfo() {
  // ¡SIN populate! tu tipo no tiene imagen
  const res = await query<StrapiV5Home | StrapiV4Home>("home");

  // v5 (sin attributes)
  const d_v5 = (res as StrapiV5Home)?.data as StrapiV5Home["data"];
  if (d_v5 && !("attributes" in (d_v5 as any))) {
    return {
      title: d_v5.title ?? "Bienvenido",
      description: blocksToText(d_v5.description ?? []),
      imageUrl: null,
      imageAlt: "Hero",
    };
  }

  // fallback v4 (con attributes)
  const d_v4 = (res as StrapiV4Home)?.data?.attributes;
  return {
    title: d_v4?.title ?? "Bienvenido",
    // si en v4 guardaste rich text, podés adaptar; por ahora lo forzamos a string
    description:
      typeof d_v4?.description === "string"
        ? d_v4.description
        : JSON.stringify(d_v4?.description ?? ""),
    imageUrl: null,
    imageAlt: "Hero",
  };
}
