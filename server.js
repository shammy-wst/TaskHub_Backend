require("dotenv").config();
const express = require("express");
const app = express();
const { sequelize } = require("./src/models");
const PORT = parseInt(process.env.PORT || "3001", 10);

// Middleware pour parser le JSON
app.use(express.json());

// Routes de base pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.json({ message: "TaskHub API is running" });
});

// Démarrage du serveur indépendamment de la base de données
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

// Tentative de connexion à la base de données
sequelize
  .sync()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
