// config/db.js  — Sequelize + SQLite (Render-safe)
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

// Detect Render environment
const isRender = !!process.env.RENDER;

// - On Render (free): /tmp is writable (ephemeral)
// - Locally: ./data/recipes.sqlite
const storage =
  process.env.SQLITE_FILE ||
  (isRender
    ? "/tmp/recipes.sqlite"
    : path.join(__dirname, "..", "data", "recipes.sqlite"));

// Only try to create the directory for local paths (not /tmp)
try {
  const dir = path.dirname(storage);
  if (!isRender) fs.mkdirSync(dir, { recursive: true });
} catch (_) {}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false,
  define: { underscored: true, timestamps: true },
});

module.exports = sequelize;
