import { getAllResumes } from "@resume/lib/resume-api";
import markdownToHtml from "@/lib/markdownToHtml";
import { ResumeViewer } from "@resume/components/resume-viewer";
import type { Metadata } from "next";
import { getPageAlternates, getPageSocialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";

  const title = isEn ? "Resume" : "简历";
  const description = isEn
    ? "Jiazhao Xu’s product design and management experience. Open to part-time, advisory, and startup collaborations in AI product design and prototyping."
    : "许嘉昭的产品设计与产品管理经历。目前以兼职、顾问及创业项目合作为主，欢迎围绕 AI 产品设计与原型开发展开交流。";

  return {
    title,
    description,
    alternates: getPageAlternates(lang, "/resume"),
    ...getPageSocialMetadata({ lang, path: "/resume", title, description }),
  };
}

async function getProcessedResumes(lang: string) {
  const resumes = getAllResumes(lang);
  return Promise.all(
    resumes.map(async (r) => ({
      ...r,
      htmlContent: await markdownToHtml(r.content, { mediaSkeleton: false }),
    }))
  );
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const currentResumes = await getProcessedResumes(lang);

  return (
    <main className="resume-page" data-page-language={lang}>
      <ResumeViewer
        variants={currentResumes}
        lang={lang}
      />
    </main>
  );
}
