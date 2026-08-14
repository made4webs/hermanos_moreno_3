(function () {
  var LOCALE = "en-GB";
  var WA = "https://wa.me/34606888002";
  var T = {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    resTemplate: "Hello, I would like to book a table at Hermanos Moreno.\n\nName: {name}\nPhone: {phone}\nDate and time: {date}\nGuests: {guests}",
    msgTemplate: "Hello, my name is {name}.\n\n{message}"
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
    return tpl.replace(/\{(\w+)\}/g, function (_, k) { return data[k] || ""; });
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
