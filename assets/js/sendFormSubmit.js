const newsletterForm = document.getElementById("newsletter-form");
const newsletterSubmitBtn = newsletterForm?.querySelector('[type="submit"]');

const contactForm = document.getElementById("message-form");
const contactFormSubmitBtn = contactForm?.querySelector('[type="submit"]');

const langDict = {
  en: "Your message has been sent. Thank you!",
  es: "Su mensaje ha sido enviado. ¡Gracias!",
  fr: "Votre message a été envoyé. Merci!",
  de: "Ihre Nachricht wurde gesendet. Danke!",
  it: "Il tuo messaggio è stato inviato. Grazie!",
  pt: "Sua mensagem foi enviada. Obrigado!",
};

document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("fkBKILUt8o7m56yIj");

  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(newsletterForm);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    disableSubmit();

    emailjs
      .sendForm("service_vyz4mk6", "template_xt7ke2g", "#newsletter-form")
      .then((response) => {
        const savedLang = localStorage.getItem("preferredLanguage") || "en";

        showAlert(langDict[savedLang], "success");
        enableSubmit();

        newsletterForm.reset();
      })
      .catch((error) => {
        showAlert("Oops... " + JSON.stringify(error), "error");
        enableSubmit();
      });
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    disableContactSubmit();

    emailjs
      .sendForm("service_vyz4mk6", "template_xt7ke2g", "#message-form")
      .then((response) => {
        const savedLang = localStorage.getItem("preferredLanguage") || "en";

        showAlert(langDict[savedLang], "success");
        enableContactSubmit();
        console.log(response);
        //contactForm.reset();
      })
      .catch((error) => {
        console.log(error);
        showAlert("Oops... " + JSON.stringify(error), "error");
        enableContactSubmit();
      });
  });
});

function disableSubmit() {
  newsletterSubmitBtn.dataset.originalText = newsletterSubmitBtn.value;
  newsletterSubmitBtn.value = "Sending...";
  newsletterSubmitBtn.disabled = true;
}

function enableSubmit() {
  newsletterSubmitBtn.value = newsletterSubmitBtn.dataset.originalText;
  newsletterSubmitBtn.disabled = false;
}

function disableContactSubmit() {
  contactFormSubmitBtn.dataset.originalText = contactFormSubmitBtn.value;
  contactFormSubmitBtn.value = "Sending...";
  contactFormSubmitBtn.disabled = true;
}

function enableContactSubmit() {
  contactFormSubmitBtn.value = contactFormSubmitBtn.dataset.originalText;
  contactFormSubmitBtn.disabled = false;
}

function showAlert(message, type = "") {
  let customAlert = document.getElementById("customAlert");

  customAlert.className = "custom-alert hidden";

  if (type) {
    customAlert.classList.add(type);
  }

  customAlert.textContent = message;

  void customAlert.offsetWidth;

  customAlert.classList.remove("hidden");
  customAlert.classList.add("show");

  setTimeout(() => {
    hideAlert();
  }, 3000);
}

function hideAlert() {
  let customAlert = document.getElementById("customAlert");
  customAlert.classList.remove("show");

  setTimeout(() => {
    customAlert.classList.add("hidden");
  }, 300);
}

function onFormSuccess() {
  showAlert("Your message has been sent. Thank you!", "success");
}

function onFormError() {
  showAlert("Oops... Something went wrong.", "error");
}
