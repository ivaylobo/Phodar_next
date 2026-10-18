# Local content

Both homepages (`/en` and `/bg`) use `home/en.json` and `home/bg.json`, captured from WordPress on 2026-10-18. Their layouts use `menu.en.json` and `menu.bg.json`. Edit these files directly; WordPress changes no longer update the homepages or navigation. The existing Home template and styling are retained.

Each homepage has 23 local images in `public/assets/home/en/` or `public/assets/home/bg/`. `sourceUrl` values are local public paths. Past-edition links use local language-prefixed routes. Entry, partner sites and the YouTube embed remain external by design.

Other pages still use WordPress, so a complete production build can still require the API. Homepage language parameters are declared locally rather than fetched from WordPress.

Validation: TypeScript check passed. Both routes returned their expected text, local image paths and navigation through the existing development server, with no WordPress URLs in the HTML. All 46 referenced images exist locally. A full offline production build and visual browser review have not been performed.

## About and Regulations

`pages/{bg,en}/{about,regulations}.json` contains the four informational pages captured on 2026-10-18. The route reads these local files before considering WordPress, and their static parameters are also local. The existing informational template is retained. These pages contain no images. Links to the site's homepage use `/bg` or `/en`; the entry portal remains external.

Source wording is preserved, including an English paragraph in the Bulgarian regulations. Edit the relevant JSON file to change it. Unknown informational slugs still fall back to WordPress.
