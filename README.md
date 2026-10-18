# Phodar

Bilingual Next.js website with local content and images. No WordPress installation or API is required. See [content documentation](src/content/README.md) for editing locations.

## Development

```sh
npm ci
npm run dev
```

## Current Next.js hosting

```sh
npm run build
npm start
```

All supported routes are generated at build time. The existing production deployment uses this workflow and remains compatible.

## Static file hosting

```sh
npm run build:static
```

This creates a standalone `out/` directory, including HTML, JavaScript, CSS, images, sitemap and a 404 page. Upload the contents of `out/` to static hosting; no Node.js process is needed to serve it. Configure the host to resolve extensionless paths to their `.html` files (for example, Nginx `try_files $uri $uri.html $uri/ =404;`) and serve `404.html` for missing pages. The root and editions index use Next.js-generated HTML redirects.

`npm start` serves the normal Next.js build, not `out/`. The repository's SSH deployment currently runs a server-side build and restarts a Next.js service; switching production to static hosting also requires changing that server's deployment script and web-server configuration. Those external settings are not changed here.

Set `NEXT_PUBLIC_SITE_URL=https://phodar.net` when building for production (this is also the default for sitemap and article metadata). `NEXT_PUBLIC_WORDPRESS_API_URL` is obsolete and can be removed from local/server environment settings. Next.js downloads Geist fonts during a clean build; browser Google Fonts, YouTube, entry portal and optional analytics remain external.
