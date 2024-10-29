const request = require("supertest");
const app = require("../../src/app");
const Task = require("../../src/models/Task");
const jwt = require("jsonwebtoken");

const authToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || "test-secret");

describe("TaskController", () => {
  // Test pour les cas d'erreur
  it("should handle validation error in createTask", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        /* données invalides */
      });
    expect(response.status).toBe(400);
  });

  // Test pour getTaskById
  it("should get task by id", async () => {
    const task = await Task.create({
      title: "Test Task",
      description: "Description",
      completed: false,
    });

    const response = await request(app)
      .get(`/api/tasks/${task.id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(task.id);
  });

  // Test pour updateTask
  it("should update task", async () => {
    const task = await Task.create({
      title: "Original Title",
      description: "Description",
      completed: false,
    });

    const response = await request(app)
      .put(`/api/tasks/${task.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Updated Title",
        description: "Updated Description",
        completed: false,
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Title");
  });

  // Test pour deleteTask
  it("should delete task", async () => {
    const task = await Task.create({
      title: "To Delete",
      description: "Description",
      completed: false,
    });

    const response = await request(app)
      .delete(`/api/tasks/${task.id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });
});
