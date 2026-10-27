import type { ContentCollection } from "@/lib/api";
import { getAllItems, getItemBySlug } from "@/lib/api";
import { CMS_NAME } from "@/lib/constants";
import { getPageAlternates, getPageSocialMetadata } from "@/lib/seo";
import { LANGUAGES } from "@/lib/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const COLLECTION_LABELS: Record<ContentCollection, string> = {
  creation: "Creation",
  experience: "Experience",
  project: "Project",
  writing: "Writing",
};

export function getContentMetadata(
  collection: ContentCollection,
  slug: string,
  lang: string,
): Metadata {
  const post = getItemBySlug(collection, slug, lang);
  if (!post) notFound();

  const description =
    post.intro ||
    post.excerpt ||
    `${post.title} – ${COLLECTION_LABELS[collection]} by ${CMS_NAME}`;

  const path = `/${collection}/${post.slug}`;
  const availableLanguages = LANGUAGES.filter((language) =>
    getItemBySlug(collection, post.slug, language),
  );

  return {
    title: post.title,
    description,
    alternates: getPageAlternates(lang, path, availableLanguages),
    ...getPageSocialMetadata({
      lang,
      path,
      title: post.title,
      description,
      image: post.ogImage.url,
      article: collection === "writing",
    }),
  };
}

export function getContentStaticParams(collection: ContentCollection) {
  return LANGUAGES.flatMap((lang) =>
    getAllItems(collection, lang).map((post) => ({ lang, slug: post.slug })),
  );
}
