const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");

const {
  validationAddContact,
  validationUpdateContact,
  validationUpdateContactStatus,
  validateMongoID,
} = require("./validation");

router
  .get("/", guard, ctrl.getAll)
  .post("/", guard, validationAddContact, ctrl.addContact);

router
  .get("/:contactId", guard, validateMongoID, ctrl.getContactById)
  .delete("/:contactId", guard, validateMongoID, ctrl.removeContact)
  .put(
    "/:contactId",
    guard,
    validationUpdateContact,
    validateMongoID,
    ctrl.updateContact
  );

router.patch(
  "/:contactId/favorite",
  guard,
  validationUpdateContactStatus,
  ctrl.updateContact
);

module.exports = router;
