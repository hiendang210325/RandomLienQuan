const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const characterRoutes = require("./routes/characterRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

const app = express();

const path = require("path");

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));


// Root route for development
if (process.env.NODE_ENV !== "production") {
  app.get("/", (_req, res) => {
    res.json({ message: "Backend API is running in Development mode" });
  });
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/galleries", galleryRoutes);
app.use("/api/settings", require("./routes/settingRoutes"));

// Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
  // Trỏ tới thư mục build của Vite ở frontend
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // Bất kỳ route nào không phải là API thì trả về file index.html của React
  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }

    res.sendFile(path.resolve(__dirname, "../../frontend/dist", "index.html"));
  });
}
app.use(notFound);
app.use(errorHandler);

module.exports = app;
