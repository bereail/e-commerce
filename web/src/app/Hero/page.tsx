import Image from "next/image";
import { getHomeInfo } from "@/app/lib/get-home-info";
import { mediaURL } from "@/app/lib/strapi";

export default async function Hero() {
  const { title, description, imageUrl, imageAlt } = await getHomeInfo();
  const src = mediaURL(imageUrl);

  return (
    <section className="px-6 py-12 grid gap-6 md:grid-cols-[1.2fr,1fr] items-center">
      <div>
        <h1 className="text-4xl font-bold">{title}</h1>
        {description && <p className="mt-3 text-muted-foreground">{description}</p>}
      </div>

      {src && (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
          <Image
            src={src}
            alt={imageAlt || "Hero"}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      )}
    </section>
  );
}
