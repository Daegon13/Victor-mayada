export type SiteSettings = {
  businessName: string;
  personName: string;
  tagline: string;
  siteUrl: string;
  whatsapp: string;
  phone: string;
  email: string;
  serviceArea: string;
  address: string;
  portraitUrl: string;
  analyticsEndpoint: string;
  analyticsEnabled: boolean;
  servicesConfirmed: string[];
};

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function renderPage(template: string, settings: SiteSettings): string {
  const home = settings.siteUrl.trim().replace(/\/$/, '');
  const whatsapp = settings.whatsapp.replace(/\D/g, '');
  const contactReady = whatsapp.length >= 8 && whatsapp.length <= 15;
  const isReady = Boolean(home && contactReady && settings.serviceArea.trim());
  const canonical = home ? `<link rel="canonical" href="${escapeHtml(home + '/')}"><meta property="og:url" content="${escapeHtml(home + '/')}">` : '';
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: settings.personName,
    description: 'Técnico independiente con 40 años de experiencia en reparación de ómnibus convencionales, eléctricos e híbridos.',
    knowsAbout: ['Reparación de ómnibus', 'Ómnibus eléctricos', 'Ómnibus híbridos'],
    areaServed: { '@type': 'Country', name: 'Uruguay' }
  };
  if (home) schema.url = home;
  if (contactReady) schema.telephone = '+' + whatsapp;
  if (settings.email) schema.email = settings.email;
  const jsonLd = `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`;
  const status = contactReady ? '' : '<div class="setup-notice" role="status"><strong>Vista de desarrollo:</strong> falta configurar el WhatsApp y los demás datos comerciales. Los enlaces de contacto permanecerán desactivados hasta que se completen.</div>';
  const initialContact = contactReady
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola, Víctor. Me comunico por tus servicios de reparación de ómnibus. Quisiera consultar por un vehículo y explicarte el problema.')}`
    : '#contacto';
  const heroCTA = `href="${escapeHtml(initialContact)}" ${contactReady ? 'target="_blank" rel="noopener noreferrer"' : 'data-contact-unavailable="true"'}`;
  const emailHTML = settings.email.trim() ? `<a href="mailto:${escapeHtml(settings.email.trim())}" class="contact-method"><span class="contact-method__icon" aria-hidden="true">@</span><span><strong>Correo electrónico</strong><small>${escapeHtml(settings.email.trim())}</small></span><span aria-hidden="true">↗</span></a>` : '';
  const phoneHTML = settings.phone.trim() ? `<a href="tel:${escapeHtml(settings.phone.replace(/\s/g, ''))}" class="contact-method" data-track="phone_click"><span class="contact-method__icon" aria-hidden="true">↗</span><span><strong>Teléfono</strong><small>${escapeHtml(settings.phone.trim())}</small></span><span aria-hidden="true">↗</span></a>` : '';
  const coverage = settings.serviceArea.trim() ? escapeHtml(settings.serviceArea) : 'Cobertura por confirmar';
  const portrait = settings.portraitUrl.trim() ? `<img class="portrait-real" src="${escapeHtml(settings.portraitUrl)}" alt="Víctor Mayada, técnico especializado en ómnibus" loading="lazy" width="520" height="600">` : '<div class="portrait-placeholder"><span class="portrait-placeholder__icon" aria-hidden="true">VM<span>.</span></span><span>Espacio reservado para<br>fotografía real de Víctor</span></div>';
  const technologies = [
    { key: 'convencional', label: 'Ómnibus convencionales', short: 'CONVENCIONAL' },
    { key: 'electrico', label: 'Ómnibus eléctricos', short: 'ELÉCTRICO' },
    { key: 'hibrido', label: 'Ómnibus híbridos', short: 'HÍBRIDO' }
  ];
  const active = technologies.filter((item) => settings.servicesConfirmed.includes(item.label));
  for (const item of technologies) {
    if (!active.includes(item)) {
      const pattern = new RegExp(`<article class="tech-card" data-service="${item.key}">[\\s\\S]*?<\\/article>`, 'g');
      template = template.replace(pattern, '');
    }
  }
  const addressLine = settings.address.trim() ? `<p class="address-line">Dirección comercial: ${escapeHtml(settings.address.trim())}</p>` : '';
  const vars: Record<string,string> = {
    '%%CANONICAL%%': canonical,
    '%%OG_IMAGE_URL%%': escapeHtml((home || '') + '/assets/hero-industrial.webp'),
    '%%JSONLD%%': jsonLd,
    '%%ROBOTS%%': isReady ? 'index,follow,max-image-preview:large' : 'noindex,nofollow',
    '%%CONFIG_JSON%%': JSON.stringify(settings).replaceAll('<', '\\u003c'),
    '%%STATUS%%': status,
    '%%HERO_CTA%%': heroCTA,
    '%%EMAIL_LINK%%': emailHTML,
    '%%PHONE_LINK%%': phoneHTML,
    '%%COVERAGE%%': coverage,
    '%%PORTRAIT%%': portrait,
    '%%YEAR%%': String(new Date().getFullYear()),
    '%%PERSON_NAME%%': escapeHtml(settings.personName),
    '%%PERSON_NAME_UPPER%%': escapeHtml(settings.personName.toLocaleUpperCase('es-UY')),
    '%%TAGLINE%%': escapeHtml(settings.tagline),
    '%%TECH_COUNT%%': String(active.length).padStart(2,'0'),
    '%%TECH_COLUMNS%%': String(Math.max(1, active.length)),
    '%%TECH_TYPES%%': active.map((item)=>item.short).join(' <i aria-hidden="true">/</i> '),
    '%%ADDRESS_LINE%%': addressLine
  };
  for (const [key, value] of Object.entries(vars)) template = template.replaceAll(key, value);
  return template;
}
