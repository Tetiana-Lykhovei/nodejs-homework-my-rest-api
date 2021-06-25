const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = require("../app");
const db = require("../model/db");
const User = require("../model/user");
const Contact = require("../model/contact");
const Users = require("../repositories/users");
const { newUser, newContact } = require("./data/data");

describe("Test route contacts", () => {
  let user, token;

  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUser.email });
    user = await User.create(newUser);
    const SECRET_KEY = process.env.SECRET_KEY;
    const issueToken = (payload, secret) => jwt.sign(payload, secret);
    token = issueToken({ id: user._id }, SECRET_KEY);
    await Users.updateToken(user._id, token);
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUser.email });
    await mongo.disconnect();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
  });

  describe("GET request", () => {
    it("should return status OK get all contacts", async () => {
      const response = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();
      expect(response.body.data.contacts).toBeInstanceOf(Array);
    });

    it("should return status OK get contact by id", async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });
      const response = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();
      expect(response.body.data.result).toHaveProperty("id");
      expect(response.body.data.result.id).toBe(String(contact._id));
    });

    it("should return status NOT FOUND get contact without id", async () => {
      const fakeId = "60cd1117e8433539b4a33bbf";
      const response = await request(app)
        .get(`/api/contacts/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(404);
      expect(response.body).toBeDefined();
    });
  });
  describe("POST request", () => {
    it("should return status 201 create contact", async () => {
      const response = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send(newContact)
        .set("Accept", "aplication/json");
      expect(response.status).toEqual(201);
      expect(response.body).toBeDefined();
    });
  });
});
