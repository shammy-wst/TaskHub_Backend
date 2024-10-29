require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: "taskhub",
  username: "myuser",
  password: "mypassword",
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
});

module.exports = {
  port: parseInt(process.env.PORT || "3000", 10),
  sequelize,
};
