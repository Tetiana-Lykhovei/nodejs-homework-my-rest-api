const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");

const { validationAddUser } = require("./validation");

router.post("/signup", validationAddUser, ctrl.signup);
router.post("/login", ctrl.login);
router.post("/logout", guard, ctrl.logout);

router.patch("/avatars", guard, upload.single("avatar"), ctrl.avatars);

router.get("/current", guard, ctrl.current);
router.get("/verify/:token", ctrl.verify);
router.post("/verify", ctrl.repeatEmailVerification);

module.exports = router;
