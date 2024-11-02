const { Task, User, sequelize } = require("../models");
const logger = require("../utils/logger");

async function clearAllData() {
  try {
    await sequelize.transaction(async (t) => {
      logger.info("Début de la suppression des données");

      await sequelize.query("SET CONSTRAINTS ALL DEFERRED", { transaction: t });

      logger.debug("Suppression des tâches");
      await Task.destroy({
        where: {},
        force: true,
        truncate: true,
        cascade: true,
        transaction: t,
      });

      logger.debug("Suppression des utilisateurs");
      await User.destroy({
        where: {},
        force: true,
        truncate: true,
        cascade: true,
        transaction: t,
      });

      await sequelize.query("SET CONSTRAINTS ALL IMMEDIATE", {
        transaction: t,
      });
      logger.info("Suppression des données terminée avec succès");
    });
  } catch (error) {
    logger.error("Erreur lors de la suppression des données:", error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

clearAllData();
