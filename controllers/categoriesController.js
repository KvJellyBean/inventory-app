const e = require("express");
const db = require("../db/queries");

async function renderCategories(req, res) {
  const categories = await db.getCategories();
  setTimeout(() => {
    res.render("categories", { title: "Categories", categories });
  }, 1100);
}

async function renderNewCategoryForm(req, res) {
  setTimeout(() => {
    res.render("categoryForm", { title: "New Category Form" });
  }, 1100);
}

async function renderEditCategoryForm(req, res) {
  const { id } = req.params;
  if (isNaN(id)) {
    setTimeout(() => {
      return res.status(404).render("errorPage", {
        title: "Error Page",
        error: "Invalid category ID.",
      });
    }, 1100);
  }
  const category = await db.getCategoryById(id);
  if (!category) {
    setTimeout(() => {
      return res.status(404).render("errorPage", {
        title: "Error Page",
        error: "Category not found.",
      });
    }, 1100);
  }

  setTimeout(() => {
    res.render("editCategory", { title: "Edit Category Form", category });
  }, 1100);
}

async function createNewCategory(req, res) {
  const { name } = req.body;
  try {
    const categories = await db.getCategories();
    const category = categories.find((c) => c.name === name);
    if (category) {
      return res.status(404).render("errorPage", {
        title: "Error Page",
        error: "Category already exists.",
      });
    }

    await db.addCategory(name);
    res.redirect("/categories");
  } catch (error) {
    setTimeout(() => {
      res.status(500).render("errorPage", {
        title: "Error Page",
        error: "Error creating category.",
      });
    }, 1100);
  }
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const categories = await db.getCategories();
    const category = categories.find((c) => c.name === name);
    if (category) {
      setTimeout(() => {
        return res.status(404).render("errorPage", {
          title: "Error Page",
          error: "Category already exists.",
        });
      }, 1100);
    }

    await db.updateCategory(id, name);
    res.redirect("/categories");
  } catch (error) {
    setTimeout(() => {
      res.status(500).render("errorPage", {
        title: "Error Page",
        error: "Error updating category.",
      });
    }, 1100);
  }
}

async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    const items = await db.getItemsByCategory(id);
    if (items.length > 0) {
      return res
        .status(400)
        .send("Cannot delete category with associated items.");
    }

    await db.deleteCategory(id);
    res.status(200).send("Category deleted.");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  renderCategories,
  renderNewCategoryForm,
  renderEditCategoryForm,
  createNewCategory,
  updateCategory,
  deleteCategory,
};
