const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");

const {
  validationAddContact,
  validationUpdateContact,
  validationUpdateContactStatus,
  validateMongoID,
} = require("./validation");

router.get("/", ctrl.getAll).post("/", validationAddContact, ctrl.addContact);

router
  .get("/:contactId", validateMongoID, ctrl.getContactById)
  .delete("/:contactId", validateMongoID, ctrl.removeContact)
  .put(
    "/:contactId",
    validationUpdateContact,
    validateMongoID,
    ctrl.updateContact
  );

router.patch(
  "/:contactId/favorite",
  validationUpdateContactStatus,
  ctrl.updateContact
);

module.exports = router;
