import fs from "fs/promises";
import path from "path";

const defaultPath = path.resolve("db/contacts.json");

const listContacts = async (contactsPath = defaultPath) => {
  const contacts = await fs
    .readFile(contactsPath, { encoding: "utf-8" })
    .then((data) => JSON.parse(data))
    .catch((err) => console.log(err.message));
  return contacts;
};

const getContactById = async (contactId, contactsPath) => {
  try {
    const contactArray = contactsPath
      ? await listContacts(contactsPath)
      : await listContacts();
    const contactById = contactArray.find(
      (data) => data.id === contactId.toString()
    );
    if (!contactById) throw new Error(`This ID doesn't exist`);
    else return contactById;
  } catch (err) {
    return Error(err);
  }
};

const removeContact = async (contactId, contactsPath) => {
  const contactArray = contactsPath
    ? await listContacts(contactsPath).catch((error) => error)
    : await listContacts().catch((error) => error);
  const contactById = await getContactById(contactId);

  if (contactById.name === "Error") return console.log(contactById.message);

  const filteredContact = contactArray.filter(
    (data) => data.id !== contactId.toString()
  );
  await fs
    .writeFile(
      contactsPath || defaultPath,
      JSON.stringify(filteredContact, null)
    )
    .catch((error) => {
      console.log(`Error in writeFile deleteContactById: ${error}`);
      return error;
    });
  return console.log("Delete is completed");
};

const addContact = async (name, email, phone, contactsPath) => {
  const contactArray = contactsPath
    ? await listContacts(contactsPath).catch((error) => error)
    : await listContacts().catch((error) => error);

  const idSortedArray = contactArray
    .map((contact) => parseInt(contact.id))
    .sort((a, b) => a - b);
  const newId = idSortedArray[idSortedArray.length - 1] + 1;

  const newContact = {
    id: newId.toString(),
    name,
    email,
    phone,
  };
  const newArray = [...contactArray, newContact];
  console.log(newArray);
  await fs
    .writeFile(contactsPath || defaultPath, JSON.stringify(newArray, null))
    .catch((error) => {
      console.log(`Error in writeFile addContact: ${error}`);
      return error;
    })
    .then(() => console.log("Save a new contact end with Succes"));
};

export { listContacts, removeContact, getContactById, addContact };

