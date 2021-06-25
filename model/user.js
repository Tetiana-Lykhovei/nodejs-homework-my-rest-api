const { Schema, model } = require("mongoose");
const gr = require("gravatar");
const { nanoid } = require("nanoid");
const { Subscription } = require("../helpers/constants");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 6;

const userSchema = new Schema(
  {
    name: { type: String, default: "Guest" },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/g;
        return re.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    subscription: {
      type: String,
      enum: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
      default: Subscription.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      defailt: function () {
        return gr.url(this.email, { s: "250" }, true);
      },
    },
    idCloudAvatar: {
      type: String,
      default: null,
    },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String, required: true, default: nanoid() },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("user", userSchema);

module.exports = User;
