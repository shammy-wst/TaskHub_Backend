/** @jest-environment node */
const { sequelize } = require("../src/config/config");
const jwt = require("jsonwebtoken");

// Configuration de l'environnement de test
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";
process.env.DB_NAME = "taskhub_test";
process.env.DB_USER = "myuser";
process.env.DB_PASSWORD = "mypassword";
process.env.DB_HOST = "localhost";
process.env.DB_PORT = "5432";

beforeAll(async () => {
  try {
    // Synchroniser la base de données de test
    await sequelize.sync({ force: true });

    // Créer un token valide pour les tests
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
