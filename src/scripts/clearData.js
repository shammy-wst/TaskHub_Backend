const { Task, User, sequelize } = require("../models");

async function clearAllData() {
  try {
    // Démarrer une transaction
    await sequelize.transaction(async (t) => {
      // Désactiver temporairement les contraintes de clé étrangère
      await sequelize.query("SET CONSTRAINTS ALL DEFERRED", { transaction: t });

      // Supprimer d'abord les tâches (table enfant)
      await Task.destroy({
        where: {},
        force: true,
        truncate: true,
        cascade: true,
        transaction: t,
      });

      // Puis supprimer les utilisateurs (table parent)
      await User.destroy({
        where: {},
        force: true,
        truncate: true,
        cascade: true,
        transaction: t,
      });

      // Réactiver les contraintes
      await sequelize.query("SET CONSTRAINTS ALL IMMEDIATE", {
        transaction: t,
      });
    });

    console.log("Toutes les données ont été effacées avec succès");
  } catch (error) {
    console.error("Erreur lors de la suppression des données:", error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

clearAllData();
