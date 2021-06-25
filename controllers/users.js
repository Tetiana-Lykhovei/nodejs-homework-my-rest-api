const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const EmailService = require("../services/email");
const {
  CreateSenderNodemailer,
  CreateSenderSendGrid,
} = require("../services/email-sender");

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
    const { id, name, email, subscription, avatar, verifyToken } =
      await Users.cteateUser(req.body);

    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendGrid()
      );
      await emailService.sendVerifyEmail(verifyToken, email, name);
    } catch (error) {
      console.log(error.message);
    }

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { id, name, email, subscription, avatar },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await Users.findUserByEmail(req.body.email);
    const isValidPassword = await result?.isValidPassword(req.body.password);
    if (!result || !isValidPassword || !result.isVerified) {
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

const verify = async (req, res, next) => {
  try {
    const user = await Users.findUserByVerifyToken(req.params.token);
    if (user) {
      await Users.updateTokenVerify(user.id, true, null);
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: { message: "Success" },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "Verification token is not valid",
    });
  } catch (er) {
    next(er);
  }
};

const repeatEmailVerification = async (req, res, next) => {
  try {
    const user = await Users.findUserByEmail(req.body.email);
    if (user) {
      const { name, email, isVerified, verifyToken } = user;
      if (!isVerified) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderSendGrid()
        );
        await emailService.sendVerifyEmail(verifyToken, email, name);
        return res.json({
          status: "success",
          code: HttpCode.OK,
          data: { message: "Resubmitted success" },
        });
      }
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email has been verified",
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (er) {
    next(er);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  avatars,
  verify,
  repeatEmailVerification,
};
