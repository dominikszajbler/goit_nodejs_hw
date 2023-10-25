const mongoose = require("mongoose");
const gravatar = require("gravatar");
const userSchema = new mongoose.Schema({
  password: {
    type: String,
    require: [true, "Password is required"],
  },
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: "200", r: "pg", d: "mm" });
    },
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
});
const User = mongoose.model("User", userSchema);

module.exports = { User };
