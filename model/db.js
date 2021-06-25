const mongoose = require("mongoose");
require("dotenv").config();

let uriDB = null;

if (process.env.NODE_ENV === "test") {
  uriDB = process.env.URI_DB_TEST;
} else {
  uriDB = process.env.URI_DB;
}

const db = mongoose.connect(uriDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 5,
});

if (process.env.NODE_ENV !== "test") {
  mongoose.connection.on("connected", () => {
    console.log(`Mongoose connection successful ${uriDB}`);
  });

  mongoose.connection.on("errore", (er) => {
    console.log(`Errore mongoose connection ${er.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
  });
}

process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Database connection successful");
    process.exit(1);
  });
});

module.exports = db;
