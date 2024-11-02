require("dotenv").config();
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const logger = require("./utils/logger");

const app = express();

// Configuration CORS pour dev et prod
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://task-hub-taupe.vercel.app",
      /\.vercel\.app$/,
    ],
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
app.use("/api/auth", authRoutes);
app.use("/api/tasks", authenticateToken, taskRoutes);

// Log des requêtes en développement
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.url}`, {
      body: req.body,
      query: req.query,
    });
    next();
  });
}

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  logger.error("Erreur non gérée:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Log du démarrage de l'application
logger.info(`Application démarrée en mode ${process.env.NODE_ENV}`);

module.exports = app;
