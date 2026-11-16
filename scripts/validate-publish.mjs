import { readFileSync } from 'node:fs';
const cfg = JSON.parse(readFileSync(new URL('../public/site-config.json', import.meta.url), 'utf8'));
const errors=[];
if (!/^https:\/\/[^\s/]+\.[^\s/]+\/?$/.test(cfg.siteUrl)) errors.push('Definir siteUrl con el dominio público HTTPS definitivo.');
if (!/^\+?\d{8,15}$/.test(cfg.whatsapp.replace(/[\s()\-]/g,''))) errors.push('Definir whatsapp con código de país y 8–15 dígitos.');
if (!cfg.serviceArea.trim()) errors.push('Confirmar la zona real de cobertura.');
if (!cfg.servicesConfirmed?.length) errors.push('Confirmar servicios publicados.');
if (cfg.analyticsEnabled && !cfg.analyticsEndpoint) errors.push('Indicar endpoint de analítica (o desactivar analítica).');
if (!cfg.portraitUrl.trim()) console.log('Aviso: sustituir fotografía provisoria por una real y autorizada, si está disponible.');
if (errors.length) {
  console.error('PUBLICACIÓN BLOQUEADA:');
  for (const error of errors) console.error(' - '+error);
  process.exitCode=1;
} else console.log('PASS: configuración mínima confirmada para publicar. Verificar datos y permisos antes del despliegue.');
