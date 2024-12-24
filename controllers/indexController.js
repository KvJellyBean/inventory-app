const db = require("../db/queries");

async function renderHome(req, res) {
  setTimeout(() => {
    res.render("index", { title: "Home" });
  }, 1100);
}

module.exports = {
  renderHome,
};
