const messageForm = document.getElementById("message-form");
const contactSubmitBtn = document.getElementById("form-submit");

const langDict = {
  en: "Your message has been sent. Thank you!",
  es: "Su mensaje ha sido enviado. ¡Gracias!",
  fr: "Votre message a été envoyé. Merci!",
  de: "Ihre Nachricht wurde gesendet. Danke!",
  it: "Il tuo messaggio è stato inviato. Grazie!",
  pt: "Sua mensagem foi enviada. Obrigado!",
};

document.addEventListener("DOMContentLoaded", function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init("fkBKILUt8o7m56yIj");
  }

  if (messageForm) {
    messageForm.addEventListener("submit", function (e) {
      e.preventDefault();
      disableContactSubmit();

      emailjs
        .sendForm("service_vyz4mk6", "template_xt7ke2g", "#message-form")
        .then(() => {
          const savedLang = localStorage.getItem("preferredLanguage") || "en";
          showAlert(langDict[savedLang] || langDict.en, "success");
          enableContactSubmit();
          messageForm.reset();
        })
        .catch((error) => {
          console.log(error);
          showAlert("Oops... " + JSON.stringify(error), "error");
          enableContactSubmit();
        });
    });
  }
});

function disableContactSubmit() {
  if (!contactSubmitBtn) return;
  contactSubmitBtn.dataset.originalText = contactSubmitBtn.textContent;
  contactSubmitBtn.textContent = "Sending...";
  contactSubmitBtn.disabled = true;
}

function enableContactSubmit() {
  if (!contactSubmitBtn) return;
  contactSubmitBtn.textContent =
    contactSubmitBtn.dataset.originalText || contactSubmitBtn.textContent;
  contactSubmitBtn.disabled = false;
}

function showAlert(message, type = "") {
  let customAlert = document.getElementById("customAlert");
  if (!customAlert) return;

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
  if (!customAlert) return;
  customAlert.classList.remove("show");
  setTimeout(() => {
    customAlert.classList.add("hidden");
  }, 300);
}
