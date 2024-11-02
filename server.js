require("dotenv").config();
const app = require("./src/app");
const { sequelize } = require("./src/models");
const PORT = parseInt(process.env.PORT || "3001", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

sequelize.sync().catch((error) => {
  console.error("Database connection error:", error);
});
