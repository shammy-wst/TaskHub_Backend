"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "statuses",
      [
        {
          id: 2,
          name: "en_cours",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "terminé",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 1,
          name: "en_attente",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("statuses", null, {});
  },
};
