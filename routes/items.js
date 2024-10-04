const express = require("express");
const router = express.Router();
const controller = require("../controllers/itemsController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.get("/", controller.renderItems);

router.get("/category", controller.renderItemsByCategory);

router.get("/new", controller.renderNewItemForm);
router.post("/new", upload.single("image"), controller.createNewItem);

router.get("/:id/edit", controller.renderEditItemForm);
router.post("/:id/edit", upload.single("image"), controller.updateItem);

router.get("/:id", controller.renderItemDetail);

router.delete("/:id", controller.deleteItem);

module.exports = router;
