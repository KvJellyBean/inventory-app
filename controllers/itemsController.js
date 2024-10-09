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
    res.render("items", { title: "Items Page", items, categories });
  } catch (error) {
    res.status(500).render("errorPage", {
      title: "Error Page",
      error: "Error fetching items.",
    });
  }
}

async function renderItemDetail(req, res) {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).render("errorPage", {
      title: "Error Page",
      error: "Invalid item ID.",
    });
  }
  try {
    const item = await db.getItemById(id);
    const items = await db.getItemsWithCategories();
    const theItem = items.find((i) => i.id === parseInt(id));
    item.categories = theItem.categories;
    res.render("itemsDetail", { title: `${item.name} Detail`, item });
  } catch (error) {
    res.status(500).render("errorPage", {
      title: "Error Page",
      error: "Cannot find item.",
    });
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
    res.status(500).render("errorPage", {
      title: "Error Page",
      error: "Error fetching items by category.",
    });
  }
}

async function renderNewItemForm(req, res) {
  try {
    const categories = await db.getCategories();
    res.render("itemForm", { title: "New Item Form", categories });
  } catch (error) {
    res.status(500).render("errorPage", {
      title: "Error Page",
      error: "Error fetching categories.",
    });
  }
}

async function renderEditItemForm(req, res) {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).render("errorPage", {
      title: "Error Page",
      error: "Invalid item ID.",
    });
  }

  try {
    const item = await db.getItemById(id);
    const categories = await db.getCategories();
    res.render("editItemForm", {
      title: "Edit Item Form",
      item,
      categories,
      id,
    });
  } catch (error) {
    res.status(500).render("errorPage", {
      title: "Error Page",
      error: "Error fetching item.",
    });
  }
}

async function createNewItem(req, res) {
  const { name, quantity, price, categories } = req.body;
  const imagePath = req.file ? req.file.path : null;
  const imagePathSplit = imagePath ? imagePath.split("public") : null;
  const imagePathNew = imagePathSplit ? imagePathSplit[1] : null;

  try {
    const items = await db.getItemsWithCategories();
    const item = items.find((i) => i.name === name);

    if (item) {
      return res.status(400).render("errorPage", {
        title: "Error Page",
        error: "Item name already exists.",
      });
    }

    await db.addItem(
      name,
      parseInt(quantity),
      parseFloat(price),
      imagePathNew,
      categories
    );
    res.redirect("/items");
  } catch (error) {
    res.status(500).render("errorPage", {
      title: "Error Page",
      error: "Error creating item.",
    });
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
      return res.status(404).render("errorPage", {
        title: "Error Page",
        error: "Item not found.",
      });
    }

    if (itemExist) {
      return res.status(400).render("errorPage", {
        title: "Error Page",
        error: "Item name already exists.",
      });
    }

    if (req.file && item.image) {
      const oldImagePath = path.join(__dirname, "../public", item.image);

      fs.unlink(oldImagePath, async (err) => {
        if (err) {
          return res.status(500).render("errorPage", {
            title: "Error Page",
            error: "Error deleting image file.",
          });
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
    res.status(500).render("errorPage", {
      title: "Error Page",
      error: "Error updating item.",
    });
  }
}

async function deleteItem(req, res) {
  const { id } = req.params;

  try {
    const item = await db.getItemById(id);
    if (!item) {
      return res.status(404).render("errorPage", {
        title: "Error Page",
        error: "Item not found.",
      });
    }

    if (item.image) {
      const imagePath = path.join(__dirname, "../public", item.image);

      fs.unlink(imagePath, async (err) => {
        if (err) {
          return res.status(500).render("errorPage", {
            title: "Error Page",
            error: "Error deleting image file.",
          });
        }
      });
    }

    await db.deleteItem(id);
    res.status(200).send("Item deleted");
  } catch (error) {
    res.status(500).render("errorPage", {
      title: "Error Page",
      error: "Error deleting item.",
    });
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
