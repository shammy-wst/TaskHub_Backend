require("dotenv").config();
console.log("Variables d'environnement chargées:", {
  jwt_secret_exists: !!process.env.JWT_SECRET,
  env_keys: Object.keys(process.env),
});
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes"); // Import direct
const authenticateToken = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Ajoutez ceci avant les routes de tâches
app.use("/api/auth", authRoutes);

// Appliquer le middleware d'authentification à toutes les routes /api/tasks
app.use("/api/tasks", authenticateToken, taskRoutes);

// Middleware de gestion d'erreur global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message:
      err.status === 404
        ? "Route non trouvée"
        : "Une erreur interne est survenue.",
  });
});

module.exports = app;
