"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/database.js")[env];
const db = {};

let sequelize;
try {
  if (env === "production") {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  } else {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        dialect: config.dialect,
        ...config,
      }
    );
  }

  // Charger tous les modèles
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js" &&
        file.indexOf(".test.js") === -1
      );
    })
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(sequelize, DataTypes);
      db[model.name] = model;
    });

  // Définir les relations après que tous les modèles sont chargés
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
} catch (error) {
  console.error("Erreur lors de l'initialisation de Sequelize:", error);
  throw error;
}

module.exports = db;
