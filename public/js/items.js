const header = document.querySelector("header");
const itemsContent = document.querySelector(".items");
const footer = document.querySelector("footer");
const itemsBox = document.querySelector(".itemsBox");

const categoryBtns = document.querySelectorAll(".categoryBtn");
const editBtns = document.querySelectorAll(".editBtn");
const deleteBtns = document.querySelectorAll(".deleteBtn");
const homeButton = document.querySelector(".homeButton a");
const categoryButton = document.querySelector(".categoryMenu");
const addItemButton = document.querySelector(".addItemButton");

const categoryBoxUl = document.querySelector(".categoryBox ul");
const sliderRight = document.querySelector(".sliderRight");
const sliderLeft = document.querySelector(".sliderLeft");
const sliderRightBack = document.querySelector(".sliderRightBack");
const sliderLeftBack = document.querySelector(".sliderLeftBack");

function showDialog(type, itemId) {
  const dialog = document.querySelector(`dialog#${type}Dialog`);
  dialog.showModal();

  const form = dialog.querySelector("form");
  form.setAttribute("data-item-id", itemId);
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
    itemsContent.classList.add("fadeOut");
    footer.classList.add("fadeOut");
    setTimeout(() => {
      type === "delete" ? deleteItem(event) : editItem(event);
    }, 1100);
  });

  const submitBtn = dialog.querySelector(`.${type}SubmitBtn`);
  submitBtn.setAttribute("data-item-id", itemId);
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
    itemsContent.classList.add("fadeOut");
    footer.classList.add("fadeOut");
    setTimeout(() => {
      type === "delete" ? deleteItem(event) : editItem(event);
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

function editItem(event) {
  event.preventDefault();
  const itemId = event.target.getAttribute("data-item-id");

  window.location.href = `/items/${itemId}/edit`;
}

async function deleteItem(event) {
  event.preventDefault();
  const itemId = event.target.getAttribute("data-item-id");

  const response = await fetch(`/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    window.location.reload();
  } else {
    window.location.href = "/error";
  }
}

// Event Listeners

categoryBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const category = btn.getAttribute("data-category");
    try {
      const res = await fetch(`/items/category?category=${category}`);
      const items = await res.json();

      let contentHTML = "";

      if (items.length === 0) {
        contentHTML = `
          <p class="noItemMsg">
            Currently, there are no items to display here.
          </p>
        `;
      } else {
        contentHTML = `
          <ul>
            ${items
              .map(
                (item) => `
                  <li class="itemCard">
                    <div class="itemInnerContent">
                      <a href="/items/${item.id}">
                        <h3>${item.name}</h3>
                      </a>
                      <a href="/items/${item.id}">
                        <img src="${item.image}" alt="${item.name} Image" />
                      </a>
                      <div class="priceBox">
                        <p>$ ${item.price}</p>
                      </div>
                    </div>
                    <div class="buttonContainer">
                      <button class="editBtn" data-item-id="${item.id}">Edit</button>
                      <button class="deleteBtn" data-item-id="${item.id}">Delete</button>
                    </div>
                  </li>`
              )
              .join("")}
          </ul>
        `;
      }

      itemsBox.innerHTML = contentHTML;

      itemsBox.addEventListener("click", (event) => {
        if (event.target.classList.contains("editBtn")) {
          event.preventDefault();
          const itemId = event.target.getAttribute("data-item-id");
          showDialog("edit", itemId);
        }

        if (event.target.classList.contains("deleteBtn")) {
          event.preventDefault();
          const itemId = event.target.getAttribute("data-item-id");
          showDialog("delete", itemId);
        }
      });
    } catch (err) {
      console.error(err);
    }
  });
});

editBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    const itemId = btn.getAttribute("data-item-id");
    showDialog("edit", itemId);
  });
});

deleteBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    const itemId = btn.getAttribute("data-item-id");
    showDialog("delete", itemId);
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
  itemsContent.classList.add("fadeIn-delay");
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
  itemsContent.classList.add("fadeOut");
  footer.classList.add("fadeOut");
});

addItemButton.addEventListener("click", () => {
  sliderRightBack.style.display = "flex";
  sliderLeftBack.style.display = "flex";
  sliderRightBack.classList.add("slideRightBackAnimation");
  sliderLeftBack.classList.add("slideLeftBackAnimation");
  header.classList.add("slideUp");
  itemsContent.classList.add("fadeOut");
  footer.classList.add("fadeOut");
});

itemsBox.addEventListener("click", (event) => {
  if (
    event.target.classList.contains("detailButton") ||
    event.target.tagName === "IMG"
  ) {
    sliderRightBack.style.display = "flex";
    sliderLeftBack.style.display = "flex";
    sliderRightBack.classList.add("slideRightBackAnimation");
    sliderLeftBack.classList.add("slideLeftBackAnimation");
    header.classList.add("slideUp");
    itemsContent.classList.add("fadeOut");
    footer.classList.add("fadeOut");
  }
});

const updateCategoryBoxDisplay = () => {
  if (window.innerWidth > 680) {
    categoryBoxUl.style.display = "flex";
  } else if (
    categoryBoxUl.style.display === "" ||
    categoryBoxUl.style.display === "flex" ||
    window.innerWidth <= 680
  ) {
    categoryBoxUl.style.display = "none";
  }
};

categoryButton.addEventListener("click", () => {
  if (window.innerWidth <= 680) {
    if (
      categoryBoxUl.style.display === "none" ||
      categoryBoxUl.style.display === ""
    ) {
      categoryBoxUl.style.display = "flex";
    } else {
      categoryBoxUl.style.display = "none";
    }
  }
});

categoryBoxUl.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && window.innerWidth <= 680) {
    categoryBoxUl.style.display = "none";
  }
});

updateCategoryBoxDisplay();
window.addEventListener("resize", updateCategoryBoxDisplay);
