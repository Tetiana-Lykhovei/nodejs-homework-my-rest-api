const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

const { validationAddUser, validationUserLogin } = require("./validation");

router.post("/signup", validationAddUser, ctrl.signup);
router.post("/login", validationUserLogin, ctrl.login);
router.post("/logout", guard, ctrl.logout);

router.get("/current", guard, ctrl.current);

module.exports = router;
