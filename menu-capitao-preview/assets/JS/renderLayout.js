/* renderLayout.js (ES‑module) */
import { menuData } from "./menuData.js";

const modal = document.getElementById("itemModal");
const cartBtn = document.getElementById("cartBtn");
const drawer = document.getElementById("cartDrawer");

let currentItem = null; // item exibido no modal
let modalQty = 1;
const cart = []; // [{p, qty} ...]

/* util: abre/fecha */
const openModal = () => modal.classList.remove("hidden");
const closeModal = () => modal.classList.add("hidden");
const openDrawer = () => drawer.classList.remove("translate-x-full");
const closeDrawer = () => drawer.classList.add("translate-x-full");

/* util: adiciona item */
function addToCart(item, qty) {
  const idx = cart.findIndex((c) => c.p.name === item.name);
  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ p: item, qty });
  updateCartUI();
}

/* atualiza badge, lista e total */
function updateCartUI() {
  // badge
  const totalQty = cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById("cartCount").textContent = totalQty;

  // lista
  const list = document.getElementById("cartItems");
  list.innerHTML = "";
  let totalPYG = 0;
  cart.forEach(({ p, qty }) => {
    totalPYG += p.price * qty;
    list.innerHTML += `
      <div class="flex justify-between">
        <span>${qty}× ${p.name}</span>
        <span>${fmt(p.price * qty)}</span>
      </div>`;
  });

  document.getElementById("cartTotal").textContent = fmt(totalPYG);

  /* link WhatsApp */
  const message =
    "*Pedido:*%0A" +
    cart.map(({ p, qty }) => `• ${qty}× ${p.name}`).join("%0A") +
    `%0A*Total:* ${fmt(totalPYG)}`;

  const phone = "5500000000000"; // ← coloque seu número com DDI/DD
  document.getElementById(
    "whatsLink"
  ).href = `https://wa.me/${phone}?text=${message}`;
}

/* listeners do modal */
document.getElementById("closeModal").onclick = closeModal;
document.getElementById("minusQty").onclick = () => {
  if (modalQty > 1) document.getElementById("qty").textContent = --modalQty;
};
document.getElementById("plusQty").onclick = () => {
  document.getElementById("qty").textContent = ++modalQty;
};
document.getElementById("addToCart").onclick = () => {
  addToCart(currentItem, modalQty);
  closeModal();
};

/* listeners do drawer/carrinho */
cartBtn.onclick = openDrawer;
document.getElementById("closeDrawer").onclick = closeDrawer;

/* ──────────────────────
 * 1. Configuração global
 * ──────────────────────*/
let selectedCurrency = "PYG"; // PYG é a moeda base
// const exchangeRates = { BRL: 1, USD: 0.2, PYG: 1450 }; // fallback
const exchangeRates = {
  PYG: 1, // base
  BRL: 0.00072, // ≈ BRL por PYG
  USD: 0.00014, // ≈ USD por PYG
};

/* ──────────────────────
 * 2. Taxas de câmbio
 * ──────────────────────*/
// async function loadRates() {
//   try {
//     const usd = await fetch(
//       "https://economia.awesomeapi.com.br/json/last/USD-BRL"
//     ).then((r) => r.json());
//     exchangeRates.USD = 1 / parseFloat(usd.USDBRL.bid);

//     const pyg = await fetch(
//       "https://economia.awesomeapi.com.br/json/last/PYG-BRL"
//     ).then((r) => r.json());
//     exchangeRates.PYG = 1 / parseFloat(pyg.PYGBRL.bid);
//   } catch (err) {
//     console.error("⚠️  Currency API error, using fallback:", err);
//   }
// }

async function loadRates() {
  try {
    // ①  BRL ↔︎ USD
    const usdBrl = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL"
    ).then((r) => r.json());
    const brlPerUsd = parseFloat(usdBrl.USDBRL.bid); //  ex.: 5.50

    // ②  BRL ↔︎ PYG
    const pygBrl = await fetch(
      "https://economia.awesomeapi.com.br/json/last/PYG-BRL"
    ).then((r) => r.json());
    const brlPerPyg = parseFloat(pygBrl.PYGBRL.bid); //  ex.: 0.00072

    /*────────────  fatores PYG → moeda  ────────────*/
    exchangeRates.PYG = 1; // identidade
    exchangeRates.BRL = brlPerPyg; // 1 PYG = 0.00072 BRL
    exchangeRates.USD = brlPerPyg / brlPerUsd; // PYG→BRL→USD
  } catch (err) {
    console.error("Currency API error (using fallbacks):", err);
  }
}

/* ──────────────────────
 * 3. Formatação
 * ──────────────────────*/
// function localeFor(currency) {
//   switch (currency) {
//     case "USD":
//       return "en-US";
//     case "PYG":
//       return "es-PY";
//     default:
//       return "pt-BR";
//   }
// }

// function priceBRLtoSelected(valueBRL) {
//   return valueBRL * exchangeRates[selectedCurrency];
// }

// function fmt(valueBRL) {
//   return new Intl.NumberFormat(localeFor(selectedCurrency), {
//     style: "currency",
//     currency: selectedCurrency,
//     minimumFractionDigits: selectedCurrency === "PYG" ? 0 : 2,
//   }).format(priceBRLtoSelected(valueBRL));
// }

function pricePYGtoSelected(valuePYG) {
  return valuePYG * exchangeRates[selectedCurrency];
}

function localeFor(curr) {
  return curr === "USD" ? "en-US" : curr === "BRL" ? "pt-BR" : "es-PY"; // PYG
}

function fmt(valuePYG) {
  return new Intl.NumberFormat(localeFor(selectedCurrency), {
    style: "currency",
    currency: selectedCurrency,
    minimumFractionDigits: selectedCurrency === "PYG" ? 0 : 2,
  }).format(pricePYGtoSelected(valuePYG));
}

/* ──────────────────────
 * 4. Filtros (categoria / busca)
 * ──────────────────────*/
const categoryFilter = document.getElementById("categoryFilter");

const categoriesFlat = menuData.flatMap((item) => Object.keys(item));

categoriesFlat.forEach((category) => {
  const opt = document.createElement("option");
  opt.text = category;
  categoryFilter.append(opt);
});

categoryFilter.addEventListener("change", renderMenu);
document.getElementById("searchInput").addEventListener("input", renderMenu);

/* ──────────────────────
 * 5. Render principal
 * ──────────────────────*/
function renderMenu() {
  const sel = categoryFilter.value;
  const query = document.getElementById("searchInput").value.toLowerCase();
  const root = document.getElementById("menu");
  root.innerHTML = "";

  menuData.forEach((raw) => {
    const cat =
      "categoryName" in raw
        ? raw
        : { categoryName: Object.keys(raw)[0], ...raw[Object.keys(raw)[0]] };

    /* agora cat.categoryName, cat.layout, cat.products existem */
    if (sel !== "Todos los platos" && sel !== cat.categoryName) return;

    const productsShown = cat.products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description || "").toLowerCase().includes(query)
    );
    if (!productsShown.length) return;

    root.append(
      cat.layout === "list"
        ? renderListCategory(cat.categoryName, productsShown)
        : renderGridCategory(cat.categoryName, productsShown)
    );
  });
}

/* ──────────────────────
 * 6. Helpers HTML
 * ──────────────────────*/
const headerHtml = (n) =>
  `<h2 class="text-2xl font-normal mb-4 mt-8 font-[Heveltica:sans]">${n}</h2>`;
//   `<h2 class="text-2xl font-semibold mb-4 mt-8 border-b-4 border-yellow-500">${n}</h2>`;

/* LISTA (2 col.) */
function renderListCategory(name, products) {
  const section = document.createElement("section");
  section.innerHTML = headerHtml(name);

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-fr";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className =
      "flex bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-full p-3 cursor-pointer hover:shadow-md";

    /* texto */
    card.innerHTML = `
      <div class="flex flex-col flex-1 pr-6">
        <h3 class="font-[Heveltica:sans] text-lg font-light mb-1">${p.name}</h3>
        <p class="text-gray-400 text-sm font-[Heveltica:sans] font-extralight
 mb-3">${p.description || ""}</p>
        <span class="font-[Heveltica:sans] font-light mt-auto">${fmt(
          p.price
        )}</span>
      </div>
    `;

    /* imagem */
    const img = document.createElement("img");
    img.src = `${
      p.image ||
      "https://via.placeholder.com/400x300?text=" + encodeURIComponent(p.name)
    }`;
    img.alt = "";
    img.className = "w-32 md:w-32 lg:w-44 lg:h-32 object-cover flex-shrink-0";
    card.append(img);

    card.onclick = () => {
      /* 1. popula modal */
      currentItem = p;
      modalQty = 1;
      document.getElementById("modalImg").src = `${
        p.image ||
        "https://via.placeholder.com/400x300?text=" + encodeURIComponent(p.name)
      }`;
      document.getElementById("modalName").textContent = p.name;
      document.getElementById("modalDesc").textContent = p.description || "";
      document.getElementById("modalPrice").textContent = fmt(p.price);
      document.getElementById("qty").textContent = 1;

      /* 2. abre */
      openModal();
    };

    grid.append(card);
  });

  section.append(grid);
  return section;
}

/* GRADE (3 col.) */
function renderGridCategory(name, products) {
  const section = document.createElement("section");
  section.innerHTML = headerHtml(name);

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow overflow-hidden";

    card.innerHTML = `
      <div class="h-40 bg-gray-200">
        <img src="https://via.placeholder.com/400x300?text=${encodeURIComponent(
          p.name
        )}"
             class="w-full h-full object-cover" alt="">
      </div>
      <div class="p-4">
        <div class="flex justify-between items-center mb-2">
          <span class="font-semibold">${p.name}</span>
          <span>${fmt(p.price)}</span>
        </div>
        <p class="text-gray-600 text-sm">${p.description || ""}</p>
      </div>
    `;
    grid.append(card);
  });

  section.append(grid);
  return section;
}

/* ──────────────────────
 * 7. Evento: trocar moeda
 * ──────────────────────*/
document
  .getElementById("currencySelector")
  .addEventListener("change", async (e) => {
    selectedCurrency = e.target.value;
    await loadRates(); // busca novas taxas (opcionalmente pode armazenar cache/horário)
    renderMenu();
  });

/* ──────────────────────
 * 8. Primeira carga
 * ──────────────────────*/
document.addEventListener("DOMContentLoaded", async () => {
  await loadRates(); // obtém taxas reais antes do 1º render
  renderMenu();
});
