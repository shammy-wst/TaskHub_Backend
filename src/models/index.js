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
  if (config.use_env_variable && process.env[config.use_env_variable]) {
    const dbUrl = process.env[config.use_env_variable];
    if (!dbUrl) {
      throw new Error(
        `La variable d'environnement ${config.use_env_variable} n'est pas définie`
      );
    }
    sequelize = new Sequelize(dbUrl, {
      ...config,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  } else {
    if (!config.database || !config.username) {
      throw new Error("La configuration de la base de données est incomplète");
    }

    const dbConfig = {
      database: config.database,
      username: config.username,
      password: config.password || "",
      host: config.host || "localhost",
      dialect: config.dialect || "postgres",
      ...config,
    };

    sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
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
