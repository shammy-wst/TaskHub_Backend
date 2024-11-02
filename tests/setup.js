/** @jest-environment node */
const { Client } = require("pg");
const { sequelize } = require("../src/models");
const jwt = require("jsonwebtoken");
const logger = require("./mocks/logger");

// Import des fonctions de Jest
const { beforeAll, afterAll, beforeEach } = require("@jest/globals");

// Configuration de l'environnement de test
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.DB_NAME = "taskhub_test";
process.env.DB_USER = "myuser";
process.env.DB_PASSWORD = "mypassword";
process.env.DB_HOST = "localhost";
process.env.DB_PORT = "5432";

async function createTestDatabase() {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: "postgres", // Se connecte à la base par défaut
  });

  try {
    await client.connect();
    // Vérifie si la base de test existe
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (result.rows.length === 0) {
      // Crée la base de test si elle n'existe pas
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    }
  } catch (error) {
    console.error("Erreur lors de la création de la base de test:", error);
  } finally {
    await client.end();
  }
}

beforeAll(async () => {
  try {
    await createTestDatabase();
    await sequelize.sync({ force: true });
    global.testToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Erreur d'initialisation des tests:", error);
  }
});

afterAll(async () => {
  await sequelize.close();
});

// Désactiver les logs pendant les tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();

  // Reset logger mocks
  Object.keys(logger).forEach((key) => {
    logger[key].mockClear();
  });
});
