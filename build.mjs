/**
 * Genera el sitio navegable de Hermanos Moreno a partir de los diseños
 * exportados por Stitch en ./stitch_hermanos_moreno_landing_page/.
 *
 * Cada diseño exportado trae su propia cabecera y su propio pie con enlaces
 * muertos (href="#"). Este script conserva el CONTENIDO de cada diseño y lo
 * envuelve en una cabecera y un pie canónicos, con todos los enlaces resueltos
 * y con la navegación móvil, los formularios y las llamadas a la acción
 * funcionando.
 *
 * Uso:  node build.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, "stitch_hermanos_moreno_landing_page");
const OUT_EN = path.join(ROOT, "en");

/* ------------------------------------------------------------------------ */
/* Datos del negocio                                                         */
/* PLACEHOLDERS heredados del diseño de Stitch: sustituir por los reales.     */
/* ------------------------------------------------------------------------ */
const PHONE_HREF = "tel:+34606888002";
const PHONE_DISPLAY = "+34 606 888 002";
const WHATSAPP = "https://wa.me/34606888002";

// PENDIENTE: cuando el cliente facilite la calle y el número reales, ponlos aquí
// (p. ej. "Calle Real 12, 35xxx Municipio, Gran Canaria"). Mientras esté vacío, el
// sitio no muestra ninguna dirección inventada: enlaza a la ficha de Google Maps.
const ADDRESS = "";
const ADDRESS_LABEL = {
  es: ADDRESS || "Ver ubicación en Google Maps",
  en: ADDRESS || "View location on Google Maps",
};
const ADDRESS_LEGAL = {
  es: ADDRESS || "<em>pendiente de completar</em>",
  en: ADDRESS || "<em>to be completed</em>",
};

// Ficha real de Google Maps facilitada por el cliente.
// Resuelve a "Restaurante Hermanos Moreno" en 28.0049239, -15.5756826.
const MAPS_URL = "https://maps.app.goo.gl/2Vo27RGTENFTxKdB7";
const COORDS = "28.0049239,-15.5756826";
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${COORDS}`;
const REVIEWS_URL = MAPS_URL;

/* ------------------------------------------------------------------------ */
/* Mapa de páginas                                                           */
/* ------------------------------------------------------------------------ */
const PAGES = {
  inicio: { es: "index.html", en: "index.html", labelEs: "Inicio", labelEn: "Home" },
  carta: { es: "carta.html", en: "menu.html", labelEs: "Carta", labelEn: "Menu" },
  resenas: { es: "resenas.html", en: "reviews.html", labelEs: "Reseñas", labelEn: "Reviews" },
  "como-llegar": { es: "como-llegar.html", en: "directions.html", labelEs: "Cómo llegar", labelEn: "Directions" },
  contacto: { es: "contacto.html", en: "contact.html", labelEs: "Contacto", labelEn: "Contact" },
  llamar: { es: "llamar.html", en: "call.html", labelEs: "Llamar ahora", labelEn: "Call now" },
  "aviso-legal": { es: "aviso-legal.html", en: "legal-notice.html", labelEs: "Aviso legal", labelEn: "Legal notice" },
  privacidad: { es: "privacidad.html", en: "privacy.html", labelEs: "Política de privacidad", labelEn: "Privacy policy" },
};

const NAV_KEYS = ["inicio", "carta", "resenas", "como-llegar", "contacto"];
const ALL_KEYS = Object.keys(PAGES);

const href = (key, lang) => PAGES[key][lang];
const label = (key, lang) => (lang === "es" ? PAGES[key].labelEs : PAGES[key].labelEn);
/** Enlace a la misma página en el otro idioma. */
const hrefOtherLang = (key, lang) =>
  lang === "es" ? `en/${PAGES[key].en}` : `../${PAGES[key].es}`;

/* ------------------------------------------------------------------------ */
/* <head> canónico                                                           */
/* ------------------------------------------------------------------------ */
const TAILWIND_CONFIG = `
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "tertiary-fixed-dim": "#b6d088",
                        "surface-container": "#20201f",
                        "secondary-container": "#784f00",
                        "tertiary-fixed": "#d2eca2",
                        "on-tertiary": "#233600",
                        "secondary": "#f6bc69",
                        "tertiary": "#b6d088",
                        "on-secondary-container": "#fec36f",
                        "on-tertiary-fixed": "#131f00",
                        "secondary-fixed": "#ffddb3",
                        "on-secondary": "#452b00",
                        "primary-container": "#801020",
                        "surface-container-highest": "#353535",
                        "surface": "#131313",
                        "tertiary-container": "#32460d",
                        "on-background": "#e5e2e1",
                        "on-primary-fixed-variant": "#8a1926",
                        "on-surface-variant": "#dfbfbe",
                        "on-primary": "#680014",
                        "on-error": "#690005",
                        "outline-variant": "#584141",
                        "background": "#131313",
                        "on-secondary-fixed-variant": "#624000",
                        "on-error-container": "#ffdad6",
                        "error": "#ffb4ab",
                        "surface-container-low": "#1c1b1b",
                        "inverse-primary": "#ab323b",
                        "surface-tint": "#ffb3b2",
                        "surface-variant": "#353535",
                        "surface-bright": "#393939",
                        "inverse-surface": "#e5e2e1",
                        "surface-container-high": "#2a2a2a",
                        "outline": "#a68a89",
                        "secondary-fixed-dim": "#f6bc69",
                        "primary": "#ffb3b2",
                        "on-primary-container": "#ff888b",
                        "error-container": "#93000a",
                        "surface-dim": "#131313",
                        "inverse-on-surface": "#313030",
                        "on-secondary-fixed": "#291800",
                        "primary-fixed-dim": "#ffb3b2",
                        "primary-fixed": "#ffdad9",
                        "surface-container-lowest": "#0e0e0e",
                        "on-tertiary-fixed-variant": "#394d14",
                        "on-primary-fixed": "#410009",
                        "on-surface": "#e5e2e1",
                        "on-tertiary-container": "#9bb470"
                    },
                    borderRadius: {
                        DEFAULT: "0.125rem",
                        lg: "0.25rem",
                        xl: "0.5rem",
                        full: "0.75rem"
                    },
                    spacing: {
                        "grid-gutter": "24px",
                        "section-gap-mobile": "64px",
                        "grid-margin": "24px",
                        "section-gap-desktop": "120px",
                        "base": "8px"
                    },
                    fontFamily: {
                        "headline-lg-mobile": ["Playfair Display", "serif"],
                        "headline-xl": ["Playfair Display", "serif"],
                        "body-lg": ["Montserrat", "sans-serif"],
                        "headline-md": ["Playfair Display", "serif"],
                        "headline-lg": ["Playfair Display", "serif"],
                        "body-md": ["Montserrat", "sans-serif"],
                        "label-sm": ["Montserrat", "sans-serif"]
                    },
                    fontSize: {
                        "headline-lg-mobile": ["28px", { lineHeight: "1.2", fontWeight: "600" }],
                        "headline-xl": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
                        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
                        "headline-lg": ["36px", { lineHeight: "1.2", fontWeight: "600" }],
                        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
                        "label-sm": ["12px", { lineHeight: "1.2", letterSpacing: "0.1em", fontWeight: "600" }]
                    }
                }
            }
        }
`;

const SITE_CSS = `
        html { scroll-behavior: smooth; }

        /* Superficie 0: grano volcánico sutil */
        body {
            background-color: #131313;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.025'/%3E%3C/svg%3E");
        }

        /* Bordes fantasma en lugar de sombras */
        .ghost-border { border: 1px solid rgba(246, 188, 105, 0.18); }

        /* Guía de puntos del menú clásico de bistró */
        .menu-dotted-leader {
            flex-grow: 1;
            border-bottom: 2px dotted rgba(223, 191, 190, 0.3);
            margin: 0 16px;
            position: relative;
            top: -6px;
        }

        .btn-press:active { transform: scale(0.98); }

        /* Foco visible y coherente para la navegación por teclado */
        a:focus-visible, button:focus-visible, input:focus-visible,
        select:focus-visible, textarea:focus-visible {
            outline: 2px solid #f6bc69;
            outline-offset: 3px;
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #131313; }
        ::-webkit-scrollbar-thumb { background: #353535; border-radius: 4px; }
`;

/** Prefijo relativo hasta la raíz del sitio (las páginas EN viven en /en/). */
const assets = (lang) => (lang === "es" ? "assets/" : "../assets/");

function buildHead(lang, title, description) {
  const a = assets(lang);
  return `<!DOCTYPE html>
<html class="dark" lang="${lang}">
<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>${title}</title>
<meta name="description" content="${description}">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script src="${a}tailwind.config.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&amp;family=Playfair+Display:wght@600;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="${a}site.css">
</head>
`;
}

/* ------------------------------------------------------------------------ */
/* Cabecera de navegación canónica                                           */
/* ------------------------------------------------------------------------ */
function buildHeader(lang, active) {
  const desktop = NAV_KEYS.map((key) => {
    const on = key === active;
    const cls = on
      ? "font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold border-b-2 border-primary pb-1"
      : "font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 border-b-2 border-transparent pb-1";
    return `<a class="${cls}" href="${href(key, lang)}"${on ? ' aria-current="page"' : ""}>${label(key, lang)}</a>`;
  }).join("\n");

  const mobile = NAV_KEYS.map((key) => {
    const on = key === active;
    const cls =
      "block py-3 px-3 rounded font-label-sm text-label-sm uppercase tracking-wider " +
      (on
        ? "text-primary font-bold bg-surface-container"
        : "text-on-surface-variant hover:text-primary hover:bg-surface-container/60 transition-colors");
    return `<a class="${cls}" href="${href(key, lang)}"${on ? ' aria-current="page"' : ""}>${label(key, lang)}</a>`;
  }).join("\n");

  const otherHref = hrefOtherLang(active, lang);
  const langSwitch =
    lang === "es"
      ? `<span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">ES</span>` +
        `<span class="text-outline-variant/60" aria-hidden="true">|</span>` +
        `<a class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors" href="${otherHref}" hreflang="en" aria-label="Switch to English">EN</a>`
      : `<a class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors" href="${otherHref}" hreflang="es" aria-label="Cambiar a español">ES</a>` +
        `<span class="text-outline-variant/60" aria-hidden="true">|</span>` +
        `<span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">EN</span>`;

  const t =
    lang === "es"
      ? { skip: "Saltar al contenido", nav: "Navegación principal", menu: "Abrir menú", cta: "Llamar ahora" }
      : { skip: "Skip to content", nav: "Main navigation", menu: "Open menu", cta: "Call now" };

  return `<a class="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-3 focus:left-3 focus:bg-primary-container focus:text-on-primary-container focus:px-4 focus:py-2 focus:rounded" href="#contenido">${t.skip}</a>
<!-- Cabecera -->
<header class="fixed top-0 left-0 right-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-outline-variant/30 transition-shadow duration-300" id="site-header">
<div class="flex justify-between items-center w-full px-grid-margin max-w-7xl mx-auto h-20 gap-4">
<a class="font-headline-md text-headline-md text-primary tracking-tight hover:text-secondary transition-colors shrink-0" href="${href("inicio", lang)}">Hermanos Moreno</a>
<nav class="hidden lg:flex items-center gap-6" aria-label="${t.nav}">
${desktop}
</nav>
<div class="flex items-center gap-3 shrink-0">
<div class="hidden sm:flex items-center gap-2 border-r border-outline-variant/30 pr-3">${langSwitch}</div>
<a class="btn-press hidden sm:inline-flex items-center justify-center bg-primary-container text-on-primary-container px-5 py-2 rounded font-label-sm text-label-sm uppercase tracking-wider hover:opacity-90 transition-opacity" href="${href("llamar", lang)}">${t.cta}</a>
<button aria-controls="mobile-menu" aria-expanded="false" aria-label="${t.menu}" class="lg:hidden text-primary p-2 -mr-2" id="menu-toggle" type="button">
<span class="material-symbols-outlined" id="menu-icon">menu</span>
</button>
</div>
</div>
<div class="hidden lg:hidden border-t border-outline-variant/30 bg-surface/95 backdrop-blur-md" id="mobile-menu">
<nav class="flex flex-col gap-1 px-grid-margin py-4 max-w-7xl mx-auto" aria-label="${t.nav}">
${mobile}
<a class="mt-3 block text-center bg-primary-container text-on-primary-container px-5 py-3 rounded font-label-sm text-label-sm uppercase tracking-wider" href="${href("llamar", lang)}">${t.cta}</a>
<div class="flex items-center justify-center gap-2 pt-4 sm:hidden">${langSwitch}</div>
</nav>
</div>
</header>
`;
}

/* ------------------------------------------------------------------------ */
/* Pie de página canónico                                                    */
/* ------------------------------------------------------------------------ */
function buildFooter(lang) {
  const t =
    lang === "es"
      ? {
          nav: "Navegación",
          contact: "Contacto",
          legal: "Legal",
          hoursTitle: "Horario",
          hours: "Martes a domingo, 13:00 – 23:00<br>Lunes cerrado",
          copy: "© 2024 Hermanos Moreno. Cocina tradicional canaria. Vega de San Mateo, Gran Canaria.",
          footerNav: "Enlaces del pie",
        }
      : {
          nav: "Navigation",
          contact: "Contact",
          legal: "Legal",
          hoursTitle: "Opening hours",
          hours: "Tuesday to Sunday, 1:00 pm – 11:00 pm<br>Closed on Mondays",
          copy: "© 2024 Hermanos Moreno. Traditional Canarian cuisine. Vega de San Mateo, Gran Canaria.",
          footerNav: "Footer links",
        };

  const linkCls = "font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors";
  const navLinks = ["inicio", "carta", "resenas", "como-llegar", "contacto", "llamar"]
    .map((k) => `<a class="${linkCls}" href="${href(k, lang)}">${label(k, lang)}</a>`)
    .join("\n");
  const legalLinks = ["aviso-legal", "privacidad"]
    .map((k) => `<a class="${linkCls}" href="${href(k, lang)}">${label(k, lang)}</a>`)
    .join("\n");

  return `<!-- Pie -->
<footer class="w-full bg-surface-container-lowest border-t border-outline-variant/20 mt-section-gap-desktop">
<div class="max-w-7xl mx-auto px-grid-margin py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-gutter">
<div class="flex flex-col gap-4">
<a class="font-headline-md text-headline-md text-primary hover:text-secondary transition-colors" href="${href("inicio", lang)}">Hermanos Moreno</a>
<p class="font-body-md text-body-md text-on-surface-variant opacity-80">${t.copy}</p>
</div>
<nav class="flex flex-col gap-2" aria-label="${t.footerNav}">
<h2 class="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-1">${t.nav}</h2>
${navLinks}
</nav>
<div class="flex flex-col gap-2">
<h2 class="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-1">${t.contact}</h2>
<a class="${linkCls}" href="${MAPS_URL}" target="_blank" rel="noopener noreferrer">${ADDRESS_LABEL[lang]}</a>
<a class="${linkCls}" href="${PHONE_HREF}">${PHONE_DISPLAY}</a>
<a class="${linkCls}" href="${WHATSAPP}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
</div>
<div class="flex flex-col gap-2">
<h2 class="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-1">${t.hoursTitle}</h2>
<p class="font-body-md text-body-md text-on-surface-variant">${t.hours}</p>
<div class="flex flex-col gap-2 pt-6">
<h2 class="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-1">${t.legal}</h2>
${legalLinks}
</div>
</div>
</div>
</footer>
`;
}

/* ------------------------------------------------------------------------ */
/* Script compartido: menú móvil, cabecera al hacer scroll, formularios      */
/* ------------------------------------------------------------------------ */
/** Etiqueta que enlaza el script compartido desde cada página. */
function buildScript(lang) {
  return `<script src="${assets(lang)}site.${lang}.js"></script>\n`;
}

/** Cuerpo del script compartido, que se escribe en assets/site.<lang>.js */
function siteScriptBody(lang) {
  const t =
    lang === "es"
      ? {
          locale: "es-ES",
          openMenu: "Abrir menú",
          closeMenu: "Cerrar menú",
          resTemplate:
            "Hola, me gustaría reservar mesa en Hermanos Moreno.\\n\\nNombre: {name}\\nTeléfono: {phone}\\nFecha y hora: {date}\\nComensales: {guests}",
          msgTemplate: "Hola, soy {name}.\\n\\n{message}",
        }
      : {
          locale: "en-GB",
          openMenu: "Open menu",
          closeMenu: "Close menu",
          resTemplate:
            "Hello, I would like to book a table at Hermanos Moreno.\\n\\nName: {name}\\nPhone: {phone}\\nDate and time: {date}\\nGuests: {guests}",
          msgTemplate: "Hello, my name is {name}.\\n\\n{message}",
        };

  return `(function () {
  var LOCALE = ${JSON.stringify(t.locale)};
  var WA = ${JSON.stringify(WHATSAPP)};
  var T = {
    openMenu: ${JSON.stringify(t.openMenu)},
    closeMenu: ${JSON.stringify(t.closeMenu)},
    resTemplate: "${t.resTemplate}",
    msgTemplate: "${t.msgTemplate}"
  };

  /* --- Menú móvil --- */
  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("mobile-menu");
  var icon = document.getElementById("menu-icon");
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.classList.toggle("hidden", !open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? T.closeMenu : T.openMenu);
      if (icon) icon.textContent = open ? "close" : "menu";
    };
    toggle.addEventListener("click", function () {
      setOpen(menu.classList.contains("hidden"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.classList.contains("hidden")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) setOpen(false);
    });
  }

  /* --- Sombra de la cabecera al desplazarse --- */
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      var scrolled = window.scrollY > 20;
      header.classList.toggle("shadow-lg", scrolled);
      header.classList.toggle("bg-background/95", scrolled);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var fill = function (tpl, data) {
    return tpl.replace(/\\{(\\w+)\\}/g, function (_, k) { return data[k] || ""; });
  };

  var showResult = function (box, text) {
    if (!box) return;
    var summary = box.querySelector("[data-summary]");
    var wa = box.querySelector("[data-whatsapp]");
    if (summary) summary.textContent = text;
    if (wa) wa.href = WA + "?text=" + encodeURIComponent(text);
    box.classList.remove("hidden");
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  /* --- Formulario de reserva --- */
  var resForm = document.getElementById("reservation-form");
  if (resForm) {
    resForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = document.getElementById("date").value;
      var when = raw;
      if (raw) {
        var d = new Date(raw);
        if (!isNaN(d.getTime())) {
          when = d.toLocaleString(LOCALE, {
            weekday: "long", day: "numeric", month: "long",
            hour: "2-digit", minute: "2-digit"
          });
        }
      }
      showResult(document.getElementById("reservation-result"), fill(T.resTemplate, {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        date: when,
        guests: document.getElementById("guests").value
      }));
    });
  }

  /* --- Formulario de mensaje --- */
  var msgForm = document.getElementById("contact-message-form");
  if (msgForm) {
    msgForm.addEventListener("submit", function (e) {
      e.preventDefault();
      showResult(document.getElementById("message-result"), fill(T.msgTemplate, {
        name: document.getElementById("msg-name").value.trim(),
        message: document.getElementById("msg-body").value.trim()
      }));
    });
  }
})();
`;
}

/** Recuadro de confirmación que aparece tras enviar un formulario. */
function resultBox(id, lang, intro, hint) {
  const waLabel = lang === "es" ? "Enviar por WhatsApp" : "Send via WhatsApp";
  const callLabel = (lang === "es" ? "Llamar " : "Call ") + PHONE_DISPLAY;
  return `<div class="hidden mt-8 rounded-xl border border-tertiary-container bg-surface-container-high p-6" id="${id}" role="status" aria-live="polite">
<p class="font-label-sm text-label-sm uppercase tracking-widest text-tertiary mb-3">${intro}</p>
<pre class="font-body-md text-body-md text-on-surface whitespace-pre-wrap mb-4" data-summary></pre>
<p class="font-body-md text-body-md text-on-surface-variant mb-5">${hint}</p>
<div class="flex flex-col sm:flex-row gap-3">
<a class="btn-press inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded font-label-sm text-label-sm uppercase tracking-wider" data-whatsapp href="${WHATSAPP}" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined text-[18px]">chat</span>${waLabel}</a>
<a class="btn-press inline-flex items-center justify-center gap-2 border border-secondary text-secondary px-6 py-3 rounded font-label-sm text-label-sm uppercase tracking-wider hover:bg-secondary/10 transition-colors" href="${PHONE_HREF}"><span class="material-symbols-outlined text-[18px]">call</span>${callLabel}</a>
</div>
</div>`;
}

/* ------------------------------------------------------------------------ */
/* Extracción del contenido de los diseños de Stitch                         */
/* ------------------------------------------------------------------------ */
function readSrc(folder) {
  return fs.readFileSync(path.join(SRC, folder, "code.html"), "utf8");
}

/** Devuelve el cuerpo del diseño, sin su cabecera ni su pie originales. */
function extractContent(html) {
  const foot = html.indexOf("<footer");
  if (foot === -1) throw new Error("el diseño no tiene <footer>");
  const region = html.slice(0, foot);

  let start = -1;
  for (const tag of ["</header>", "</nav>"]) {
    const i = region.lastIndexOf(tag);
    if (i !== -1) start = Math.max(start, i + tag.length);
  }
  if (start === -1) start = region.match(/<body[^>]*>/)[0].length + region.search(/<body[^>]*>/);

  let content = html.slice(start, foot).trim();
  // Quita el comentario que precedía al pie original (solo el del final)
  content = content.replace(/<!--(?:(?!-->)[\s\S])*?-->\s*$/, "").trim();
  // Los diseños llevan cableado el teléfono de ejemplo de Stitch
  content = content
    .split("tel:+34922000000").join(PHONE_HREF)
    .split("https://wa.me/34922000000").join(WHATSAPP)
    .split("+34 922 000 000").join(PHONE_DISPLAY);
  return content;
}

/** Sustituciones exactas; falla ruidosamente si alguna deja de encajar. */
function apply(content, pairs, page) {
  for (const [from, to] of pairs) {
    if (!content.includes(from)) {
      throw new Error(`[${page}] no se encontró el fragmento:\n  ${from.slice(0, 140)}`);
    }
    content = content.split(from).join(to);
  }
  return content;
}

function replaceOnce(content, re, to, page, what) {
  const out = content.replace(re, to);
  if (out === content) throw new Error(`[${page}] no se encontró ${what}`);
  return out;
}

/* ------------------------------------------------------------------------ */
/* Ensamblado                                                                */
/* ------------------------------------------------------------------------ */
function writePage(lang, key, title, description, content) {
  const dir = lang === "es" ? ROOT : OUT_EN;
  const bodyCls =
    "bg-background text-on-background font-body-md text-body-md min-h-screen flex flex-col " +
    "antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container";
  const html =
    buildHead(lang, title, description) +
    `<body class="${bodyCls}">\n` +
    buildHeader(lang, key) +
    `<div class="flex-grow" id="contenido">\n${content}\n</div>\n` +
    buildFooter(lang) +
    buildScript(lang) +
    "</body>\n</html>\n";
  fs.writeFileSync(path.join(dir, href(key, lang)), html, "utf8");
}

/* ------------------------------------------------------------------------ */
/* Inicio                                                                    */
/* ------------------------------------------------------------------------ */
function homeCard(lang, key, icon, desc) {
  return `<a class="group ghost-border rounded-lg bg-surface-container p-6 flex flex-col gap-3 hover:bg-surface-container-high transition-colors" href="${href(key, lang)}">
<span class="material-symbols-outlined text-secondary text-3xl" style="font-variation-settings: 'FILL' 1;">${icon}</span>
<h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">${label(key, lang)}</h3>
<p class="font-body-md text-body-md text-on-surface-variant">${desc}</p>
<span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary mt-auto pt-3 inline-flex items-center gap-1">${lang === "es" ? "Ver más" : "See more"}<span class="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span></span>
</a>`;
}

function buildHome(lang) {
  const src = lang === "es" ? "inicio_hermanos_moreno" : "landing_page_hermanos_moreno";
  let c = extractContent(readSrc(src));
  // El overlay de textura vive ahora en el CSS global
  c = c.replace(/<div class="texture-overlay[^"]*"[^>]*><\/div>\s*/g, "");

  const cards =
    lang === "es"
      ? [
          ["carta", "restaurant_menu", "Entrantes, guisos tradicionales y postres caseros, con sus precios."],
          ["resenas", "reviews", "Lo que cuentan quienes ya se han sentado a nuestras mesas."],
          ["como-llegar", "map", "Indicaciones desde Las Palmas y desde el sur, aparcamiento y accesos."],
          ["contacto", "event_available", "Reserva tu mesa o escríbenos con cualquier duda."],
        ]
      : [
          ["carta", "restaurant_menu", "Starters, slow-cooked stews and homemade desserts, with prices."],
          ["resenas", "reviews", "What the people who have already sat at our tables have to say."],
          ["como-llegar", "map", "Directions from Las Palmas and from the south, parking and access."],
          ["contacto", "event_available", "Book your table or write to us with any question."],
        ];

  const heading = lang === "es" ? "Todo lo que necesitas saber" : "Everything you need to know";
  const extra = `
<!-- Accesos rápidos -->
<section class="max-w-7xl mx-auto px-grid-margin py-section-gap-mobile md:py-section-gap-desktop">
<h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-secondary mb-10 text-center">${heading}</h2>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-gutter">
${cards.map(([k, i, d]) => homeCard(lang, k, i, d)).join("\n")}
</div>
</section>`;

  let title, desc;
  if (lang === "es") {
    c = apply(
      c,
      [
        ['href="#menu"', `href="${href("carta", lang)}"`],
        ['href="/contact"', `href="${href("como-llegar", lang)}"`],
      ],
      "index.html"
    );
    title = "Hermanos Moreno · Cocina canaria en Vega de San Mateo";
    desc =
      "Cocina casera canaria en el corazón de Vega de San Mateo, Gran Canaria. Carta, reseñas, cómo llegar y reservas.";
  } else {
    c = apply(
      c,
      [
        ['href="#menu"', `href="${href("carta", lang)}"`],
        ['href="/contact"', `href="${href("como-llegar", lang)}"`],
        ["⭐ 4,5 (604 reseñas en Google) • Precio medio: 10-20 €", "⭐ 4.5 (604 Google reviews) • Average price: €10–20"],
        [
          "Cocina casera canaria en el corazón de Vega de San Mateo",
          "Home-style Canarian cooking in the heart of Vega de San Mateo",
        ],
        ["Ver la carta", "View the menu"],
        ["Cómo llegar", "Get directions"],
      ],
      "en/index.html"
    );
    title = "Hermanos Moreno · Canarian cuisine in Vega de San Mateo";
    desc =
      "Home-style Canarian cooking in the heart of Vega de San Mateo, Gran Canaria. Menu, reviews, directions and bookings.";
  }

  writePage(lang, "inicio", title, desc, c + "\n" + extra);
}

/* ------------------------------------------------------------------------ */
/* Carta                                                                     */
/* ------------------------------------------------------------------------ */
function buildMenu(lang) {
  const src = lang === "es" ? "carta_hermanos_moreno_es" : "carta_hermanos_moreno";
  let c = extractContent(readSrc(src));

  const t =
    lang === "es"
      ? {
          lead: "¿Te has decidido? Reserva tu mesa y te la guardamos.",
          book: "Reservar mesa",
          call: "Llamar ahora",
          title: "Carta · Hermanos Moreno",
          desc: "Entrantes, platos tradicionales y postres canarios de Hermanos Moreno, en Vega de San Mateo.",
        }
      : {
          lead: "Made up your mind? Book a table and we will keep it for you.",
          book: "Book a table",
          call: "Call now",
          title: "Menu · Hermanos Moreno",
          desc: "Starters, traditional dishes and Canarian desserts at Hermanos Moreno, Vega de San Mateo.",
        };

  const cta = `
<!-- Llamada a la acción de la carta -->
<section class="text-center pt-8">
<p class="font-body-lg text-body-lg text-on-surface-variant mb-6">${t.lead}</p>
<div class="flex flex-col sm:flex-row gap-4 justify-center">
<a class="btn-press bg-primary-container text-on-primary-container px-8 py-3 rounded font-label-sm text-label-sm uppercase tracking-widest" href="${href("contacto", lang)}">${t.book}</a>
<a class="btn-press border border-secondary text-secondary px-8 py-3 rounded font-label-sm text-label-sm uppercase tracking-widest hover:bg-secondary/10 transition-colors" href="${href("llamar", lang)}">${t.call}</a>
</div>
</section>`;

  // Inserta la llamada a la acción dentro del contenedor de secciones de la carta
  c = c.trimEnd();
  if (!c.endsWith("</main>")) throw new Error("estructura inesperada en la carta");
  c = c.slice(0, -"</main>".length).trimEnd();
  if (!c.endsWith("</div>")) throw new Error("estructura inesperada en la carta");
  c = c.slice(0, -"</div>".length) + cta + "\n</div>\n</main>";

  writePage(lang, "carta", t.title, t.desc, c);
}

/* ------------------------------------------------------------------------ */
/* Reseñas                                                                   */
/* ------------------------------------------------------------------------ */
function buildReviews(lang) {
  const src = lang === "es" ? "rese_as_hermanos_moreno_es" : "rese_as_hermanos_moreno";
  let c = extractContent(readSrc(src));

  const t =
    lang === "es"
      ? {
          writeFrom: "Escribir una reseña",
          writeTo: "Escribir una reseña en Google",
          moreFrom: "Cargar más reseñas",
          moreTo: "Ver todas las reseñas en Google",
          title: "Reseñas · Hermanos Moreno",
          desc: "Opiniones de clientes de Hermanos Moreno, cocina tradicional canaria en Vega de San Mateo.",
        }
      : {
          writeFrom: "Write a Review",
          writeTo: "Write a review on Google",
          moreFrom: "Load More Reviews",
          moreTo: "See all reviews on Google",
          title: "Reviews · Hermanos Moreno",
          desc: "Diner reviews of Hermanos Moreno, traditional Canarian cooking in Vega de San Mateo.",
        };

  // Los dos botones no llevaban a ningún sitio: ahora abren la ficha de Google
  c = replaceOnce(
    c,
    new RegExp(`<button class="bg-primary-container([^"]*)">\\s*${t.writeFrom}\\s*</button>`),
    `<a class="btn-press inline-flex items-center justify-center gap-2 bg-primary-container$1" href="${REVIEWS_URL}" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined text-[18px]">rate_review</span>${t.writeTo}</a>`,
    `resenas/${lang}`,
    "el botón de escribir reseña"
  );
  c = replaceOnce(
    c,
    new RegExp(`<button class="bg-transparent([^"]*)">\\s*${t.moreFrom}\\s*</button>`),
    `<a class="btn-press inline-flex items-center justify-center gap-2 bg-transparent$1" href="${REVIEWS_URL}" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined text-[18px]">open_in_new</span>${t.moreTo}</a>`,
    `resenas/${lang}`,
    "el botón de cargar más reseñas"
  );
  if (c.includes("<button")) throw new Error(`[resenas/${lang}] quedan botones sin destino`);

  writePage(lang, "resenas", t.title, t.desc, c);
}

/* ------------------------------------------------------------------------ */
/* Contacto y reservas                                                       */
/* ------------------------------------------------------------------------ */
function buildContact(lang) {
  const src = lang === "es" ? "contacto_hermanos_moreno_es" : "contacto_hermanos_moreno";
  let c = extractContent(readSrc(src));

  // La calle del diseño era inventada (y situaba el local en Tenerife). Hasta tener
  // la dirección real, se enlaza la ficha de Google Maps del restaurante.
  c = replaceOnce(
    c,
    /Calle Volcán 12<br\/?>Santa Cruz de Tenerife, 38000/,
    `<a class="text-secondary hover:underline" href="${MAPS_URL}" target="_blank" rel="noopener noreferrer">${ADDRESS_LABEL[lang]}</a>`,
    `contacto/${lang}`,
    "el bloque de dirección"
  );

  const t =
    lang === "es"
      ? {
          submit: "Confirmar Reserva",
          maps: "Abrir en Google Maps",
          boxIntro: "Solicitud de reserva preparada",
          boxHint:
            "Todavía no está confirmada. Envíanosla por WhatsApp o llámanos y te la confirmamos al momento.",
          title: "Contacto y reservas · Hermanos Moreno",
          desc: "Reserva tu mesa en Hermanos Moreno o ponte en contacto por teléfono o WhatsApp.",
        }
      : {
          submit: "Confirm Reservation",
          maps: "Open in Google Maps",
          boxIntro: "Booking request ready",
          boxHint:
            "It is not confirmed yet. Send it to us on WhatsApp or give us a call and we will confirm right away.",
          title: "Contact and bookings · Hermanos Moreno",
          desc: "Book a table at Hermanos Moreno or get in touch by phone or WhatsApp.",
        };

  // El formulario ahora valida y prepara la solicitud
  c = replaceOnce(c, '<form class="space-y-6">', '<form class="space-y-6" id="reservation-form">', `contacto/${lang}`, "el formulario");
  for (const id of ["name", "phone", "date"]) {
    c = replaceOnce(c, `id="${id}"`, `id="${id}" required`, `contacto/${lang}`, `el campo ${id}`);
  }
  c = replaceOnce(
    c,
    new RegExp(`type="button">\\s*${t.submit}\\s*</button>`),
    `type="submit">${t.submit}</button>`,
    `contacto/${lang}`,
    "el botón de reserva"
  );
  c = replaceOnce(c, "</form>", "</form>\n" + resultBox("reservation-result", lang, t.boxIntro, t.boxHint), `contacto/${lang}`, "el cierre del formulario");

  // El mapa era una imagen inerte: ahora abre Google Maps
  c = replaceOnce(
    c,
    /(<div class="relative h-64 md:h-auto[^"]*">)(\s*)(<img )/,
    `$1$2<a class="block w-full h-full group" href="${MAPS_URL}" target="_blank" rel="noopener noreferrer" aria-label="${t.maps}">$3`,
    `contacto/${lang}`,
    "el contenedor del mapa"
  );
  c = replaceOnce(
    c,
    /(data-location="Tenerife"[^>]*\/?>)/,
    `$1\n<span class="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity"><span class="material-symbols-outlined text-[18px]">map</span>${t.maps}</span>\n</a>`,
    `contacto/${lang}`,
    "la imagen del mapa"
  );

  writePage(lang, "contacto", t.title, t.desc, c);
}

/* ------------------------------------------------------------------------ */
/* Cómo llegar                                                               */
/* ------------------------------------------------------------------------ */
// El diseño "en inglés" de Stitch traía el cuerpo todavía en español.
const DIRECTIONS_EN = [
  ["Cómo llegar a Hermanos Moreno", "How to find Hermanos Moreno"],
  [
    "Descubre el camino hacia nuestra casa. Situados en el corazón volcánico de Gran Canaria, te esperamos para compartir la auténtica tradición culinaria canaria.",
    "Find your way to our house. Set in the volcanic heart of Gran Canaria, we are waiting to share the real Canarian culinary tradition with you.",
  ],
  ['text-primary mb-2">Dirección</h3>', 'text-primary mb-2">Address</h3>'],
  ["Gran Canaria, España", "Gran Canaria, Spain"],
  ["                            Indicaciones", "                            Directions"],
  ["Desde Las Palmas", "From Las Palmas"],
  [
    "Toma la GC-3 hacia la carretera del Centro (GC-15). Continúa serpenteando por la montaña hasta llegar al casco histórico de San Mateo. Tiempo estimado: 35 minutos.",
    "Take the GC-3 towards the Carretera del Centro (GC-15), then keep winding up the mountain until you reach the old town of San Mateo. Estimated time: 35 minutes.",
  ],
  ["Desde el Sur", "From the South"],
  [
    "Sube por la GC-60 hacia San Bartolomé de Tirajana, y enlaza con la GC-15 hacia Cruz de Tejeda. Desciende hasta Vega de San Mateo disfrutando del paisaje volcánico.",
    "Head up the GC-60 towards San Bartolomé de Tirajana and join the GC-15 towards Cruz de Tejeda. Then come down into Vega de San Mateo enjoying the volcanic landscape.",
  ],
  ['text-on-surface">Aparcamiento</h4>', 'text-on-surface">Parking</h4>'],
  ["Zona de aparcamiento público gratuito a 50 metros del local.", "Free public parking 50 metres from the restaurant."],
  ['text-on-surface">Accesibilidad</h4>', 'text-on-surface">Accessibility</h4>'],
  ["Disponemos de ascensor para personas con movilidad reducida.", "There is a lift for guests with reduced mobility."],
  ["                            Abrir en Google Maps", "                            Open in Google Maps"],
];

function buildDirections(lang) {
  const src = lang === "es" ? "c_mo_llegar_hermanos_moreno_es" : "c_mo_llegar_hermanos_moreno";
  let c = extractContent(readSrc(src));

  let t;
  if (lang === "en") {
    c = apply(c, DIRECTIONS_EN, "en/directions.html");
    t = {
      title: "Directions · Hermanos Moreno",
      desc: "How to reach Hermanos Moreno in Vega de San Mateo, Gran Canaria: driving directions, parking and accessibility.",
      ctaText: "Now that you know the way, all that is left is to book.",
      ctaLabel: "Book a table",
    };
  } else {
    t = {
      title: "Cómo llegar · Hermanos Moreno",
      desc: "Cómo llegar a Hermanos Moreno en Vega de San Mateo, Gran Canaria: indicaciones, aparcamiento y accesibilidad.",
      ctaText: "Ya sabes el camino; solo queda reservar.",
      ctaLabel: "Reservar mesa",
    };
  }

  // La calle del diseño era inventada: hasta tener la real, se enlaza la ficha
  c = replaceOnce(
    c,
    /<p class="font-body-md text-body-md text-on-surface">Calle Volcán 12<\/p>\s*<p class="font-body-md text-body-md text-on-surface-variant">Vega de San Mateo, 35320<\/p>\s*<p class="font-body-md text-body-md text-on-surface-variant">Gran Canaria, (?:España|Spain)<\/p>/,
    `<p class="font-body-md text-body-md text-on-surface"><a class="text-secondary hover:underline" href="${MAPS_URL}" target="_blank" rel="noopener noreferrer">${ADDRESS_LABEL[lang]}</a></p>`,
    `como-llegar/${lang}`,
    "el bloque de dirección"
  );

  // El botón sobre el mapa apuntaba a "#"
  c = replaceOnce(
    c,
    /(<a class="bg-primary-container text-on-primary-container px-6 py-3 rounded-full[^"]*") href="#">/,
    `$1 href="${DIRECTIONS_URL}" target="_blank" rel="noopener noreferrer">`,
    `como-llegar/${lang}`,
    "el botón de Google Maps"
  );

  const cta = `
<section class="px-grid-margin max-w-7xl mx-auto pb-section-gap-mobile md:pb-section-gap-desktop text-center">
<p class="font-body-lg text-body-lg text-on-surface-variant mb-6">${t.ctaText}</p>
<a class="btn-press inline-block bg-primary-container text-on-primary-container px-8 py-3 rounded font-label-sm text-label-sm uppercase tracking-widest" href="${href("contacto", lang)}">${t.ctaLabel}</a>
</section>`;

  c = c.trimEnd();
  if (!c.endsWith("</main>")) throw new Error("estructura inesperada en cómo llegar");
  c = c.slice(0, -"</main>".length) + cta + "\n</main>";

  writePage(lang, "como-llegar", t.title, t.desc, c);
}

/* ------------------------------------------------------------------------ */
/* Llamar ahora                                                              */
/* ------------------------------------------------------------------------ */
const CALL_EN = [
  ["¿Tienes hambre? Reserva tu mesa", "Hungry? Book your table"],
  ['<span class="font-headline-md text-headline-md">Llamar ahora</span>', '<span class="font-headline-md text-headline-md">Call now</span>'],
  ['<span class="font-label-sm text-label-sm uppercase">Mensaje</span>', '<span class="font-label-sm text-label-sm uppercase">Message</span>'],
  [
    '<span class="font-label-sm text-label-sm uppercase tracking-widest">Horario</span>',
    '<span class="font-label-sm text-label-sm uppercase tracking-widest">Opening hours</span>',
  ],
  ["Abrimos de Martes a Domingo", "Open Tuesday to Sunday"],
  ["de 13:00 a 23:00", "1:00 pm – 11:00 pm"],
  ["Envíanos un mensaje", "Send us a message"],
  ['placeholder="Tu nombre"', 'placeholder="Your name"'],
  ['placeholder="¿En qué podemos ayudarte?"', 'placeholder="How can we help?"'],
  ["                    Enviar mensaje ", "                    Send message "],
];

function buildCall(lang) {
  const src = lang === "es" ? "llamar_ahora_hermanos_moreno_es" : "llamar_ahora_hermanos_moreno";
  let c = extractContent(readSrc(src));

  let t;
  if (lang === "en") {
    c = apply(c, CALL_EN, "en/call.html");
    t = {
      submit: "Send message",
      book: "Book online",
      placeholder: "Your name",
      boxIntro: "Message ready",
      boxHint: "Send it on WhatsApp and we will get back to you as soon as possible.",
      title: "Call us · Hermanos Moreno",
      desc: "Call Hermanos Moreno, message us on WhatsApp or send us a note. Vega de San Mateo, Gran Canaria.",
    };
  } else {
    t = {
      submit: "Enviar mensaje",
      book: "Reservar online",
      placeholder: "Tu nombre",
      boxIntro: "Mensaje preparado",
      boxHint: "Envíalo por WhatsApp y te respondemos lo antes posible.",
      title: "Llamar ahora · Hermanos Moreno",
      desc: "Llama a Hermanos Moreno, escríbenos por WhatsApp o mándanos un mensaje. Vega de San Mateo, Gran Canaria.",
    };
  }

  // El botón que baja al formulario carecía de type
  c = replaceOnce(
    c,
    ` onclick="document.getElementById('message-form')`,
    ` type="button" onclick="document.getElementById('message-form')`,
    `llamar/${lang}`,
    "el botón que baja al formulario"
  );

  // Deja hueco bajo la cabecera fija
  c = replaceOnce(
    c,
    "py-section-gap-mobile md:py-section-gap-desktop w-full max-w-lg",
    "pt-32 pb-section-gap-mobile md:pb-section-gap-desktop w-full max-w-lg",
    `llamar/${lang}`,
    "el relleno superior del contenido"
  );

  // Tercer acceso rápido: la página de reservas
  const booking = `<a class="flex-1 btn-press flex items-center justify-center gap-3 py-4 px-6 rounded border border-outline-variant/50 bg-surface/50 backdrop-blur-sm text-on-surface hover:border-secondary hover:text-secondary transition-colors duration-200" href="${href("contacto", lang)}"><span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">event_available</span><span class="font-label-sm text-label-sm uppercase">${t.book}</span></a>`;
  c = replaceOnce(
    c,
    /(<\/button>\s*)(<\/div>\s*<!-- Quick Info -->)/,
    (_m, a, b) => a + booking + "\n" + b,
    `llamar/${lang}`,
    "el bloque de acciones secundarias"
  );

  // Formulario de mensaje funcional
  c = replaceOnce(c, '<form class="space-y-6">', '<form class="space-y-6" id="contact-message-form">', `llamar/${lang}`, "el formulario");
  c = replaceOnce(
    c,
    `placeholder="${t.placeholder}" type="text"`,
    `id="msg-name" name="name" required placeholder="${t.placeholder}" type="text"`,
    `llamar/${lang}`,
    "el campo de nombre"
  );
  c = replaceOnce(c, /(<textarea class="[^"]*")/, '$1 id="msg-body" name="message" required', `llamar/${lang}`, "el campo de mensaje");
  c = replaceOnce(
    c,
    new RegExp(`type="button">\\s*${t.submit}`),
    `type="submit">${t.submit}`,
    `llamar/${lang}`,
    "el botón de enviar mensaje"
  );
  c = replaceOnce(c, "</form>", "</form>\n" + resultBox("message-result", lang, t.boxIntro, t.boxHint), `llamar/${lang}`, "el cierre del formulario");

  writePage(lang, "llamar", t.title, t.desc, c);
}

/* ------------------------------------------------------------------------ */
/* Páginas legales (generadas: no existen en los diseños de Stitch)          */
/* ------------------------------------------------------------------------ */
const LEGAL = {
  es: {
    notice:
      "Plantilla pendiente de completar con los datos fiscales reales del establecimiento antes de publicar el sitio.",
    "aviso-legal": {
      lead: "Información sobre la titularidad de este sitio web, conforme a la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico.",
      blocks: [
        ["Titular del sitio", `Razón social: <em>pendiente de completar</em><br>NIF: <em>pendiente de completar</em><br>Domicilio: ${ADDRESS_LEGAL.es}<br>Teléfono: ${PHONE_DISPLAY}`],
        ["Objeto", "Este sitio web ofrece información sobre el restaurante Hermanos Moreno: su carta, su ubicación, su horario y sus vías de contacto. No se realizan ventas ni cobros a través de la web."],
        ["Propiedad intelectual", "Los textos, las fotografías y el diseño de este sitio pertenecen a sus respectivos titulares. Queda prohibida su reproducción sin autorización previa."],
        ["Responsabilidad", "El titular no se responsabiliza del uso que terceros puedan hacer de la información publicada, ni de los contenidos de los sitios externos enlazados desde esta web."],
        ["Legislación aplicable", "Esta relación se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales de Las Palmas de Gran Canaria."],
      ],
    },
    privacidad: {
      lead: "Cómo tratamos los datos personales que nos facilitas a través de este sitio web, conforme al Reglamento (UE) 2016/679 (RGPD).",
      blocks: [
        ["Responsable del tratamiento", `Hermanos Moreno<br>${ADDRESS_LEGAL.es}<br>Teléfono: ${PHONE_DISPLAY}<br>Correo de contacto: <em>pendiente de completar</em>`],
        ["Datos que recogemos", "Los formularios de esta web no envían datos a ningún servidor: lo que escribes se usa únicamente en tu propio navegador para redactar un mensaje de WhatsApp o una llamada que decides enviar tú. Si nos escribes por WhatsApp o nos llamas, trataremos tu nombre, tu número y los datos de tu reserva."],
        ["Finalidad y base jurídica", "Gestionar tu reserva o responder a tu consulta. La base jurídica es tu consentimiento y las gestiones previas a la prestación del servicio."],
        ["Conservación", "Conservamos los datos de la reserva el tiempo imprescindible para atenderla y, después, durante los plazos legales que resulten aplicables."],
        ["Tus derechos", "Puedes solicitar el acceso, la rectificación, la supresión, la limitación, la portabilidad y la oposición al tratamiento de tus datos escribiéndonos a la dirección indicada arriba. También puedes reclamar ante la Agencia Española de Protección de Datos."],
        ["Cookies y servicios de terceros", "Este sitio no instala cookies propias de analítica ni de publicidad. Carga tipografías e imágenes desde servidores de Google, y los enlaces a Google Maps y a WhatsApp te llevan a servicios de terceros con sus propias políticas de privacidad."],
      ],
    },
  },
  en: {
    notice:
      "Template pending completion with the establishment's real registration details before the site goes live.",
    "aviso-legal": {
      lead: "Information about the ownership of this website, under Spanish Law 34/2002 on information society services and electronic commerce.",
      blocks: [
        ["Site owner", `Registered name: <em>to be completed</em><br>Tax ID: <em>to be completed</em><br>Address: ${ADDRESS_LEGAL.en}<br>Phone: ${PHONE_DISPLAY}`],
        ["Purpose", "This website provides information about the Hermanos Moreno restaurant: its menu, location, opening hours and contact channels. No sales or payments are processed through the site."],
        ["Intellectual property", "The texts, photographs and design of this site belong to their respective owners. Reproduction without prior authorisation is prohibited."],
        ["Liability", "The owner is not responsible for the use third parties may make of the information published here, nor for the contents of external sites linked from this website."],
        ["Applicable law", "This relationship is governed by Spanish law. The courts of Las Palmas de Gran Canaria shall have jurisdiction over any dispute."],
      ],
    },
    privacidad: {
      lead: "How we handle the personal data you provide through this website, under Regulation (EU) 2016/679 (GDPR).",
      blocks: [
        ["Data controller", `Hermanos Moreno<br>${ADDRESS_LEGAL.en}<br>Phone: ${PHONE_DISPLAY}<br>Contact email: <em>to be completed</em>`],
        ["What we collect", "The forms on this site do not send data to any server: what you type is used only in your own browser to draft a WhatsApp message or a phone call that you choose to send. If you contact us by WhatsApp or phone, we will process your name, number and booking details."],
        ["Purpose and legal basis", "To manage your booking or answer your enquiry. The legal basis is your consent and the steps taken prior to providing the service."],
        ["Retention", "We keep booking data only as long as needed to handle it and, afterwards, for any applicable statutory periods."],
        ["Your rights", "You may request access, rectification, erasure, restriction, portability and objection to the processing of your data by writing to the address above. You may also lodge a complaint with the Spanish Data Protection Agency."],
        ["Cookies and third-party services", "This site sets no analytics or advertising cookies of its own. It loads fonts and images from Google servers, and the Google Maps and WhatsApp links take you to third-party services with their own privacy policies."],
      ],
    },
  },
};

function buildLegal(lang) {
  for (const kind of ["aviso-legal", "privacidad"]) {
    const data = LEGAL[lang][kind];
    const sections = data.blocks
      .map(
        ([h, b]) => `<section class="mb-10">
<h2 class="font-headline-md text-headline-md text-secondary mb-3">${h}</h2>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">${b}</p>
</section>`
      )
      .join("\n");

    const content = `<main class="pt-32 pb-section-gap-mobile md:pb-section-gap-desktop px-grid-margin max-w-3xl mx-auto w-full">
<h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-xl md:text-headline-xl text-primary mb-4">${label(kind, lang)}</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant mb-8">${data.lead}</p>
<p class="ghost-border rounded-lg bg-surface-container p-4 font-body-md text-body-md text-secondary mb-12">${LEGAL[lang].notice}</p>
${sections}
</main>`;

    writePage(
      lang,
      kind,
      `${label(kind, lang)} · Hermanos Moreno`,
      lang === "es" ? "Información legal de Hermanos Moreno." : "Legal information for Hermanos Moreno.",
      content
    );
  }
}

/* ------------------------------------------------------------------------ */
/* Main                                                                      */
/* ------------------------------------------------------------------------ */
function main() {
  if (!fs.existsSync(SRC)) throw new Error("No se encuentra la carpeta de diseños: " + SRC);
  fs.mkdirSync(OUT_EN, { recursive: true });

  // Recursos compartidos por las 16 páginas: se sirven una vez y se cachean,
  // en lugar de repetirse dentro de cada HTML.
  const assetsDir = path.join(ROOT, "assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.writeFileSync(path.join(assetsDir, "tailwind.config.js"), TAILWIND_CONFIG.trim() + "\n", "utf8");
  fs.writeFileSync(path.join(assetsDir, "site.css"), SITE_CSS.trim() + "\n", "utf8");
  for (const lang of ["es", "en"]) {
    fs.writeFileSync(path.join(assetsDir, `site.${lang}.js`), siteScriptBody(lang), "utf8");
  }

  for (const lang of ["es", "en"]) {
    buildHome(lang);
    buildMenu(lang);
    buildReviews(lang);
    buildContact(lang);
    buildDirections(lang);
    buildCall(lang);
    buildLegal(lang);
  }

  console.log("Sitio generado:");
  for (const lang of ["es", "en"]) {
    for (const key of ALL_KEYS) {
      console.log("  " + (lang === "es" ? "" : "en/") + href(key, lang));
    }
  }
}

main();
