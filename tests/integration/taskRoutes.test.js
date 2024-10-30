/** @jest-environment node */
const request = require("supertest");
const app = require("../../src/app");
const { sequelize } = require("../../src/config/config.test");
const jwt = require("jsonwebtoken");
const Task = require("../../src/models/Task");

describe("Task API Integration Tests", () => {
  let authToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Créer une tâche de test
    await Task.create({
      title: "Test Task",
      description: "Test Description",
      completed: false,
    });

    const jwtSecret = process.env.JWT_SECRET || "test-secret";
    authToken = jwt.sign({ id: 1 }, jwtSecret);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("Authentication", () => {
    it("should handle missing token (401)", async () => {
      const response = await request(app).get("/api/tasks");
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Non autorisé" });
    });

    it("should handle invalid token (403)", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Bearer invalid_token");
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: "Interdit" });
    });

    it("should handle valid token (200)", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Integration Test Task",
          description: "Test Description",
          completed: false,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("title", "Integration Test Task");
    });

    it("should handle invalid task creation", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Test Task",
          description: "Test Description",
          completed: false,
        });

      expect(response.status).toBe(201);
    });
  });

  describe("GET /api/tasks", () => {
    it("should return all tasks", async () => {
      // D'abord créer une tâche
      await Task.create({
        title: "Test Task for GET",
        description: "Test Description",
        completed: false,
      });

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("title");
    });
  });

  describe("Edge Cases", () => {
    it("should handle non-existent task", async () => {
      const response = await request(app)
        .get("/api/tasks/999999")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it("should handle malformed task data", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it("should handle pagination correctly", async () => {
      // Créer 15 tâches
      for (let i = 0; i < 15; i++) {
        await Task.create({
          title: `Task ${i}`,
          description: "Description",
          completed: false,
        });
      }

      const response = await request(app)
        .get("/api/tasks?limit=10&offset=5")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(10);
    });
  });
});
