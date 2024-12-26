const header = document.querySelector("header");
const footer = document.querySelector("footer");
const mainContent = document.querySelector("main");
const homeButton = document.querySelector(".homeButton a");
const submitButton = document.querySelector(".submitItem");

const sliderRight = document.querySelector(".sliderRight");
const sliderLeft = document.querySelector(".sliderLeft");
const sliderRightBack = document.querySelector(".sliderRightBack");
const sliderLeftBack = document.querySelector(".sliderLeftBack");

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  header.classList.add("slideDown");
  mainContent.classList.add("fadeIn-delay");
  footer.classList.add("fadeIn-delay");

  sliderRight.addEventListener("animationend", () => {
    sliderRight.style.display = "none";
  });
  sliderLeft.addEventListener("animationend", () => {
    sliderLeft.style.display = "none";
  });
});

homeButton.addEventListener("click", () => {
  sliderRightBack.style.display = "flex";
  sliderLeftBack.style.display = "flex";
  sliderRightBack.classList.add("slideRightBackAnimation");
  sliderLeftBack.classList.add("slideLeftBackAnimation");
  header.classList.add("slideUp");
  mainContent.classList.add("fadeOut");
  footer.classList.add("fadeOut");
});

submitButton.addEventListener("click", (event) => {
  const form = document.querySelector("form");

  if (!form.checkValidity()) {
    event.preventDefault();
    alert("Please fill out all fields.");
    return;
  }

  sliderRightBack.style.display = "flex";
  sliderLeftBack.style.display = "flex";
  sliderRightBack.classList.add("slideRightBackAnimation");
  sliderLeftBack.classList.add("slideLeftBackAnimation");
  header.classList.add("slideUp");
  mainContent.classList.add("fadeOut");
  footer.classList.add("fadeOut");
});
