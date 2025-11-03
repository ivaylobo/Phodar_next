import { redirect } from "next/navigation";
import Galleries from "@/components/Gallery/Galleries";
import AuthorGallery from "@/components/Gallery/AuthorGallery/AuthorGallery";

type PageProps = {
  params: Promise<{ lang: string; year: string; author: string }>;
};

const SUPPORTED_LANGS = ["en", "bg"];

const normalizeLang = (lang: string) => (SUPPORTED_LANGS.includes(lang) ? lang : "en");

export default async function AuthorPage({ params }: PageProps) {
  const { lang: rawLang, year, author } = await params;
  const lang = normalizeLang(rawLang);
  const editionYear = Number(year);

  if (!Number.isFinite(editionYear)) {
    redirect(`/${lang}/editions`);
  }

  const edition = Galleries.find((g) => g.year === editionYear);
  if (!edition) {
    redirect(`/${lang}/editions`);
  }

  const authorEntry = edition.authors.find((item) => item.name.replace(/ /g, "_") === author);
  if (!authorEntry) {
    redirect(`/${lang}/editions/${editionYear}`);
  }

  return <AuthorGallery editionYear={editionYear} author={authorEntry} lang={lang} />;
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) =>
    Galleries.flatMap((edition) =>
      edition.authors.map((author) => ({
        lang,
        year: String(edition.year),
        author: author.name.replace(/ /g, "_"),
      }))
    )
  );
}
