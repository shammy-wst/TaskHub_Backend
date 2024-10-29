/** @jest-environment node */
const { sequelize } = require("../src/config/config");

beforeAll(async () => {
  // Assurez-vous d'utiliser la base de données de test
  process.env.NODE_ENV = "test";
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
