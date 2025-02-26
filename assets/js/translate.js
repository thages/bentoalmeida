const whatsappMessages = {
  en: "Hello! I would like to get more information about the services and consulting offered.",
  pt: "Olá! Gostaria de obter mais informações sobre os serviços e consultorias oferecidos.",
  es: "¡Hola! Me gustaría obtener más información sobre los servicios y consultorías ofrecidos.",
  fr: "Bonjour ! J’aimerais en savoir plus sur les services et les conseils offerts.",
  de: "Hallo! Ich würde gerne mehr über die angebotenen Dienstleistungen und Beratungen erfahren.",
  it: "Ciao! Vorrei avere maggiori informazioni sui servizi e sulla consulenza offerti.",
};

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
}

function updateWhatsappMessage(lang) {
  const message = encodeURIComponent(whatsappMessages[lang]);

  const whatsappNumber = "5545991580812";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  document.getElementById("whatsapp-link").href = whatsappLink;
}

window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("preferredLanguage") || "en";

  updateLanguage(savedLang);

  const matchingLi = document.querySelector(`li[data-value="${savedLang}"]`);
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
const searchInput = document.getElementById("lang-search");

toggleBtn.addEventListener("click", () => {
  menuDropdown.classList.toggle("open");
});

closeBtn.addEventListener("click", () => {
  menuDropdown.classList.remove("open");
});

langList.addEventListener("click", (e) => {
  let clickedLi = e.target.closest("li");
  if (clickedLi && clickedLi.dataset.country) {
    [...langList.querySelectorAll("li[data-country]")].forEach((li) =>
      li.classList.remove("active")
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

// searchInput.addEventListener("input", (e) => {
//   const term = e.target.value.toLowerCase();
//   const items = langList.querySelectorAll("li[data-country]");
//   items.forEach((li) => {
//     const country = li.dataset.country.toLowerCase();
//     const lang = li.dataset.lang.toLowerCase();

//     if (country.includes(term) || lang.includes(term)) {
//       li.style.display = "";
//     } else {
//       li.style.display = "none";
//     }
//   });
// });

document.addEventListener("click", (evt) => {
  let targetEl = evt.target;
  if (!menuDropdown.contains(targetEl) && !toggleBtn.contains(targetEl)) {
    menuDropdown.classList.remove("open");
  }
});
