"use client";
import YearsMenu from "@/components/YearsMenu/YearsMenu";
import EditionGallery from "@/components/Gallery/EditionGallery/EditionGallery";
import GalleriesList from "@/components/Gallery/GalleriesList/GalleriesList";
import AuthorGallery from "@/components/Gallery/AuthorGallery/AuthorGallery";
import Galleries from "@/components/Gallery/Galleries";

type Props = {
  lang: string;
  year: number;
};

export default function EditionPageClient({ lang, year }: Props) {
  const years = Galleries.map((g) => g.year);

  return (
    <section className="gallery">
      <div className="galleryContainer">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="years">
                <YearsMenu years={years} currentYear={year} lang={lang} />
              </ul>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <EditionGallery editionYear={year} lang={lang} />
          </div>
        </div>

        <div className="container">
          <div className="row">
            <GalleriesList edition={year} lang={lang} />
          </div>
        </div>
      </div>

      {/* Overlay author view if ?author=... present */}
      <AuthorGallery editionYear={year} lang={lang} />
    </section>
  );
}

