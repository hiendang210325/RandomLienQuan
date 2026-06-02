const mongoose = require("mongoose");
const crypto = require("node:crypto");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Method to set password
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.password = crypto.scryptSync(password, this.salt, 64).toString("hex");
};

// Method to check password
userSchema.methods.isValidPassword = function (password) {
  if (!this.salt) return false;
  const hash = crypto.scryptSync(password, this.salt, 64).toString("hex");
  return this.password === hash;
};

module.exports = mongoose.model("User", userSchema);
