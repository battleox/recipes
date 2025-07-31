require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { init } = require("./models");
const recipesRouter = require("./routes/recipes");

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/recipes", recipesRouter);

// Everything else should be 404 JSON
app.use((_req, res) => res.status(404).json({ error: "NOT_FOUND" }));

const PORT = process.env.PORT || 3000;

// Boot DB and start
init()
  .then(() => {
    app.listen(PORT, () => console.log(`Recipes API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start:", err);
    process.exit(1);
  });
