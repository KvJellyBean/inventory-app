const db = require("../db/queries");

async function renderHome(req, res) {
  const items = await db.getItemsWithCategories();
  res.render("index", { title: "Home", items });
}

module.exports = {
  renderHome,
};
