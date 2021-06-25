const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const boolParser = require("express-query-boolean");
const path = require("path");
require("dotenv").config();
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;

const { HttpCode, limiterApi } = require("./helpers/constants");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());
app.use(express.static(path.join(__dirname, AVATAR_OF_USERS)));
app.get("env") !== "test" && app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 }));
app.use(boolParser());

app.use("/api/", rateLimit(limiterApi));

app.use("/api/", require("./routes/api/"));

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: "fail", code: HttpCode.NOT_FOUND, message: "Not found" });
});

app.use((err, req, res, next) => {
  const codeStatus = err.status || HttpCode.INTERNAL_SERVER_ERROR;
  res.status(codeStatus).json({
    status: codeStatus === HttpCode.INTERNAL_SERVER_ERROR ? "fail" : "error",
    code: codeStatus,
    message: err.message,
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

module.exports = app;
