const Joi = require("joi");

const schemaAddUser = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(4).required(),
  subscription: Joi.string().optional(),
});

const schemaUserLogin = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(4).required(),
});

const validate = async (schema, request, next) => {
  try {
    await schema.validateAsync(request);
    next();
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ""),
    });
  }
};

module.exports = {
  validationAddUser: (req, _res, next) => {
    return validate(schemaAddUser, req.body, next);
  },
  validationUserLogin: (req, _res, next) => {
    return validate(schemaUserLogin, req.body, next);
  },
};
