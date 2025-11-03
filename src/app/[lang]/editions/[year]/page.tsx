import { notFound, redirect } from "next/navigation";
import GalleryData from "@/components/Gallery/Galleries";
import EditionPageClient from "./EditionPageClient";

type PageProps = {
  params: Promise<{ lang: string; year: string }>;
};

export default async function EditionYearPage({ params }: PageProps) {
  const { lang, year } = await params;
  const y = parseInt(year, 10);
  const years = GalleryData.map((g) => g.year);
  const exists = years.includes(y);

  if (!exists) {
    // If invalid year, go to latest for convenience
    const latest = years[years.length - 1];
    redirect(`/${lang}/editions/${latest}`);
  }

  return <EditionPageClient lang={lang} year={y} />;
}

export async function generateStaticParams() {
  // Only 'en' as requested; generate all years from the dataset
  return GalleryData.map((g) => ({ lang: "en", year: String(g.year) }));
}

