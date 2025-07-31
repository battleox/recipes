// models/index.js
const sequelize = require("../config/db");
const makeRecipe = require("./recipe");

const Recipe = makeRecipe(sequelize);

async function init() {
  await sequelize.authenticate();

  if (process.env.SYNC_DB === "1") {
    await sequelize.sync(); // create table if missing
  }

  // ---- Seed required rows if table is empty ----
  const count = await Recipe.count();
  if (count === 0) {
    await Recipe.bulkCreate(
      [
        {
          id: 1,
          title: "Chicken Curry",
          making_time: "45 min",
          serves: "4 people",
          ingredients: "onion, chicken, seasoning",
          cost: 1000,
          created_at: "2016-01-10 12:10:12",
          updated_at: "2016-01-10 12:10:12",
        },
        {
          id: 2,
          title: "Rice Omelette",
          making_time: "30 min",
          serves: "2 people",
          ingredients: "onion, egg, seasoning, soy sauce",
          cost: 700,
          created_at: "2016-01-11 13:10:12",
          updated_at: "2016-01-11 13:10:12",
        },
      ],
      { validate: false }
    );
  }
}

module.exports = { sequelize, Recipe, init };
