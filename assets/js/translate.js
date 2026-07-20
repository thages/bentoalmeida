const whatsappMessages = {
  en: "Hi! I'd like to book an operations diagnostic and understand how you could help my business.",
  pt: "Olá! Gostaria de agendar um diagnóstico operacional e entender como vocês podem ajudar minha empresa.",
  es: "¡Hola! Me gustaría agendar un diagnóstico operativo y entender cómo pueden ayudar a mi empresa.",
  fr: "Bonjour ! J'aimerais planifier un diagnostic opérationnel et comprendre comment vous pourriez aider mon entreprise.",
  de: "Hallo! Ich würde gerne ein Betriebs-Diagnosegespräch vereinbaren und verstehen, wie Sie meinem Unternehmen helfen können.",
  it: "Ciao! Vorrei prenotare una diagnosi operativa e capire come potreste aiutare la mia azienda.",
};

const WHATSAPP_LINK_IDS = [
  "whatsapp-link",
  "whatsapp-link-2",
  "whatsapp-link-3",
];

function updateLanguage(lang) {
  updateWhatsappMessage(lang);

  for (const id in translations[lang]) {
    if (Object.hasOwn(translations[lang], id)) {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = translations[lang][id];
      }

      const inputEl = document.querySelector(`[name="${id}"]`);
      if (inputEl && inputEl.placeholder !== undefined) {
        inputEl.placeholder = translations[lang][id];
      }
    }
  }

  document.documentElement.setAttribute("lang", lang);
}

function updateWhatsappMessage(lang) {
  const message = encodeURIComponent(
    whatsappMessages[lang] || whatsappMessages.en,
  );
  const whatsappNumber = "595984455760";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  WHATSAPP_LINK_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.href = whatsappLink;
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get("lang");

  const supportedLangs = ["es", "pt", "en"];
  const savedLang = localStorage.getItem("preferredLanguage");

  const lang = supportedLangs.includes(urlLang)
    ? urlLang
    : supportedLangs.includes(savedLang)
      ? savedLang
      : "en";

  updateLanguage(lang);

  const matchingLi = document.querySelector(`li[data-value="${lang}"]`);
  if (matchingLi) {
    matchingLi.classList.add("active");
    document.querySelector(".selected-country").textContent =
      matchingLi.dataset.country;
    document.querySelector(".selected-lang").textContent =
      matchingLi.dataset.lang;
  }
});

const toggleBtn = document.getElementById("lang-menu-toggle");
const menuDropdown = document.getElementById("lang-menu-dropdown");
const closeBtn = document.getElementById("lang-menu-close");
const langList = document.getElementById("lang-list");

if (toggleBtn && menuDropdown) {
  toggleBtn.addEventListener("click", () => {
    menuDropdown.classList.toggle("open");
  });
}

if (closeBtn && menuDropdown) {
  closeBtn.addEventListener("click", () => {
    menuDropdown.classList.remove("open");
  });
}

if (langList) {
  langList.addEventListener("click", (e) => {
    let clickedLi = e.target.closest("li");
    if (clickedLi && clickedLi.dataset.country) {
      [...langList.querySelectorAll("li[data-country]")].forEach((li) =>
        li.classList.remove("active"),
      );

      clickedLi.classList.add("active");

      document.querySelector(".selected-country").textContent =
        clickedLi.dataset.country;
      document.querySelector(".selected-lang").textContent =
        clickedLi.dataset.lang;

      const selectedLang = clickedLi.dataset.value;
      localStorage.setItem("preferredLanguage", selectedLang);
      updateLanguage(selectedLang);

      menuDropdown.classList.remove("open");
    }
  });
}

document.addEventListener("click", (evt) => {
  let targetEl = evt.target;
  if (
    menuDropdown &&
    toggleBtn &&
    !menuDropdown.contains(targetEl) &&
    !toggleBtn.contains(targetEl)
  ) {
    menuDropdown.classList.remove("open");
  }
});
