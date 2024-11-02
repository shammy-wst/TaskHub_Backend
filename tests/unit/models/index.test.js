// Mock des modèles
jest.mock("../../../src/models/Status", () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn(),
    associate: jest.fn(),
  }));
});

jest.mock("../../../src/models/Task", () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn(),
    associate: jest.fn(),
  }));
});

jest.mock("../../../src/models/User", () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn(),
    associate: jest.fn(),
  }));
});

// Mock Sequelize
jest.mock("sequelize", () => {
  const mSequelize = {
    authenticate: jest.fn().mockResolvedValue(true),
    define: jest.fn().mockReturnValue({}),
    sync: jest.fn().mockResolvedValue({}),
    import: jest.fn().mockReturnValue({}),
  };

  const Sequelize = jest.fn(() => mSequelize);
  Sequelize.DataTypes = {
    STRING: "STRING",
    INTEGER: "INTEGER",
    DATE: "DATE",
    BOOLEAN: "BOOLEAN",
  };

  return {
    Sequelize,
    Model: class {},
  };
});

describe("Models Index", () => {
  it("should initialize database connection", () => {
    const models = require("../../../src/models");
    expect(models).toBeDefined();
    expect(models.sequelize).toBeDefined();
  });
});
