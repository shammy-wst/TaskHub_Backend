const http = require("http");
const app = require("./src/app");
const config = require("./src/config/config");

const server = http.createServer(app);

// Synchronisation avec la base de données
config.sequelize
  .sync()
  .then(() => {
    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log("Database synchronized and Task model is ready");
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
