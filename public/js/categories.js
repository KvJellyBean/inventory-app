const header = document.querySelector("header");
const categoriesContent = document.querySelector(".categories");
const footer = document.querySelector("footer");

const editBtns = document.querySelectorAll(".editBtn");
const deleteBtns = document.querySelectorAll(".deleteBtn");
const homeButton = document.querySelector(".homeButton a");
const addCategoryButton = document.querySelector(".addCategoryButton");

const sliderRight = document.querySelector(".sliderRight");
const sliderLeft = document.querySelector(".sliderLeft");
const sliderRightBack = document.querySelector(".sliderRightBack");
const sliderLeftBack = document.querySelector(".sliderLeftBack");

function showDialog(type, categoryId) {
  const dialog = document.querySelector(`dialog#${type}Dialog`);
  dialog.showModal();

  const form = dialog.querySelector("form");
  form.setAttribute("data-category-id", categoryId);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const password =
      type === "delete"
        ? document.querySelector("#passwordAdminDelete").value
        : document.querySelector("#passwordAdminEdit").value;
    const errorText =
      type === "delete"
        ? document.querySelector("#errorTextDelete")
        : document.querySelector("#errorTextEdit");
    errorText.style.display = "none";
    errorText.textContent = "";

    if (password !== "KvJellyBeanAdmin") {
      errorText.style.display = "block";
      errorText.textContent = "Invalid password";
      return;
    }

    dialog.close();
    sliderRightBack.style.display = "flex";
    sliderLeftBack.style.display = "flex";
    sliderRightBack.classList.add("slideRightBackAnimation");
    sliderLeftBack.classList.add("slideLeftBackAnimation");
    header.classList.add("slideUp");
    categoriesContent.classList.add("fadeOut");
    footer.classList.add("fadeOut");
    setTimeout(() => {
      type === "delete" ? deleteCategory(event) : editCategory(event);
    }, 1100);
  });

  const submitBtn = dialog.querySelector(`.${type}SubmitBtn`);
  submitBtn.setAttribute("data-category-id", categoryId);
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const password =
      type === "delete"
        ? document.querySelector("#passwordAdminDelete").value
        : document.querySelector("#passwordAdminEdit").value;
    const errorText =
      type === "delete"
        ? document.querySelector("#errorTextDelete")
        : document.querySelector("#errorTextEdit");
    errorText.style.display = "none";
    errorText.textContent = "";

    if (password !== "KvJellyBeanAdmin") {
      errorText.style.display = "block";
      errorText.textContent = "Invalid password";
      return;
    }

    dialog.close();
    sliderRightBack.style.display = "flex";
    sliderLeftBack.style.display = "flex";
    sliderRightBack.classList.add("slideRightBackAnimation");
    sliderLeftBack.classList.add("slideLeftBackAnimation");
    header.classList.add("slideUp");
    categoriesContent.classList.add("fadeOut");
    footer.classList.add("fadeOut");
    setTimeout(() => {
      type === "delete" ? deleteCategory(event) : editCategory(event);
    }, 1100);
  });

  const errorText = dialog.querySelector(
    `#errorText${type.charAt(0).toUpperCase() + type.slice(1)}`
  );
  errorText.style.display = "none";
  errorText.textContent = "";

  dialog.addEventListener("close", () => {
    form.reset();
    errorText.style.display = "none";
    errorText.textContent = "";
  });
}

function closeDialog(type) {
  const dialog = document.querySelector(`dialog#${type}Dialog`);
  dialog.close();
}

function editCategory(event) {
  event.preventDefault();
  const categoryId = event.target.getAttribute("data-category-id");

  window.location.href = `/categories/${categoryId}/edit`;
}

async function deleteCategory(event) {
  event.preventDefault();
  const categoryId = event.target.getAttribute("data-category-id");

  const response = await fetch(`/categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    window.location.href = `/errorPage?error=${encodeURIComponent(
      errorMessage
    )}`;
  } else {
    window.location.reload();
  }
}

// Event Listeners

editBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    const categoryId = btn.getAttribute("data-category-id");
    showDialog("edit", categoryId);
  });
});

deleteBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    const categoryId = btn.getAttribute("data-category-id");
    showDialog("delete", categoryId);
  });
});

document
  .querySelector(".editCancelBtn")
  .addEventListener("click", () => closeDialog("edit"));

document
  .querySelector(".deleteCancelBtn")
  .addEventListener("click", () => closeDialog("delete"));

document.addEventListener("DOMContentLoaded", function () {
  header.classList.add("slideDown");
  categoriesContent.classList.add("fadeIn-delay");
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
  categoriesContent.classList.add("fadeOut");
  footer.classList.add("fadeOut");
});

addCategoryButton.addEventListener("click", () => {
  sliderRightBack.style.display = "flex";
  sliderLeftBack.style.display = "flex";
  sliderRightBack.classList.add("slideRightBackAnimation");
  sliderLeftBack.classList.add("slideLeftBackAnimation");
  header.classList.add("slideUp");
  categoriesContent.classList.add("fadeOut");
  footer.classList.add("fadeOut");
});

document.querySelector("ul").addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    sliderRightBack.style.display = "flex";
    sliderLeftBack.style.display = "flex";
    sliderRightBack.classList.add("slideRightBackAnimation");
    sliderLeftBack.classList.add("slideLeftBackAnimation");
    header.classList.add("slideUp");
    categoriesContent.classList.add("fadeOut");
    footer.classList.add("fadeOut");
  }
});
