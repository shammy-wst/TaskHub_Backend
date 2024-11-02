require("dotenv").config();
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Configuration CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods",
    ],
    exposedHeaders: ["Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", authenticateToken, taskRoutes);

// Gestion des erreurs simplifiée
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
