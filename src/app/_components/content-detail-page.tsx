import Link from "next/link";
import { CMS_NAME, SITE_URL } from "@/lib/constants";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import type { ContentCollection } from "@/lib/api";
import { getItemBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { notFound } from "next/navigation";

type Props = {
  collection: ContentCollection;
  lang: string;
  slug: string;
};

export async function ContentDetailPage({ collection, lang, slug }: Props) {
  const post = getItemBySlug(collection, slug, lang);
  if (!post) notFound();

  const content = await markdownToHtml(post.content);
  const isExperience = collection === "experience";
  const isWriting = collection === "writing";
  const isCreation = collection === "creation";

  const pageUrl = `${SITE_URL}/${lang}/${collection}/${post.slug}`;
  const structuredData = isWriting ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    url: pageUrl,
    headline: post.title,
    description: post.intro || post.excerpt || undefined,
    inLanguage: lang === "en" ? "en" : "zh-CN",
    datePublished: post.date,
    image: post.ogImage.url ? new URL(post.ogImage.url, SITE_URL).href : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: CMS_NAME,
      alternateName: "许嘉昭",
      url: `${SITE_URL}/${lang}`,
    },
  } : null;

  return (
    <main data-page-language={lang}>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      )}
      <Container>
        <article className="mx-auto mb-12 max-w-[1024px]">
          <PostHeader
            title={post.title}
            date={post.date}
            favicon={post.favicon}
            skill={isCreation ? post.skill : undefined}
            type={isExperience ? post.type : isWriting ? post.type : undefined}
            typeBadge={!isExperience}
            area={isExperience ? post.area : undefined}
            dateRange={isExperience ? post.dateRange : undefined}
            location={isExperience ? post.location : undefined}
            showDate={isWriting}
            lang={lang}
          />
          {isWriting && (
            <p className="mb-8 text-sm text-neutral-500 dark:text-neutral-400">
              {lang === "en" ? "By " : "作者："}
              <Link href={`/${lang}`} className="underline">
                {lang === "en" ? CMS_NAME : "许嘉昭"}
              </Link>
            </p>
          )}
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}
