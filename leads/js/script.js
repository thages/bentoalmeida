// Default language
let currentLanguage = "es";

const coverImages = {
  0: "url('./assets/cover.jpg')", // optional cover image
  1: "url('./assets/cover-step-1.jpg')",
  2: "url('./assets/cover-step-2.jpg')",
  3: "url('./assets/cover-step-3.jpg')",
  4: "url('./assets/cover-step-4.jpg')",
  5: "url('./assets/cover-step-5.jpg')",
  6: "url('./assets/cover-step-6.jpg')", // optional success screen
};

document.addEventListener("DOMContentLoaded", () => {
  updateCover(0);
  updateLanguage(currentLanguage);
});

let current = "A";

function updateCover(stepNumber) {
  const next = current === "A" ? "B" : "A";
  const currentCover = document.getElementById(`cover${current}`);
  const nextCover = document.getElementById(`cover${next}`);
  const image = coverImages[stepNumber] || coverImages[1];

  // Set new image on the next layer
  nextCover.style.backgroundImage = image;

  // Fade in next layer, fade out current
  nextCover.classList.add("active");
  currentCover.classList.remove("active");

  // Swap current layer reference
  current = next;
}

// function updateCover(stepNumber) {
//   const cover = document.getElementById("cover");
//   const img = coverImages[stepNumber] || coverImages[1]; // fallback
//   cover.style.backgroundImage = img;
// }

// Function to update all text based on language
function updateLanguage(lang) {
  currentLanguage = lang;

  // Update all text elements
  document.querySelectorAll(".language-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });

  // Update tagline
  document.querySelector(".tagline").textContent =
    translations[lang]["tagline"];

  // Update all elements with class that starts with specific prefixes
  Object.keys(translations[lang]).forEach((key) => {
    const elements = document.getElementsByClassName(key);
    if (elements.length > 0) {
      Array.from(elements).forEach((el) => {
        if (
          (el.tagName === "INPUT" && el.getAttribute("type") === "text") ||
          (el.tagName === "INPUT" && el.getAttribute("type") === "email")
        ) {
          el.setAttribute("placeholder", translations[lang][key]);
        } else {
          el.textContent = translations[lang][key];
        }
      });
    }
  });

  // Update select options
  document.querySelectorAll("select").forEach((select) => {
    Array.from(select.options).forEach((option) => {
      if (option.value === "") {
        option.textContent = translations[lang]["select-default"];
      } else if (option.classList.contains(`option-${option.value}`)) {
        option.textContent = translations[lang][`option-${option.value}`];
      }
    });
  });

  // Update buttons
  document.querySelectorAll(".btn-next").forEach((btn) => {
    btn.textContent = translations[lang]["btn-next"];
  });

  document.querySelectorAll(".btn-previous").forEach((btn) => {
    btn.textContent = translations[lang]["btn-previous"];
  });

  document.querySelector(".btn-submit").textContent =
    translations[lang]["btn-submit"];
}

// Set up language switcher
document.querySelectorAll(".language-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    updateLanguage(this.getAttribute("data-lang"));
  });
});

function nextStep(current, next) {
  // Basic validation
  let currentStep = document.getElementById("step" + current);
  let valid = true;

  updateCover(next);

  if (current === 0) {
    let name = document.getElementById("welcome");
  }

  if (current === 1) {
    let name = document.getElementById("name");
    if (name.value.trim() === "") {
      name.parentElement.classList.add("has-error");
      valid = false;
    } else {
      name.parentElement.classList.remove("has-error");
    }
  }

  if (current === 2) {
    let email = document.getElementById("email");
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      email.parentElement.classList.add("has-error");
      valid = false;
    } else {
      email.parentElement.classList.remove("has-error");
    }
  }

  if (current === 3) {
    let farmType = document.getElementById("farm-type");
    if (farmType.value === "") {
      farmType.parentElement.classList.add("has-error");
      valid = false;
    } else {
      farmType.parentElement.classList.remove("has-error");
    }
  }

  if (current === 4) {
    let farmSize = document.getElementById("farm-size");
    if (farmSize.value === "") {
      farmSize.parentElement.classList.add("has-error");
      valid = false;
    } else {
      farmSize.parentElement.classList.remove("has-error");
    }
  }

  if (current === 5) {
    let challenge = document.getElementById("challenge");
    if (challenge.value === "") {
      challenge.parentElement.classList.add("has-error");
      valid = false;
    } else {
      challenge.parentElement.classList.remove("has-error");
    }
  }

  // if (!valid) return;

  // Proceed to next step
  currentStep.classList.remove("active");
  let nextStep = document.getElementById("step" + next);
  nextStep.classList.add("active");

  // Update progress bar
  let progress = 0;

  if (current === 0) {
    progress = 1 * 14.28;
    document.querySelector(".progress").style.width = progress + "%";
    return;
  }

  progress = next * 14.28;
  document.querySelector(".progress").style.width = progress + "%";
}

function prevStep(current, prev) {
  updateCover(prev);
  document.getElementById("step" + current).classList.remove("active");
  document.getElementById("step" + prev).classList.add("active");

  // Update progress bar
  let progress = (prev - 1) * 16.66;
  document.querySelector(".progress").style.width = progress + "%";
}

function submitForm() {
  // Here you would normally send the data to your server
  // For this example, we'll just show the success message
  document.getElementById("step6").classList.remove("active");
  document.getElementById("success").classList.add("active");
  document.querySelector(".progress").style.width = "100%";

  let formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    farmType: document.getElementById("farm-type").value,
    farmSize: document.getElementById("farm-size").value,
    challenge: document.getElementById("challenge").value,
    contactPreferences: {
      email: document.getElementById("contact-email").checked,
      demo: document.getElementById("contact-demo").checked,
      call: document.getElementById("contact-call").checked,
    },
  };

  console.log("Form data:", formData);
  // Here you would send formData to your server
}
