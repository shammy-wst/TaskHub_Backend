require("dotenv").config();
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origine (comme Postman)
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:5173", // Pour Vite.js en local
        /shammywsts-projects\.vercel\.app$/, // Pour votre domaine spécifique
        /\.vercel\.app$/, // Pour tous les domaines Vercel (backup)
      ].filter(Boolean);

      const isAllowed = allowedOrigins.some((allowed) =>
        typeof allowed === "string" ? origin === allowed : allowed.test(origin)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin); // Pour le debugging
        callback(new Error("Not allowed by CORS"));
      }
    },
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
