const jwt = require("jsonwebtoken");
const authMiddleware = require("../../../src/middleware/authMiddleware");

describe("Auth Middleware", () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should return 401 if no authorization header", () => {
    authMiddleware(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Unauthorized",
      details: "Please login",
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return 403 for invalid token", () => {
    mockReq.headers.authorization = "Bearer invalid_token";

    authMiddleware(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid token",
      details: expect.any(String),
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should call next() for valid token", () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || "test-secret");
    mockReq.headers.authorization = `Bearer ${token}`;

    authMiddleware(mockReq, mockRes, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.id).toBe(1);
  });

  it("should handle invalid token format", () => {
    mockReq.headers.authorization = "InvalidFormat token";

    authMiddleware(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid authorization format",
      details: "Token must start with 'Bearer '",
    });
  });

  it("should handle expired token", () => {
    const expiredToken = jwt.sign({ id: 1 }, "secret", { expiresIn: "0s" });
    mockReq.headers.authorization = `Bearer ${expiredToken}`;

    authMiddleware(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid token",
      details: expect.any(String),
    });
  });
});
