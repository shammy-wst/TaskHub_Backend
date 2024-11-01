// src/models/Task.js

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "tasks",
    }
  );

  Task.associate = function (models) {
    Task.belongsTo(models.Status, { foreignKey: "statusId" });
  };

  return Task;
};
