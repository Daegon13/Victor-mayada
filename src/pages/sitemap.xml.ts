import type { APIRoute } from 'astro';
import settings from '../../public/site-config.json';
export const GET: APIRoute = () => {
  const domain = settings.siteUrl.replace(/\/$/, '');
  if (!domain) return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>', { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${domain.replaceAll('&', '&amp;')}/</loc></url></urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
