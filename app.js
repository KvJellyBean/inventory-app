const express = require("express");
const path = require("path");
const app = express();
const home = require("./routes/index");
const items = require("./routes/items");
const categories = require("./routes/categories");

require("dotenv").config();
const port = process.env.PORT || 3000;

app.set("viiews", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", home);
app.use("/items", items);
app.use("/categories", categories);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
