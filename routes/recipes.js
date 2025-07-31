const router = require("express").Router();
const ctrl = require("../controllers/recipeController");

router.post("/", ctrl.create);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);
router.patch("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
