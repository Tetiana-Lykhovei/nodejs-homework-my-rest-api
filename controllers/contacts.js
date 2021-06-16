const Contacts = require("../repositories/contacts");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { docs: contacts, ...rest } = await Contacts.listContacts(
      userId,
      req.query
    );
    return res.json({
      status: "success",
      code: 200,
      data: { contacts, ...rest },
    });
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await Contacts.getContactById(userId, req.params.contactId);
    if (result) {
      console.log(result);
      return res.json({ status: "success", code: 200, data: { result } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact(userId, req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (e) {
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await Contacts.removeContact(userId, req.params.contactId);
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
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await Contacts.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
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
};

module.exports = {
  getAll,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
