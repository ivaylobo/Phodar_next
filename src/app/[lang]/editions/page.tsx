import YearsMenu from "@/components/YearsMenu/YearsMenu";
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

  return (
    <section className="gallery">
      <div className="galleryContainer">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="years">
                <YearsMenu years={years} currentYear={latest} lang={language} />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}
