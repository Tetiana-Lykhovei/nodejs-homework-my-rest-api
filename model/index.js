const fs = require("fs/promises");
const path = require("path");
const { v4: id } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const readContacts = async () => {
  const contacts = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(contacts);
};

const listContacts = async () => {
  return await readContacts();
};

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  return contacts.find((el) => String(contactId) === String(el.id));
};

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const deletedContact = contacts.find(
    (el) => String(contactId) === String(el.id)
  );
  if (deletedContact) {
    const index = contacts.indexOf(deletedContact);
    contacts.splice(index, 1);

    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return deletedContact;
  }
  return null;
};

const addContact = async (body) => {
  const newContact = {
    id: id(),
    ...body,
  };
  const contacts = await readContacts();
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();
  const [result] = contacts.filter((el) => String(contactId) === String(el.id));
  if (result) {
    Object.assign(result, body);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
  }
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
