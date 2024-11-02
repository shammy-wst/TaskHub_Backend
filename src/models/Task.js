// src/models/Task.js

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  Task.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.STRING,
        defaultValue: "en_attente",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      statusId: {
        type: DataTypes.INTEGER,
        references: {
          model: "statuses",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Task",
    }
  );

  return Task;
};
