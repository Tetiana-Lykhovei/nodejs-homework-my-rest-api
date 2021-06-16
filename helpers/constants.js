const Subscription = {
  STARTER: "starter",
  PRO: "pro",
  BUSINESS: "business",
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUEST: 429,
  INTERNAL_SERVER_ERROR: 500,
};

const limiterApi = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  handler: (req, res, next) => {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: "error",
      code: HttpCode.TOO_MANY_REQUEST,
      message: "Too many request",
    });
  },
};

module.exports = { Subscription, HttpCode, limiterApi };
