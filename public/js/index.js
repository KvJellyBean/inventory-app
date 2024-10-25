const header = document.querySelector("header");
const home = document.querySelector(".home");
const footer = document.querySelector("footer");
const itemButton = document.querySelector(".itemButton");
const categoriesButton = document.querySelector(".categoriesButton");
const sliderRight = document.querySelector(".sliderRight");
const sliderLeft = document.querySelector(".sliderLeft");
const sliderRightBack = document.querySelector(".sliderRightBack");
const sliderLeftBack = document.querySelector(".sliderLeftBack");

document.addEventListener("DOMContentLoaded", function () {
  header.classList.add("slideDown");
  home.classList.add("fadeIn-delay");
  footer.classList.add("fadeIn-delay");

  sliderRight.addEventListener("animationend", () => {
    sliderRight.style.display = "none";
  });
  sliderLeft.addEventListener("animationend", () => {
    sliderLeft.style.display = "none";
  });
});

itemButton.addEventListener("click", () => {
  sliderRightBack.style.display = "flex";
  sliderLeftBack.style.display = "flex";
  sliderRightBack.classList.add("slideRightBackAnimation");
  sliderLeftBack.classList.add("slideLeftBackAnimation");
  header.classList.add("slideUp");
  home.classList.add("fadeOut");
  footer.classList.add("fadeOut");
});

categoriesButton.addEventListener("click", () => {
  sliderRightBack.style.display = "flex";
  sliderLeftBack.style.display = "flex";
  sliderRightBack.classList.add("slideRightBackAnimation");
  sliderLeftBack.classList.add("slideLeftBackAnimation");
  header.classList.add("slideUp");
  home.classList.add("fadeOut");
  footer.classList.add("fadeOut");
});
