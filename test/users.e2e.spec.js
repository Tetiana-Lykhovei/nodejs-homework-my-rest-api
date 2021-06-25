const request = require("supertest");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");

require("dotenv").config();
const app = require("../app");
const db = require("../model/db");
const User = require("../model/user");
const Contact = require("../model/contact");
const Users = require("../repositories/users");
const { newTestUser } = require("./data/data");

jest.mock("cloudinary");

describe("Test route users", () => {
  let token;

  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newTestUser.email });
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newTestUser.email });
    await mongo.disconnect();
  });

  it("Register user", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send(newTestUser)
      .set("Accept", "application/json");
    expect(response.status).toEqual(201);
    expect(response.body).toBeDefined();
  });
  it("Create 409 user", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send(newTestUser)
      .set("Accept", "application/json");
    expect(response.status).toEqual(409);
    expect(response.body).toBeDefined();
  });
  it("Login user", async () => {
    const response = await request(app)
      .post(`/api/users/login`)
      .send(newTestUser)
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    token = response.body.data.token;
  });
  it("Wrong user", async () => {});
  it("Apload avatar user", async () => {
    const buf = await fs.readFile("./test/data/test.png");
    const response = await request(app)
      .patch("/api/users/avatars")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", buf, "test.png");
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body.data.avatarURL).toEqual("secure_url");
  });
});
