require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "taskhub",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
  test: {
    username: "myuser",
    password: "mypassword",
    database: "taskhub_test",
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
