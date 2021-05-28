const express = require("express");
const router = express.Router();
const Contacts = require("../../model");
const {
  validationAddContact,
  validationUpdateContact,
} = require("./validation");

router.get("/", async (req, res, next) => {
  try {
    const result = await Contacts.listContacts();
    return res.json({ status: "success", code: 200, data: { result } });
  } catch (e) {
    next(e);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const result = await Contacts.getContactById(req.params.contactId);
    if (result) {
      return res.json({ status: "success", code: 200, data: { result } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
});

router.post("/", validationAddContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (e) {
    next(e);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const result = await Contacts.removeContact(req.params.contactId);
    if (result) {
      return res.json({
        status: "success",
        code: 200,
        message: "Contact deleted",
        data: { result },
      });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
});

router.put("/:contactId", validationUpdateContact, async (req, res, next) => {
  try {
    const result = await Contacts.updateContact(req.params.contactId, req.body);
    if (result) {
      return res.json({
        status: "success",
        code: 200,
        data: { result },
      });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
