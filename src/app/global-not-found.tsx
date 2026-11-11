import { headers } from "next/headers";
import { DocumentShell } from "@/app/_components/document-shell";
import { NotFoundContent } from "@/app/_components/not-found-content";
import { SiteHeader } from "@/app/_components/site-header";
import { getLanguage } from "@/lib/i18n";

export const metadata = {
  title: "404 | Jiazhao Xu",
  robots: { index: false, follow: true },
};

export default async function GlobalNotFound() {
  // Only the error document reads request headers; content stays prerendered.
  const lang = getLanguage((await headers()).get("x-site-language") || "en");

  return (
    <DocumentShell lang={lang}>
      <SiteHeader lang={lang} />
      <div className="min-h-screen pt-14">
        <NotFoundContent lang={lang} />
      </div>
    </DocumentShell>
  );
}
