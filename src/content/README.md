# Local content

All site content is local. WordPress is no longer used at build time or runtime. Data was captured on 2026-10-18; edit these files and rebuild to publish changes.

- `home/{bg,en}.json`: homepage content, with 23 images per language in `public/assets/home/{bg,en}/`.
- `menu.{bg,en}.json`: header navigation shared by all pages of each language.
- `pages/{bg,en}/{about,regulations,cookies}.json`: informational pages. Unknown slugs return 404.
- `articles/{bg,en}.json`: ordered article lists and full bodies for `the-hidden` and `arles-encounters-with-photography`. Their 33 shared image files, including responsive variants, are in `public/assets/articles/`.
- `types.ts`: local content contracts.
- `../components/Gallery/Galleries.ts`: edition and author data; gallery images are in `public/galleries`, `public/galleriesMedium` and `public/galleriesThumb`.

The footer is defined in `../components/Footer/Footer.tsx`. Sitemap and all route parameters are generated from the local datasets. Source wording is preserved, including an English paragraph in the Bulgarian regulations.

Entry portal, partner and social links, the YouTube embed, consent-based analytics and Google Fonts remain external services. They do not require WordPress.

Validation: the complete static export succeeded with the former WordPress API environment variable set to an unreachable address. Next.js generated 623 static pages. No visual browser review was performed.
