const express = require("express");
const fs = require("fs");
const path = require("path");
const Setting = require("../models/Setting");
const router = express.Router();

// Get a setting by key
router.get("/:key", async (req, res, next) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return res.json({ key: req.params.key, value: null });
    }
    res.json(setting);
  } catch (error) {
    next(error);
  }
});

// Create or update a setting
router.put("/:key", async (req, res, next) => {
  try {
    let { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ message: "Value is required" });
    }

    // Check if the value is a Base64 string for a video (like data:video/mp4;base64,...)
    if (typeof value === "string" && value.startsWith("data:video/")) {
      const matches = value.match(/^data:video\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");

        const uploadDir = path.join(__dirname, "../../public/uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = `${req.params.key}-${Date.now()}.${ext}`;
        const filepath = path.join(uploadDir, filename);

        fs.writeFileSync(filepath, buffer);

        // Replace the Base64 value with the public URL
        value = `/uploads/${filename}`;
      }
    }

    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true, upsert: true }
    );

    res.json(setting);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
