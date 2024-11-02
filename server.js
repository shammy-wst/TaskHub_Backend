require("dotenv").config();
const express = require("express");
const { sequelize } = require("./src/models");

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

const http = require("http");
const config = require("./src/config/config");

const server = http.createServer(app);

config.sequelize
  .sync()
  .then(() => {
    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
