require("dotenv").config();
const express = require("express");
const app = express();
const { sequelize } = require("./src/models");

// Middleware pour parser le JSON
app.use(express.json());

// Routes de base pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.json({ message: "TaskHub API is running" });
});

// Conversion du port en nombre
const PORT = parseInt(process.env.PORT || "3001", 10);

// Démarrage du serveur
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
