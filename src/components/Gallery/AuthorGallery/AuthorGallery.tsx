import type { Author } from "../Galleries";
import AuthorGalleryClient from "./AuthorGalleryClient";

const pickPreviewImage = (author: Author): string | undefined => {
  if (author.urls && author.urls.length > 0) return author.urls[0];
  if (author.urlsMedium && author.urlsMedium.length > 0) return author.urlsMedium[0];
  if (author.urlsThumb && author.urlsThumb.length > 0) return author.urlsThumb[0];
  return undefined;
};

type Props = {
  author: Author;
  editionYear: number;
  lang: string;
};

export default function AuthorGallery({ author, editionYear, lang }: Props) {
  const preview = pickPreviewImage(author);

  return (
    <>
      {preview ? (
        <img
          src={`/${preview}`}
          alt=""
          style={{ display: "none" }}
          aria-hidden="true"
        />
      ) : null}
      <AuthorGalleryClient author={author} editionYear={editionYear} lang={lang} />
    </>
  );
}
