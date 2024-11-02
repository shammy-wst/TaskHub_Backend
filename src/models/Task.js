const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("en_attente", "en_cours", "terminé"),
      defaultValue: "en_attente",
      allowNull: false,
      validate: {
        isIn: [["en_attente", "en_cours", "terminé"]],
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Task;
};
