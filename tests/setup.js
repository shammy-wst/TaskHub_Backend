/** @jest-environment node */
const { sequelize } = require("../src/config/config");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });

    // Créer un token valide pour les tests
    const jwtSecret = process.env.JWT_SECRET || "test-secret-key";
    global.testToken = jwt.sign({ id: 1 }, jwtSecret);
  } catch (error) {
    console.error("Erreur d'initialisation des tests:", error);
  }
});

afterAll(async () => {
  await sequelize.close();
});
