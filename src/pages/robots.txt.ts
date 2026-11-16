import type { APIRoute } from 'astro';
import settings from '../../public/site-config.json';
export const GET: APIRoute = () => {
  const ready = Boolean(settings.siteUrl && settings.serviceArea && settings.whatsapp.replace(/\D/g, '').length >= 8);
  const body = ready ? `User-agent: *\nAllow: /\nSitemap: ${settings.siteUrl.replace(/\/$/, '')}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
