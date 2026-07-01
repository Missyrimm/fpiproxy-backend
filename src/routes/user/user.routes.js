const router = require("express").Router();

const auth = require("../../middleware/auth.middleware");
const controller = require("../../controllers/user/user.controller");

router.get("/me", auth, controller.me);

module.exports = router;
