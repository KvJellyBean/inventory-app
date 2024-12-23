const e = require("express");
const db = require("../db/queries");
const fs = require("fs");
const path = require("path");

async function renderItems(req, res) {
  const { category } = req.query;

  try {
    let items;
    if (category) {
      items = await db.getItemsByCategory(category);
    } else {
      items = await db.getItemsWithCategories();
    }

    const categories = await db.getCategories();
    setTimeout(() => {
      res.render("items", { title: "Items Page", items, categories });
    }, 1100);
  } catch (error) {
    setTimeout(() => {
      res.status(500).render("errorPage", {
        title: "Error Page",
        error: "Error fetching items.",
      });
    }, 1100);
  }
}

async function renderItemDetail(req, res) {
  const { id } = req.params;
  if (isNaN(id)) {
    setTimeout(() => {
      return res.status(400).render("errorPage", {
        title: "Error Page",
        error: "Invalid item ID.",
      });
    }, 1100);
  }
  try {
    const item = await db.getItemById(id);
    const items = await db.getItemsWithCategories();
    const theItem = items.find((i) => i.id === parseInt(id));
    item.categories = theItem.categories;
    setTimeout(() => {
      res.render("itemsDetail", { title: `${item.name} Detail`, item });
    }, 1100);
  } catch (error) {
    setTimeout(() => {
      res.status(500).render("errorPage", {
        title: "Error Page",
        error: "Cannot find item.",
      });
    }, 1100);
  }
}

async function renderItemsByCategory(req, res) {
  const category = req.query.category;

  try {
    if (category == "All") {
      const items = await db.getItemsWithCategories();
      return res.json(items);
    }
    const items = await db.getItemsByCategory(category);
    res.json(items);
  } catch (err) {
    setTimeout(() => {
      res.status(500).render("errorPage", {
        title: "Error Page",
        error: "Error fetching items by category.",
      });
    }, 1100);
  }
}

async function renderNewItemForm(req, res) {
  try {
    const categories = await db.getCategories();
    setTimeout(() => {
      res.render("itemForm", { title: "New Item Form", categories });
    }, 1100);
  } catch (error) {
    setTimeout(() => {
      res.status(500).render("errorPage", {
        title: "Error Page",
        error: "Error fetching categories.",
      });
    }, 1100);
  }
}

async function renderEditItemForm(req, res) {
  const { id } = req.params;
  if (isNaN(id)) {
    setTimeout(() => {
      return res.status(400).render("errorPage", {
        title: "Error Page",
        error: "Invalid item ID.",
      });
    }, 1100);
  }

  try {
    const item = await db.getItemById(id);
    const categories = await db.getCategories();
    setTimeout(() => {
      res.render("editItemForm", {
        title: "Edit Item Form",
        item,
        categories,
        id,
      });
    }, 1100);
  } catch (error) {
    setTimeout(() => {
      res.status(500).render("errorPage", {
        title: "Error Page",
        error: "Error fetching item.",
      });
    }, 1100);
  }
}

async function createNewItem(req, res) {
  const { name, quantity, price, categories } = req.body;
  const imagePath = req.file ? req.file.path : null;
  const imagePathSplit = imagePath ? imagePath.split("public") : null;
  const imagePathNew = imagePathSplit ? imagePathSplit[1] : null;

  const categoryIds = Array.isArray(categories)
    ? categories.map((category) => parseInt(category, 10))
    : [parseInt(categories, 10)];

  try {
    const items = await db.getItemsWithCategories();
    const item = items.find((i) => i.name === name);

    if (item) {
      setTimeout(() => {
        return res.status(400).render("errorPage", {
          title: "Error Page",
          error: "Item name already exists.",
        });
      }, 1100);
    }

    await db.addItem(
      name,
      parseInt(quantity),
      parseFloat(price),
      imagePathNew,
      categoryIds
    );
    res.redirect("/items");
  } catch (error) {
    setTimeout(() => {
      res.status(500).render("errorPage", {
        title: "Error Page",
        error: "Error creating item.",
      });
    }, 1100);
  }
}

async function updateItem(req, res) {
  const { id } = req.params;
  const { name, quantity, price, categories } = req.body;
  const imagePath = req.file ? req.file.path : null;
  const imagePathSplit = imagePath ? imagePath.split("public") : null;
  const imagePathNew = imagePathSplit ? imagePathSplit[1] : null;

  try {
    const items = await db.getItemsWithCategories();
    const item = await db.getItemById(id);
    const itemExist = items.find(
      (i) => i.name === name && i.id !== parseInt(id)
    );

    if (!item) {
      setTimeout(() => {
        return res.status(404).render("errorPage", {
          title: "Error Page",
          error: "Item not found.",
        });
      }, 1100);
    }

    if (itemExist) {
      setTimeout(() => {
        return res.status(400).render("errorPage", {
          title: "Error Page",
          error: "Item name already exists.",
        });
      }, 1100);
    }

    if (req.file && item.image) {
      const oldImagePath = path.join(__dirname, "../public", item.image);

      fs.unlink(oldImagePath, async (err) => {
        if (err) {
          setTimeout(() => {
            return res.status(500).render("errorPage", {
              title: "Error Page",
              error: "Error deleting image file.",
            });
          }, 1100);
        }
      });
    }

    await db.updateItem(
      id,
      name,
      parseInt(quantity),
      parseFloat(price),
      imagePathNew || item.image,
      categories
    );
    res.redirect(`/items`);
  } catch (error) {
    setTimeout(() => {
      res.status(500).render("errorPage", {
        title: "Error Page",
        error: "Error updating item.",
      });
    }, 1100);
  }
}

async function deleteItem(req, res) {
  const { id } = req.params;

  try {
    const item = await db.getItemById(id);
    if (!item) {
      setTimeout(() => {
        return res.status(404).render("errorPage", {
          title: "Error Page",
          error: "Item not found.",
        });
      }, 1100);
    }

    if (item.image) {
      const imagePath = path.join(__dirname, "../public", item.image);

      fs.unlink(imagePath, async (err) => {
        if (err) {
          setTimeout(() => {
            return res.status(500).render("errorPage", {
              title: "Error Page",
              error: "Error deleting image file.",
            });
          }, 1100);
        }
      });
    }

    await db.deleteItem(id);
    res.status(200).send("Item deleted");
  } catch (error) {
    setTimeout(() => {
      res.status(500).render("errorPage", {
        title: "Error Page",
        error: "Error deleting item.",
      });
    }, 1100);
  }
}

module.exports = {
  renderItems,
  renderItemDetail,
  renderItemsByCategory,
  renderNewItemForm,
  renderEditItemForm,
  createNewItem,
  updateItem,
  deleteItem,
};
