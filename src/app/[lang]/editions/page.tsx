import YearsMenu from "@/components/YearsMenu/YearsMenu";
import Galleries from "@/components/Gallery/Galleries";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export default async function EditionsIndexPage({ params }: PageProps) {
  const { lang } = await params;
  const years = Galleries.map((g) => g.year);
  const latest = years[years.length - 1];

  return (
    <section className="gallery">
      <div className="galleryContainer">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="years">
                <YearsMenu years={years} currentYear={latest} lang={lang} />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  return [{ lang: "en" }];
}

