const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoriesController");

router.get("/", controller.renderCategories);

router.get("/new", controller.renderNewCategoryForm);
router.post("/new", controller.createNewCategory);

router.get("/:id/edit", controller.renderEditCategoryForm);
router.post("/:id/edit", controller.updateCategory);

router.delete("/:id", controller.deleteCategory);

module.exports = router;
