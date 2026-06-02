const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "src", ".env") });

const app = require("./src/app");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Seed admin user if it doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const adminUser = new User({
        email: adminEmail,
        role: "admin",
      });
      adminUser.setPassword(process.env.ADMIN_PASSWORD || "admin123");
      await adminUser.save();
      console.log(`Admin user seeded with email: ${adminEmail}`);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
