import type { Metadata } from "next";
import { PersonalGlobeOverlay } from "@/app/_components/personal-globe-overlay";
import { getLanguage } from "@/lib/i18n";
import { getPersonalGlobeData } from "@/lib/personal-globe";
import { getPageAlternates, getPageSocialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: requestedLanguage } = await params;
  const lang = getLanguage(requestedLanguage);
  const isEn = lang === "en";
  const title = "My Atlas";
  const description = isEn
    ? "An interactive atlas of the places and stories that shaped Jiazhao Xu."
    : "一份记录许嘉昭去过的地方与沿途故事的互动地图集。";

  return {
    title,
    description,
    alternates: getPageAlternates(lang, "/atlas"),
    ...getPageSocialMetadata({ lang, path: "/atlas", title, description }),
  };
}

export default async function AtlasPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: requestedLanguage } = await params;
  const lang = getLanguage(requestedLanguage);
  const { places, routes } = getPersonalGlobeData(lang);

  return <PersonalGlobeOverlay lang={lang} places={places} routes={routes} />;
}
