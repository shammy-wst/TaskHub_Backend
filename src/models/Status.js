// src/models/Status.js

module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define(
    "Status",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "statuses",
    }
  );

  Status.associate = (models) => {
    Status.hasMany(models.Task, { foreignKey: "statusId" });
  };

  return Status;
};
