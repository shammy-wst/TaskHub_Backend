require("dotenv").config();
const { Sequelize } = require("sequelize");

// Nettoyage des valeurs d'environnement
const dbConfig = {
  database: process.env.DB_NAME?.trim() || "taskhub",
  username: process.env.DB_USER?.trim() || "postgres",
  password: process.env.DB_PASSWORD?.trim() || "postgres",
  host: process.env.DB_HOST?.trim() || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  dialect: "postgres",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
  }
);

module.exports = {
  port: parseInt(process.env.PORT || "3000", 10),
  sequelize,
  dbConfig, // exporter la config pour les tests
};
