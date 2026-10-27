import { MetadataRoute } from "next";
import { CONTENT_COLLECTIONS, getAllItems, getSlugs } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import { LANGUAGES } from "@/lib/i18n";
import { getPageAlternates } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of LANGUAGES) {
    for (const path of ["", "/atlas", "/resume"]) {
      entries.push({
        url: `${SITE_URL}/${lang}${path}`,
        alternates: { languages: getPageAlternates(lang, path).languages },
      });
    }
  }

  for (const collection of CONTENT_COLLECTIONS) {
    const slugs = Object.fromEntries(
      LANGUAGES.map((lang) => [lang, new Set(getSlugs(collection, lang))]),
    );
    for (const lang of LANGUAGES) {
      for (const item of getAllItems(collection, lang)) {
        const path = `/${collection}/${item.slug}`;
        const availableLanguages = LANGUAGES.filter((language) => slugs[language].has(item.slug));
        entries.push({
          url: `${SITE_URL}/${lang}${path}`,
          // Filesystem mtimes change on deployment; omit lastmod until content
          // has an editorial update date instead of reporting a false change.
          alternates: {
            languages: getPageAlternates(lang, path, availableLanguages).languages,
          },
        });
      }
    }
  }

  return entries;
}
