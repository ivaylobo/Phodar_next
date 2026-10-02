import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Galleries from "@/components/Gallery/Galleries";
import AuthorGallery from "@/components/Gallery/AuthorGallery/AuthorGallery";

type PageProps = {
  params: Promise<{ lang: string; year: string; author: string }>;
};

const SUPPORTED_LANGS = ["en", "bg"];

const normalizeLang = (lang: string) => (SUPPORTED_LANGS.includes(lang) ? lang : "en");

async function resolveGallery(params: PageProps["params"]) {
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

  return { lang, editionYear, authorEntry };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, editionYear, authorEntry } = await resolveGallery(params);
  const preview = authorEntry.urls[0] ?? authorEntry.urlsMedium[0] ?? authorEntry.urlsThumb[0];
  const title = `${authorEntry.name} — ${authorEntry.title || editionYear} | Phodar`;
  const url = new URL(`/${lang}/editions/${editionYear}/${authorEntry.name.replace(/ /g, "_")}`, "https://phodar.net").href;
  const images = preview
    ? [{ url: new URL(`/${preview.replace(/^\/+/, "")}`, "https://phodar.net").href, alt: authorEntry.title || authorEntry.name }]
    : [];

  return {
    title,
    openGraph: {
      title,
      type: "website",
      url,
      siteName: "Phodar",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      images,
    },
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { lang, editionYear, authorEntry } = await resolveGallery(params);
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
