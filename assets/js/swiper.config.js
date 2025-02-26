const swiper = new Swiper(".swiper", {
  slidesPerView: 5, // Show 5 slides
  spaceBetween: 30, // Adjust the space between slides
  loop: true, // Enable loop
  loopAdditionalSlides: 5, // Important for looping with fewer slides
  speed: 600, // Adjust transition speed
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    768: {
      slidesPerView: 3, // Adjust for tablets
    },
    480: {
      slidesPerView: 1, // Adjust for mobile
    },
  },
});
