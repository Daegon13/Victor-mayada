# Revisión y publicación · Víctor Mayada

Estado: **sitio implementado para revisión local; no publicado**.

## Para validar con Víctor

- [ ] Aprobar nombre comercial y mensaje principal.
- [ ] Confirmar que la referencia a **40 años** y las tres tecnologías está correctamente expresada.
- [ ] Aprobar qué servicios técnicos específicos está dispuesto a ofrecer y cuáles deben quedar fuera, especialmente los relacionados con alta tensión.
- [ ] Confirmar zona exacta de cobertura y modalidad de atención.
- [ ] Facilitar WhatsApp comercial y, si desea, teléfono o correo.
- [ ] Elegir una fotografía real que tenga autorización para usarse.

## Para implementar antes del despliegue

- [ ] Configurar datos reales en `public/site-config.json`.
- [ ] Asociar un dominio HTTPS y comprobar que apunta al sitio correcto.
- [ ] Ejecutar `npm run test`, `npm run validate:publish` y `npm run build` en un equipo con acceso a npm.
- [ ] Verificar WhatsApp, correo, teléfono, enlaces, menú móvil, aspecto en celular y accesibilidad.
- [ ] Comprobar `robots.txt`, `sitemap.xml`, canonical, Open Graph y página en Google Search Console.
- [ ] Sólo si existe elegibilidad y datos reales, crear o reclamar Perfil de Empresa en Google.

## Decisiones ya tomadas

- Público prioritario: pequeñas y medianas empresas de transporte; secundarios: propietarios, talleres y flotas eléctricas/híbridas.
- Primera versión: landing B2B, no catálogo extenso ni blog.
- Contacto: un recorrido muy corto, con WhatsApp preferente y mensaje guiado opcional.
- Tecnología: Astro + TypeScript + CSS/JS mínimo; sin backend por ahora.
- Analítica: desactivada hasta conectar un receptor válido, sin registrar detalles privados de averías.
- No hay promesas de atención urgente, 24/7, certificaciones ni autorizaciones no confirmadas.

No se ha fijado fecha de publicación: depende de la confirmación de datos comerciales y de las pruebas de compilación en un entorno con acceso a npm.
