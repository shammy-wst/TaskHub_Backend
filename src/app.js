const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes"); // Import direct
const authenticateToken = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Application du middleware directement sur les routes si nécessaire
app.use("/api/tasks", taskRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Une erreur interne est survenue." });
});

module.exports = app;
