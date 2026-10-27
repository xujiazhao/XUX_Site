import type { Metadata } from "next";
import { CMS_NAME, HOME_OG_IMAGE_URL, SITE_URL } from "@/lib/constants";
import { LANGUAGES, type Language } from "@/lib/i18n";

export function getPageAlternates(
  lang: string,
  path = "",
  availableLanguages: readonly Language[] = LANGUAGES,
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = Object.fromEntries(
    availableLanguages.map((language) => [language, `${SITE_URL}/${language}${path}`]),
  );
  if (availableLanguages.includes("en")) {
    languages["x-default"] = `${SITE_URL}/en${path}`;
  }
  return { canonical: `${SITE_URL}/${lang}${path}`, languages };
}

export function getPageSocialMetadata({
  lang,
  path,
  title,
  description,
  image,
  article = false,
}: {
  lang: string;
  path: string;
  title: string;
  description: string;
  image?: string;
  article?: boolean;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const socialTitle = `${title} | ${CMS_NAME}`;
  const images = [image || HOME_OG_IMAGE_URL];
  return {
    openGraph: {
      type: article ? "article" : "website",
      url: `${SITE_URL}/${lang}${path}`,
      siteName: CMS_NAME,
      locale: lang === "en" ? "en_US" : "zh_CN",
      title: socialTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images,
    },
  };
}
