const request = require("supertest");
const app = require("../../src/app");
const jwt = require("jsonwebtoken");

describe("Auth Middleware", () => {
  it("should reject requests without token", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(401);
  });

  it("should reject invalid tokens", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", "Bearer invalid.token.here");

    expect(response.status).toBe(403);
  });

  it("should accept valid tokens", async () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || "test-secret");

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
