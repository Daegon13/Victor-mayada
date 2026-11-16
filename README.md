# Víctor Mayada · Servicio Técnico de Ómnibus

Landing corporativa B2B en español de Uruguay, diseñada como tarjeta de presentación profesional para un técnico independiente con **40 años de trayectoria en reparación de ómnibus convencionales, eléctricos e híbridos**. **No es un sitio publicado ni una página que ya reciba contactos.**

## Qué incluye

- Landing accesible y responsive: hero, trayectoria, tecnologías, soluciones para empresas, tres pasos de contacto, WhatsApp, preguntas frecuentes y cierre.
- Configuración comercial centralizada: `public/site-config.json`.
- Mensaje WhatsApp construido localmente a partir del vehículo, consulta y descripción opcional. Sin backend ni almacenamiento de esos textos.
- Fallback seguro mientras falta el número: muestra el mensaje, permite copiarlo y **no inventa una URL de WhatsApp**.
- SEO: título, descripción, Open Graph, canonical al confirmar dominio, `Person` en JSON-LD, `robots.txt` y `sitemap.xml` condicionales.
- Analítica **desactivada por defecto**. Los eventos no incluyen averías ni datos personales.
- Fotografía industrial original generada digitalmente. No representa a Víctor, instalaciones reales ni una empresa asociada.
- Sin frameworks front-end, fuentes externas, trackers externos ni backend.

## Ejecutar

Con Node 20.3+ y conexión a npm:

```bash
npm install
npm run dev
# http://localhost:4321
npm run build
npm run preview
npm run test
npm run validate:publish
```

Para revisar **sin instalar Astro**, abrí `vista-previa.html` con doble clic (todo está incluido en un solo archivo). También podés usar la vista estática servida localmente:

```bash
python3 scripts/build-preview.py
python3 -m http.server 4173 --directory dist
# http://localhost:4173
```

La lista de decisiones pendientes para Víctor está en `CHECKLIST_PUBLICACION.md`.

El proyecto fuente usa Astro + TypeScript. La vista estática se genera desde **la misma plantilla HTML** que utiliza Astro; `dist/` en este paquete incluye una vista lista para revisar en navegador.

## Campos que se deben completar

Editar `public/site-config.json`:

| Campo | Qué colocar |
|---|---|
| `siteUrl` | URL HTTPS del dominio de producción, sin barra final |
| `whatsapp` | Número internacional, por ejemplo prefijo `598` para Uruguay (sin número ficticio) |
| `phone` | Teléfono público confirmado (opcional si se usa sólo WhatsApp) |
| `email` | Correo comercial confirmado (opcional) |
| `serviceArea` | Cobertura real y confirmada en Uruguay |
| `address` | Sólo si existe dirección comercial pública pertinente |
| `portraitUrl` | Foto real autorizada y optimizada en `public/assets/` |
| `servicesConfirmed` | Sólo capacidades y servicios confirmados por Víctor |
| `analyticsEnabled` | `false` hasta disponer de una herramienta adecuada |
| `analyticsEndpoint` | Endpoint propio compatible, same-origin; eventos POST |

Después de editar, ejecutar `npm run validate:publish`. Hasta completar URL, WhatsApp y cobertura, el HTML y `robots.txt` son `noindex` por seguridad. **El gate no comprueba cualificaciones profesionales:** Víctor debe aprobar los textos y el alcance real de sus servicios antes de la publicación.

## Implementación y medición

`src/pages/index.astro` importa la plantilla (`src/templates/index.html`) y la convierte a HTML configurado mediante `src/render.ts`. Los assets se sirven desde `public/assets`. El formulario usa `public/assets/main.js`, que también gestiona menú móvil y tracking opcional.

Eventos previstos: `page_view`, `whatsapp_click` (si se añade enlace dedicado), `phone_click`, `service_interest`, `contact_start`, `contact_outbound`. `contact_outbound` cuenta una salida al enlace, **no una venta**. Para evitar duplicados, `contact_start` se registra una única vez por carga. **Importante:** para usar un sistema de analítica real, hay que implementar un receptor compatible con el payload y verificarlo en producción; no se simula que ya se registran estadísticas.

Enlace compartido o campañas futuras: parámetros `utm_source`, `utm_medium`, `utm_campaign` pueden añadirse a las URLs; únicamente se registra `utm_campaign` validado al conectar una analítica propia. No se guarda texto de problemas técnicos.

## Publicación

1. Revisar la web en escritorio y móvil con Víctor.
2. Confirmar textos, alcance técnico y fotos.
3. Configurar un WhatsApp real, correo/teléfono si corresponde, cobertura y dominio.
4. Ejecutar `npm run test && npm run validate:publish && npm run build`.
5. Desplegar el resultado de `dist/` en Vercel o Cloudflare Pages (build command: `npm run build`; output: `dist`).
6. Verificar enlaces, indexación, rendimiento, canonical y sitemap públicos.
7. Conectar Search Console y, **si cumple elegibilidad**, configurar Google Business Profile sin publicar una dirección privada.

## Limitaciones verificadas en este entorno

Se comprobó la vista estática y su comportamiento mediante un navegador Chromium local. **No se pudo instalar Astro desde npm ni ejecutar su build** porque el entorno no dispone de resolución de red hacia npm; por eso se incluye `dist/` estático y el proyecto fuente listo para compilar en tu computadora. No se ha hecho despliegue externo.

## Prioridades para V2

1. Fotografía real autorizada de Víctor trabajando y datos de contacto definitivos.
2. Confirmar servicios específicos realmente ofrecidos para agregarlos como páginas individuales de utilidad real, no páginas de SEO repetidas.
3. Medir consultas comerciales reales y origen (sin atribuir ventas a clics).
4. Crear una ficha profesional y un folleto PDF descargable sólo después de validar textos y alcance comercial.
