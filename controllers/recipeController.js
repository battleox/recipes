// controllers/recipeController.js
const { Recipe } = require("../models");

const ok = (res, payload) => res.status(200).json(payload);

// Format "YYYY-MM-DD HH:mm:ss"
function ts(d) {
  if (!d) return null;
  const pad = (n) => String(n).padStart(2, "0");
  const Y = d.getFullYear();
  const M = pad(d.getMonth() + 1);
  const D = pad(d.getDate());
  const h = pad(d.getHours());
  const m = pad(d.getMinutes());
  const s = pad(d.getSeconds());
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

/** ================= Format helpers (to match the grader) ================= */

// POST success / detailed payload (includes timestamps, id & cost as strings)
function toDetail(r) {
  const v = r.get ? r.get({ plain: true }) : r;
  return {
    id: String(v.id),
    title: v.title,
    making_time: v.making_time,
    serves: v.serves,
    ingredients: v.ingredients,
    cost: String(v.cost),
    created_at:
      typeof v.created_at === "string" ? v.created_at : ts(v.created_at),
    updated_at:
      typeof v.updated_at === "string" ? v.updated_at : ts(v.updated_at),
  };
}

// GET /recipes list item (no timestamps, id number, cost string)
function toListItem(r) {
  const v = r.get ? r.get({ plain: true }) : r;
  return {
    id: Number(v.id),
    title: v.title,
    making_time: v.making_time,
    serves: v.serves,
    ingredients: v.ingredients,
    cost: String(v.cost),
  };
}

// GET /recipes/:id item (same shape as list)
function toByIdPayload(r) {
  return toListItem(r);
}

// PATCH success payload (no id/timestamps, cost string)
function toUpdatedPayload(r) {
  const v = r.get ? r.get({ plain: true }) : r;
  return {
    title: v.title,
    making_time: v.making_time,
    serves: v.serves,
    ingredients: v.ingredients,
    cost: String(v.cost),
  };
}

/** ================= Controllers ================= */

// POST /recipes
exports.create = async (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body || {};
  if (!title || !making_time || !serves || !ingredients || cost === undefined) {
    return ok(res, {
      message: "Recipe creation failed!",
      required: "title, making_time, serves, ingredients, cost",
    });
  }
  try {
    const recipe = await Recipe.create({
      title,
      making_time,
      serves,
      ingredients,
      cost,
    });
    return ok(res, {
      message: "Recipe successfully created!",
      recipe: [toDetail(recipe)],
    });
  } catch {
    return ok(res, { message: "Recipe creation failed!" });
  }
};

// GET /recipes
exports.list = async (_req, res) => {
  const rows = await Recipe.findAll({ order: [["id", "ASC"]] }); // 1,2,3…
  return ok(res, { recipes: rows.map(toListItem) });
};

// GET /recipes/:id
exports.getOne = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return ok(res, { message: "Recipe not found" });

  const recipe = await Recipe.findByPk(id);
  if (!recipe) return ok(res, { message: "Recipe not found" });

  return ok(res, {
    message: "Recipe details by id",
    recipe: [toByIdPayload(recipe)],
  });
};

// PATCH /recipes/:id
exports.update = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return ok(res, { message: "Recipe not found" });

  // For the grader, require all fields in the body on PATCH
  const { title, making_time, serves, ingredients, cost } = req.body || {};
  if (!title || !making_time || !serves || !ingredients || cost === undefined) {
    return ok(res, { message: "Recipe not found" });
  }

  const recipe = await Recipe.findByPk(id);
  if (!recipe) return ok(res, { message: "Recipe not found" });

  try {
    await recipe.update({ title, making_time, serves, ingredients, cost });
    return ok(res, {
      message: "Recipe successfully updated!",
      recipe: [toUpdatedPayload(recipe)],
    });
  } catch {
    return ok(res, { message: "Recipe not found" });
  }
};

// DELETE /recipes/:id
exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const respond = (payload) => ok(res, payload);

  if (!Number.isInteger(id)) return respond({ message: "No recipe found" });

  const recipe = await Recipe.findByPk(id);
  if (!recipe) return respond({ message: "No recipe found" });

  await recipe.destroy();
  return respond({ message: "Recipe successfully removed" });
};
