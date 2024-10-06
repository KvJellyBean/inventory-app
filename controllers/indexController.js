const db = require("../db/queries");

async function renderHome(req, res) {
  res.render("index", { title: "Home" });
}

module.exports = {
  renderHome,
};
