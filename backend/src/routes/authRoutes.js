const express = require("express");

const { loginAdmin } = require("../controller/authController");

const router = express.Router();

router.post("/admin/login", loginAdmin);

module.exports = router;
