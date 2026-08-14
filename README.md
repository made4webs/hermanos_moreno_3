# Hermanos Moreno — sitio web

Sitio estático bilingüe (español / inglés) generado a partir de los diseños de Stitch
que están en `stitch_hermanos_moreno_landing_page/`.

## Ver el sitio

Basta con abrir `index.html` en el navegador. Si prefieres servirlo por HTTP
(recomendado, para que el idioma y las rutas se comporten como en producción):

```bash
node serve.mjs
```

Y abrir <http://localhost:4173>.

## Páginas

| Español | Inglés | Contenido |
| --- | --- | --- |
| `index.html` | `en/index.html` | Portada, con accesos a las demás páginas |
| `carta.html` | `en/menu.html` | Carta completa |
| `resenas.html` | `en/reviews.html` | Reseñas de clientes |
| `como-llegar.html` | `en/directions.html` | Dirección, indicaciones, aparcamiento |
| `contacto.html` | `en/contact.html` | Formulario de reserva, datos y mapa |
| `llamar.html` | `en/call.html` | Teléfono, WhatsApp y formulario de mensaje |
| `aviso-legal.html` | `en/legal-notice.html` | Aviso legal |
| `privacidad.html` | `en/privacy.html` | Política de privacidad |

Todas comparten la misma cabecera y el mismo pie, con el enlace activo marcado,
menú desplegable en móvil y selector ES/EN que lleva a la misma página en el otro
idioma.

## Cómo se genera

Los diseños de Stitch traen cada uno su propia cabecera y su propio pie, con todos
los enlaces apuntando a `href="#"`. En vez de editarlos a mano uno por uno,
`build.mjs` toma el **contenido** de cada diseño y lo envuelve en una cabecera y un
pie canónicos con los enlaces ya resueltos:

```bash
node build.mjs
```

Regenera los 16 ficheros HTML. Si vuelves a exportar un diseño desde Stitch,
sustituye el `code.html` correspondiente y vuelve a ejecutar el comando. El script
falla de forma ruidosa si un fragmento que esperaba sustituir ya no está, para que
un cambio de diseño no pase desapercibido.

**Los HTML de la raíz y de `en/` son generados: no los edites a mano**, se
sobrescriben en la siguiente ejecución. Los cambios van en `build.mjs`.

## Formularios

No hay servidor detrás, así que los dos formularios (reserva y mensaje) validan los
campos en el navegador y componen el texto de la petición. Después muestran un
recuadro con dos salidas reales: enviarlo por WhatsApp con el mensaje ya redactado,
o llamar por teléfono. Ningún dato sale del navegador por su cuenta.

Si más adelante quieres que la reserva llegue por correo, el sitio de un
formulario alojado (Formspree, Basin, Netlify Forms…) es el `<form>` de
`contacto.html`, en la función `buildContact` de `build.mjs`.

## Pendiente antes de publicar

Estos datos vienen de la plantilla de Stitch y **no son reales**:

- **Dirección.** La calle del diseño (`Calle Volcán 12`) era inventada, y encima
  situaba el local en Tenerife. Se ha eliminado de todo el sitio: donde iba la
  dirección, ahora hay un enlace a la ficha real de Google Maps. En cuanto tengas la
  calle y el número, ponlos en la constante `ADDRESS` de `build.mjs` y vuelve a
  ejecutar `node build.mjs`: aparecerán en el pie, en Contacto, en Cómo llegar y en
  las dos páginas legales.
- **Municipio.** Todo el sitio dice «Vega de San Mateo» porque lo decía el diseño
  original, pero las coordenadas de la ficha (`28.0049, -15.5757`) caen unos
  kilómetros al oeste del casco de San Mateo. Conviene confirmarlo: aparece en el
  eslogan de la portada, en el copyright del pie y en las descripciones `<meta>`
  (funciones `buildHome` y `buildFooter` de `build.mjs`).
- **Teléfono `+34 922 000 000`** y el número de WhatsApp asociado. Es el de la
  plantilla, y el prefijo 922 es de Tenerife: el restaurante está en Gran Canaria
  (928 / 9xx). Constantes `PHONE_HREF`, `PHONE_DISPLAY` y `WHATSAPP`.
- **Indicaciones para llegar en coche.** Los dos itinerarios de `como-llegar.html`
  («Desde Las Palmas» por la GC-3/GC-15, «Desde el Sur» por la GC-60) los inventó
  Stitch, igual que el aparcamiento gratuito a 50 m y el ascensor. Hay que revisarlos
  contra la ubicación real antes de publicar.
- **Valoraciones incoherentes.** La portada anuncia 4,5 con 604 reseñas y la página
  de reseñas muestra 4,8 con 245. Hay que dejar una sola cifra, la real.
- **Reseñas de ejemplo.** Los cinco testimonios de `resenas.html` son texto de
  relleno del diseño, con nombres y fotos inventados. Publicarlos como reseñas
  reales sería engañoso: sustitúyelos por reseñas auténticas con permiso, o deja
  solo el enlace a Google.
- **Imágenes.** Todas se cargan desde los servidores de Google donde Stitch las dejó.
  Esas URL pueden caducar; conviene descargarlas a una carpeta `img/` del proyecto.
- **Datos fiscales** en `aviso-legal.html` y `privacidad.html` (razón social, NIF,
  correo de contacto), marcados como «pendiente de completar».
- **Botón «Escribir una reseña».** Abre la ficha de Google, desde donde se puede
  puntuar. Para saltar directo al formulario de reseña hace falta el `place_id` en
  formato `ChIJ…`, que se saca desde el panel de Google Business, y montar
  `https://search.google.com/local/writereview?placeid=ChIJ…`.
- **Tailwind por CDN.** Sirve para desarrollo. Para producción conviene compilar el
  CSS y así evitar el parpadeo inicial y la dependencia de un CDN externo.
