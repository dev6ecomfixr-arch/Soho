export function seo(title: string, description: string, image?: string) {
  const full = title.includes("SOHO") ? title : `${title} | SOHO`;
  const meta: Array<Record<string, string>> = [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  }
  return { meta };
}
