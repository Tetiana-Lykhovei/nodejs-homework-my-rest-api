const guard = require("../helpers/guard");
const { HttpCode } = require("../helpers/constants");
const passport = require("passport");

describe("Unit test controller contacts", () => {
  const user = { token: "12654689" };
  const req = { get: jest.fn((header) => `Bearer ${user.token}`), user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();

  it("user exist", async () => {
    passport.authenticate = jest.fn((strategy, options, cb) => () => {
      cb(null, user);
    });
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("user not exist", async () => {
    passport.authenticate = jest.fn((strategy, options, cb) => () => {
      cb(null, false);
    });
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  });

  it("user wrong token", async () => {
    passport.authenticate = jest.fn((strategy, options, cb) => () => {
      cb(null, { token: "2346898" });
    });
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  });
});
