(() => {
  'use strict';
  const site = window.VICTOR_SITE || {};
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const vehicle = document.getElementById('vehicle');
  const consultation = document.getElementById('consultation');
  const problem = document.getElementById('problem');
  const contactForm = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  const preview = document.getElementById('message-preview');
  const output = document.getElementById('message-result');
  const button = document.getElementById('contact-submit');
  const phone = String(site.whatsapp || '').replace(/\D/g, '');
  const hasContact = phone.length >= 8 && phone.length <= 15;
  const trackedOnce = new Set();
  const track = (name, data = {}, once = false) => {
    if (once && trackedOnce.has(name)) return;
    if (once) trackedOnce.add(name);
    if (!site.analyticsEnabled || !site.analyticsEndpoint) return;
    const endpoint = String(site.analyticsEndpoint);
    // Only send anonymized event metadata to an explicitly configured same-origin endpoint.
    try {
      const url = new URL(endpoint, window.location.href);
      if (url.origin !== window.location.origin) return;
      const allowed = ['service', 'source', 'vehicle', 'type'];
      const clean = Object.fromEntries(Object.entries(data).filter(([key,value]) => allowed.includes(key) && typeof value === 'string').map(([key,value]) => [key, value.slice(0, 45)]));
      const payload = JSON.stringify({ name, data: clean, path: window.location.pathname, referrerType: getReferrerType(), campaign: sanitizeCampaign() });
      const blob = new Blob([payload], { type: 'application/json' });
      if (!navigator.sendBeacon || !navigator.sendBeacon(url.href, blob)) {
        void fetch(url.href, { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true, credentials: 'omit' }).catch(() => {});
      }
    } catch { /* analytics is strictly optional */ }
  };
  function sanitizeCampaign() {
    const value = new URLSearchParams(window.location.search).get('utm_campaign');
    return value && /^[a-zA-Z0-9_\-]{1,64}$/.test(value) ? value : undefined;
  }
  function getReferrerType() {
    try {
      const u = new URL(document.referrer);
      if (u.origin === location.origin) return 'internal';
      if (/google\.|bing\.|duckduckgo\./i.test(u.hostname)) return 'organic';
      return 'referral';
    } catch { return 'direct'; }
  }
  track('page_view', {}, true);
  if (menuButton && nav) {
    const closeMenu = () => { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menú'); };
    menuButton.addEventListener('click', () => {
      const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', willOpen);
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.setAttribute('aria-label', willOpen ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  }
  document.querySelectorAll('[data-select-service]').forEach((link) => {
    link.addEventListener('click', () => {
      const type = link.getAttribute('data-select-service');
      if (vehicle && type) vehicle.value = type;
      track('service_interest', { service: type || 'unknown' });
      track('contact_start', { source: 'technology' }, true);
    });
  });
  document.querySelectorAll('[data-track]').forEach((element) => {
    element.addEventListener('click', () => {
      const name = element.getAttribute('data-track');
      if (!name) return;
      if (name === 'contact_start') track(name, { source: element.getAttribute('data-source') || 'cta' }, true);
      else track(name, { service: element.getAttribute('data-service') || 'unspecified' });
    });
  });
  if (contactForm) {
    contactForm.addEventListener('focusin', () => track('contact_start', { source: 'form' }, true));
    const buildMessage = () => {
      const type = vehicle.value === 'No especificado' ? 'tipo de ómnibus a confirmar' : `ómnibus ${vehicle.value.toLowerCase()}`;
      const base = `Hola, Víctor. Me comunico por tus servicios de reparación de ómnibus. Quisiera consultar por un ${type}.`;
      const reason = `Tipo de consulta: ${consultation.value}.`;
      const description = problem.value.trim().slice(0, 500).replace(/[<>]/g, '');
      return [base, reason, ...(description ? [`Descripción: ${description}`] : []), 'Quedo atento para coordinar los siguientes pasos.'].join('\n');
    };
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = buildMessage();
      output.value = message;
      preview.hidden = false;
      track('service_interest', { vehicle: vehicle.value, type: consultation.value });
      if (!hasContact) {
        status.textContent = 'WhatsApp todavía no está configurado. Podés revisar y copiar el mensaje preparado; la opción de envío estará disponible al completar el teléfono.';
        button.textContent = 'WhatsApp pendiente de configurar';
        return;
      }
      status.textContent = 'Se abrirá WhatsApp con tu consulta preparada. Enviar el mensaje es una acción tuya.';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      track('whatsapp_click', { vehicle: vehicle.value, type: consultation.value });
      track('contact_outbound', { vehicle: vehicle.value, type: consultation.value });
      // Only open from a direct submit gesture. Never infer a completed lead from this action.
      window.open(url, '_blank', 'noopener,noreferrer');
    });
    document.getElementById('copy-message')?.addEventListener('click', async (event) => {
      try {
        await navigator.clipboard.writeText(output.value);
        event.currentTarget.textContent = 'Mensaje copiado';
      } catch {
        output.focus(); output.select();
        event.currentTarget.textContent = 'Seleccioná y copiá el mensaje';
      }
    });
  }
  document.querySelectorAll('[data-contact-unavailable]').forEach((link) => {
    link.addEventListener('click', () => { track('contact_start', { source: 'hero' }, true); });
  });
  // Header direct WhatsApp CTAs are only rendered when the number is configured.
  if (hasContact) {
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => link.addEventListener('click', () => { track('whatsapp_click', { source: 'hero' }); track('contact_outbound', { source: 'hero' }); }));
  }
})();
