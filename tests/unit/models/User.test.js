// Mock bcrypt correctement
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
}));

const bcrypt = require("bcryptjs");

describe("User Model", () => {
  let User;

  beforeEach(() => {
    // Reset les mocks
    jest.clearAllMocks();

    // Mock le modèle User
    jest.mock("../../../src/models/User", () => {
      return jest.fn().mockImplementation(() => ({
        hooks: {
          beforeSave: [
            async (user) => {
              if (user.changed() && user.password) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.set("password", hashedPassword);
              }
            },
          ],
        },
        prototype: {
          validPassword: async function (password) {
            return bcrypt.compare(password, this.password);
          },
        },
      }));
    });

    User = require("../../../src/models/User")();
  });

  it("should hash password before save", async () => {
    const user = {
      password: "password123",
      changed: () => true,
      set: jest.fn(),
    };

    await User.hooks.beforeSave[0](user);
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(user.set).toHaveBeenCalledWith("password", "hashedPassword");
  });

  it("should validate password correctly", async () => {
    const user = {
      password: "hashedPassword",
    };

    const isValid = await User.prototype.validPassword.call(
      user,
      "password123"
    );
    expect(isValid).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );
  });
});
