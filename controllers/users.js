const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
require("dotenv").config();

const UploadAvatarService = require("../services/cloud-upload");

const SECRET_KEY = process.env.SECRET_KEY;

const signup = async (req, res, next) => {
  try {
    const result = await Users.findUserByEmail(req.body.email);
    if (result) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const { id, email, subscription, avatar } = await Users.cteateUser(
      req.body
    );

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { id, email, subscription, avatar },
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await Users.findUserByEmail(req.body.email);
    const isValidPassword = await result?.isValidPassword(req.body.password);
    if (!result || !isValidPassword) {
      console.log(isValidPassword);
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }

    const id = result.id;
    const payload = { id, test: "bla-bla" };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });

    await Users.updateToken(id, token);
    return res.json({ status: "success", code: HttpCode.OK, data: { token } });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (e) {
    next(e);
  }
};

const current = async (req, res, next) => {
  try {
    console.log(req);
    if (!req.user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }

    const { email, subscription } = req.user;

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      user: { email, subscription },
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

// *****SECOND OPTION: cloud upload*********

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService();
    const { idCloudAvatar, avatarURL } = await uploads.saveAvatar(
      req.file.path,
      req.user.idCloudAvatar
    );

    await fs.unlink(req.file.path);

    await Users.updateAvatar(id, avatarURL, idCloudAvatar);
    res.json({ status: "success", code: HttpCode.OK, data: { avatarURL } });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, logout, current, avatars };
