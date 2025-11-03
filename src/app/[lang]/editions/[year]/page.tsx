import { redirect } from "next/navigation";
import GalleryData from "@/components/Gallery/Galleries";
import EditionPageClient from "./EditionPageClient";

type PageProps = {
  params: Promise<{ lang: string; year: string }>;
};

const SUPPORTED_LANGS = ["en", "bg"];

const normalizeLang = (lang: string) => (SUPPORTED_LANGS.includes(lang) ? lang : "en");

export default async function EditionYearPage({ params }: PageProps) {
  const { lang, year } = await params;
  const y = parseInt(year, 10);
  const years = GalleryData.map((g) => g.year);
  const exists = years.includes(y);
  const language = normalizeLang(lang);

  if (!exists) {
    // If invalid year, go to latest for convenience
    const latest = years[years.length - 1];
    redirect(`/${language}/editions/${latest}`);
  }

  return <EditionPageClient lang={language} year={y} />;
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((language) =>
    GalleryData.map((g) => ({ lang: language, year: String(g.year) }))
  );
}
