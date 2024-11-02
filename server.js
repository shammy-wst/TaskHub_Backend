require("dotenv").config();
const express = require("express");
const { sequelize } = require("./src/config/config");

const app = express();

// Test de connexion à la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion à la base de données établie avec succès.");
  })
  .catch((err) => {
    console.error("Impossible de se connecter à la base de données:", err);
  });

// Utiliser uniquement sequelize de models/index.js
sequelize
  .sync()
  .then(() => {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
