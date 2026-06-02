const crypto = require("node:crypto");
const User = require("../models/User");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createSessionToken = (email) =>
  crypto
    .createHash("sha256")
    .update(`${email}:${Date.now()}:${crypto.randomUUID()}`)
    .digest("hex");

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError("Email and password are required", 400);
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists, is an admin, and password is valid
    if (!user || user.role !== "admin" || !user.isValidPassword(password)) {
      throw createError("Invalid admin credentials", 401);
    }

    res.json({
      token: createSessionToken(email),
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdmin,
};
