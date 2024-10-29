require("dotenv").config();
const { Sequelize } = require("sequelize");

// Fonction pour charger et valider les variables d'environnement
function getEnvVariable(key, defaultValue) {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(
      `La variable d'environnement ${key} est requise mais non définie.`
    );
  }
  return value;
}

// Utilisation de la fonction pour assurer des valeurs de type `string`
const dbName = getEnvVariable("DB_NAME", "taskhub");
const dbUser = getEnvVariable("DB_USER", "myuser");
const dbPassword = getEnvVariable("DB_PASSWORD", "mypassword");
const dbHost = getEnvVariable("DB_HOST", "localhost");
const dbPort = parseInt(getEnvVariable("DB_PORT", "5432"), 10);

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "postgres",
  port: dbPort,
  logging: false,
});

module.exports = {
  port: parseInt(getEnvVariable("PORT", "3000"), 10),
  sequelize,
};
