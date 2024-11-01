"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("statuses", [
      { name: "en_cours", createdAt: new Date(), updatedAt: new Date() },
      { name: "terminé", createdAt: new Date(), updatedAt: new Date() },
      { name: "en_attente", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("statuses", null, {});
  },
};
