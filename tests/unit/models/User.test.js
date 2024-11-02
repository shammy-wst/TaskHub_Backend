const { User } = require("../../../src/models");

describe("User Model", () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
  });

  it("should hash password before save", async () => {
    const setSpy = jest.spyOn(User.prototype, "set");

    const user = await User.create({
      username: "testuser",
      password: "password123",
    });

    expect(setSpy).toHaveBeenCalledWith("password", expect.any(String));
    expect(user.password).not.toBe("password123");

    setSpy.mockRestore();
  });

  it("should require username and password", async () => {
    const user = User.build({});
    await expect(user.validate()).rejects.toThrow("notNull Violation");
  });

  it("should enforce unique username", async () => {
    await User.create({
      username: "testuser",
      password: "password123",
    });

    await expect(
      User.create({
        username: "testuser",
        password: "password456",
      })
    ).rejects.toThrow();
  });
});
