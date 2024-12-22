const express = require("express");
const path = require("path");
const app = express();
const home = require("./routes/index");
const items = require("./routes/items");
const categories = require("./routes/categories");

require("dotenv").config();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", home);
app.use("/items", items);
app.use("/categories", categories);
app.get("/errorPage", (req, res) => {
  const errorMessage = req.query.error || "An unexpected error occurred.";
  res.render("errorPage", { error: errorMessage });
});
app.use(function (req, res) {
  res.status(404).render("errorPage");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
