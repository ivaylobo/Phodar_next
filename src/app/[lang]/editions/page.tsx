import { redirect } from "next/navigation";
import Galleries from "@/components/Gallery/Galleries";

type PageProps = {
  params: Promise<{ lang: string }>;
};

const SUPPORTED_LANGS = ["en", "bg"];

const normalizeLang = (lang: string) => (SUPPORTED_LANGS.includes(lang) ? lang : "en");

export default async function EditionsIndexPage({ params }: PageProps) {
  const { lang } = await params;
  const language = normalizeLang(lang);
  const years = Galleries.map((g) => g.year);
  const latest = years[years.length - 1];

  redirect(`/${language}/editions/${latest}`);
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}
