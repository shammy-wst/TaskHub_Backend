require("dotenv").config();
const express = require("express");
const app = express();
const { sequelize } = require("./src/models");

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
