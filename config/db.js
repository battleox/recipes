const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const storage =
  process.env.SQLITE_FILE ||
  path.join(__dirname, "..", "data", "recipes.sqlite");
fs.mkdirSync(path.dirname(storage), { recursive: true });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false,
  define: { underscored: true, timestamps: true },
});

module.exports = sequelize;
