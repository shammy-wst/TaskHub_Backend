/** @jest-environment node */
jest.mock("../../../src/models", () => ({
  Task: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Status: {
    findAll: jest.fn(),
  },
}));

const { Task } = require("../../../src/models");
const taskService = require("../../../src/services/taskService");

describe("TaskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        status: "en_cours",
      };
      const userId = 1;

      const mockCreatedTask = {
        id: 1,
        ...taskData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      Task.create.mockResolvedValue(mockCreatedTask);

      const result = await taskService.createTask(taskData, userId);

      expect(Task.create).toHaveBeenCalledWith({
        ...taskData,
        userId,
      });
      expect(result).toEqual(mockCreatedTask);
    });
  });

  describe("updateTaskStatus", () => {
    it("should update task status", async () => {
      const taskId = 1;
      const userId = 1;
      const newStatus = "terminé";

      const mockTask = {
        id: taskId,
        userId,
        status: "en_cours",
        save: jest.fn().mockResolvedValue(true),
      };

      Task.findOne.mockImplementation(() => Promise.resolve(mockTask));

      const result = await taskService.updateTaskStatus(
        taskId,
        newStatus,
        userId
      );

      expect(Task.findOne).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(result.status).toBe(newStatus);
      expect(mockTask.save).toHaveBeenCalled();
    });

    it("should return null if task not found", async () => {
      Task.findOne.mockResolvedValue(null);

      const result = await taskService.updateTaskStatus(1, "terminé", 1);

      expect(result).toBeNull();
    });
  });

  describe("getTaskById", () => {
    it("should get task by id", async () => {
      const taskId = 1;
      const userId = 1;
      const mockTask = { id: taskId, userId, title: "Test Task" };

      Task.findOne.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(taskId, userId);

      expect(Task.findOne).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(result).toEqual(mockTask);
    });

    it("should throw error when task not found", async () => {
      Task.findOne.mockResolvedValue(null);

      await expect(taskService.getTaskById(1, 1)).rejects.toThrow(
        "Task not found"
      );
    });
  });

  describe("updateTask", () => {
    it("should update task successfully", async () => {
      const taskId = 1;
      const userId = 1;
      const updateData = { title: "Updated Task" };

      const mockTask = {
        id: taskId,
        userId,
        ...updateData,
        update: jest.fn().mockResolvedValue(true),
      };

      Task.findOne.mockResolvedValue(mockTask);

      const result = await taskService.updateTask(taskId, updateData, userId);

      expect(Task.findOne).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(mockTask.update).toHaveBeenCalledWith(updateData);
      expect(result).toBeTruthy();
    });
  });

  describe("deleteTask", () => {
    it("should delete task successfully", async () => {
      const taskId = 1;
      const userId = 1;

      const mockTask = {
        id: taskId,
        userId,
        destroy: jest.fn().mockResolvedValue(true),
      };

      Task.findOne.mockResolvedValue(mockTask);

      const result = await taskService.deleteTask(taskId, userId);

      expect(Task.findOne).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(mockTask.destroy).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });
  });
});
