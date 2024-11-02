/** @jest-environment node */
const request = require("supertest");
const jwt = require("jsonwebtoken");
const express = require("express");

// Mock des dépendances
const mockTask = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

// Mock des modèles
jest.mock(
  "../../../src/models",
  () => ({
    Task: mockTask,
  }),
  { virtual: true }
);

// Mock du controller avec toutes les méthodes nécessaires
jest.mock("../../../src/controllers/taskController", () => ({
  getAllTasks: async (req, res) => {
    const tasks = await mockTask.findAll();
    res.status(200).json(tasks);
  },
  createTask: async (req, res) => {
    const task = await mockTask.create({ ...req.body, userId: req.user.id });
    res.status(201).json(task);
  },
  getTaskById: async (req, res) => {
    const task = await mockTask.findOne({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  },
  updateTask: async (req, res) => {
    const task = await mockTask.findOne({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });
    await task.save();
    res.status(200).json(task);
  },
  updateTaskStatus: async (req, res) => {
    const task = await mockTask.findOne({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.status = req.body.status;
    await task.save();
    res.status(200).json(task);
  },
  deleteTask: async (req, res) => {
    await mockTask.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Task deleted" });
  },
}));

// Configuration de l'app Express
const app = express();
app.use(express.json());

// Import des routes après les mocks
const taskRoutes = require("../../../src/routes/taskRoutes");
const authMiddleware = require("../../../src/middleware/authMiddleware");

app.use("/api/tasks", authMiddleware, taskRoutes);

describe("Task Routes", () => {
  let authToken;

  beforeAll(() => {
    const jwtSecret = process.env.JWT_SECRET || "test-secret-key";
    authToken = jwt.sign({ id: 1 }, jwtSecret);
  });

  beforeEach(() => {
    // Reset tous les mocks
    Object.values(mockTask).forEach((mock) => mock.mockReset());
  });

  describe("GET /api/tasks", () => {
    it("should get all tasks with authentication", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", userId: 1 },
        { id: 2, title: "Task 2", userId: 1 },
      ];
      mockTask.findAll.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    it("should return 401 without authentication", async () => {
      const response = await request(app).get("/api/tasks");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task with valid data", async () => {
      const newTask = {
        title: "Test Task",
        description: "Test Description",
        status: "en_cours",
      };

      mockTask.create.mockResolvedValue({
        id: 1,
        ...newTask,
        userId: 1,
      });

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("title", newTask.title);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update existing task", async () => {
      const taskId = 1;
      const updateData = {
        title: "Updated Task",
        status: "terminé",
      };

      const mockUpdatedTask = {
        id: taskId,
        ...updateData,
        userId: 1,
        save: jest.fn().mockResolvedValue(true),
      };

      mockTask.findOne.mockResolvedValue(mockUpdatedTask);

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("title", updateData.title);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete existing task", async () => {
      const taskId = 1;
      mockTask.destroy.mockResolvedValue(1);

      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Task deleted");
    });
  });
});
