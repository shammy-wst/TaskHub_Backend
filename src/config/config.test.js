const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  database: "taskhub_test",
  username: "myuser",
  password: "mypassword",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Test la connexion
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion à la base de données de test établie.");
  })
  .catch((err) => {
    console.error(
      "Impossible de se connecter à la base de données de test:",
      err
    );
  });

module.exports = {
  sequelize,
  port: 3000,
};
