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
        status: "en_cours",
        save: jest.fn().mockResolvedValue({ status: newStatus }),
      };

      Task.findOne.mockResolvedValue(mockTask);

      const result = await taskService.updateTaskStatus(
        taskId,
        newStatus,
        userId
      );
      expect(result).toEqual({ status: newStatus });
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
      const mockTask = {
        id: 1,
        title: "Old Title",
        userId: 1,
        update: jest.fn().mockImplementation(function (data) {
          Object.assign(this, data);
          return this;
        }),
      };
      const updateData = { title: "New Title" };

      Task.findOne.mockResolvedValue(mockTask);

      const result = await taskService.updateTask(1, updateData, 1);

      expect(Task.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(mockTask.update).toHaveBeenCalledWith(updateData);
      expect(result.title).toBe("New Title");
    });

    it("should return null if task not found", async () => {
      Task.findOne.mockResolvedValue(null);

      const result = await taskService.updateTask(1, { title: "New Title" }, 1);

      expect(result).toBeNull();
    });

    it("should handle database error", async () => {
      Task.findOne.mockRejectedValue(new Error("Database error"));

      await expect(
        taskService.updateTask(1, { title: "New Title" }, 1)
      ).rejects.toThrow("Database error");
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

    it("should return false if task not found", async () => {
      Task.findOne.mockResolvedValue(null);

      const result = await taskService.deleteTask(1, 1);

      expect(result).toBe(false);
    });
  });

  describe("getAllTasks", () => {
    it("should get all tasks with pagination", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1" },
        { id: 2, title: "Task 2" },
      ];
      Task.findAll.mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasks(
        1,
        undefined,
        "createdAt",
        "DESC",
        0,
        10
      );

      expect(Task.findAll).toHaveBeenCalledWith({
        where: { userId: 1 },
        order: [["createdAt", "DESC"]],
        offset: 0,
        limit: 10,
      });
      expect(result).toEqual(mockTasks);
    });

    it("should handle database error", async () => {
      Task.findAll.mockRejectedValue(new Error("Database error"));

      await expect(
        taskService.getAllTasks(1, undefined, "createdAt", "DESC", 0, 10)
      ).rejects.toThrow("Database error");
    });
  });

  describe("getTaskById", () => {
    it("should return task if found", async () => {
      const mockTask = { id: 1, title: "Task 1", userId: 1 };
      Task.findOne.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1, 1);

      expect(Task.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockTask);
    });

    it("should throw error if task not found", async () => {
      Task.findOne.mockResolvedValue(null);

      await expect(taskService.getTaskById(1, 1)).rejects.toThrow(
        "Task not found"
      );
    });
  });

  describe("deleteTask", () => {
    it("should delete task successfully", async () => {
      const mockTask = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      Task.findOne.mockResolvedValue(mockTask);

      const result = await taskService.deleteTask(1, 1);

      expect(Task.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(mockTask.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should return false if task not found", async () => {
      Task.findOne.mockResolvedValue(null);

      const result = await taskService.deleteTask(1, 1);

      expect(result).toBe(false);
    });
  });
});
