const request = require("supertest");
const express = require("express");
const router = require("../Router/userRouter");

// Mock Controllers
jest.mock("../Controller/authController", () => ({
  register: jest.fn((req, res) => {
    const { name, email, phoneNumber, password } = req.body;

    // Simulate validation errors
    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (req.body.email === "duplicate@example.com") {
      return res.status(400).json({ message: "Email already in use" });
    }
    return res.status(201).json({ message: "User registered successfully" });
  }),
  login: jest.fn((req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (req.body.password !== "testpassword") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return res.status(200).json({ token: "mocked-jwt-token" });
  }),
  updateProfile: jest.fn((req, res) => {
    const { name, email, phoneNumber } = req.body;
    if (!name || !email || !phoneNumber) {
      return res.status(400).json({ message: "Invalid input fields" });
    }
    if (req.body.email === "duplicate@example.com") {
      return res.status(400).json({ message: "Email already in use" });
    }
    return res.status(200).json({ message: "Profile updated successfully" });
  }),
  getProfile: jest.fn((req, res) => {
    return res
      .status(200)
      .json({ name: "Test User", email: "test@example.com" });
  }),
}));

// Mock Middleware
jest.mock("../Middleware/authenticate", () => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || token !== "mocked-jwt-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = { userId: "mocked-user-id" };
  next();
});

// Initialize express app
const app = express();
app.use(express.json());
app.use("/api/v1/auth", router);

describe("Authentication Routes - Comprehensive Tests", () => {
  // Positive Test Cases
  test("POST /api/v1/auth/register - should register a user", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      phoneNumber: "+12345678901",
      password: "testpassword",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User registered successfully"
    );
  });

  test("POST /api/v1/auth/login - should log in a user", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "testpassword",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token", "mocked-jwt-token");
  });

  test("GET /api/v1/auth/user/profile - should retrieve user profile", async () => {
    const response = await request(app)
      .get("/api/v1/auth/user/profile")
      .set("Authorization", "Bearer mocked-jwt-token");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "Test User");
    expect(response.body).toHaveProperty("email", "test@example.com");
  });

  test("PUT /api/v1/auth/user/profile - should update user profile", async () => {
    const response = await request(app)
      .put("/api/v1/auth/user/profile")
      .set("Authorization", "Bearer mocked-jwt-token")
      .send({
        name: "Updated User",
        email: "updated@example.com",
        phoneNumber: "+12345678902",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Profile updated successfully"
    );
  });

  // Negative Test Cases
  test("POST /api/v1/auth/register - should fail for missing fields", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "test@example.com",
      phoneNumber: "+12345678901",
      password: "testpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Missing required fields");
  });

  test("POST /api/v1/auth/register - should fail for invalid email format", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "invalid-email",
      phoneNumber: "+12345678901",
      password: "testpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid email format");
  });

  test("POST /api/v1/auth/login - should fail for invalid credentials", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  test("POST /api/v1/auth/login - should fail for missing password", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Missing required fields");
  });

  test("GET /api/v1/auth/user/profile - should fail for unauthorized access", async () => {
    const response = await request(app).get("/api/v1/auth/user/profile");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  test("PUT /api/v1/auth/user/profile - should fail for duplicate email", async () => {
    const response = await request(app)
      .put("/api/v1/auth/user/profile")
      .set("Authorization", "Bearer mocked-jwt-token")
      .send({
        name: "Test User",
        email: "duplicate@example.com",
        phoneNumber: "+12345678901",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email already in use");
  });

  test("PUT /api/v1/auth/user/profile - should fail for unauthorized access", async () => {
    const response = await request(app).put("/api/v1/auth/user/profile").send({
      name: "Test User",
      email: "updated@example.com",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  test("PUT /api/v1/auth/user/profile - should fail for invalid input fields", async () => {
    const response = await request(app)
      .put("/api/v1/auth/user/profile")
      .set("Authorization", "Bearer mocked-jwt-token")
      .send({
        name: "",
        email: "updated@example.com",
        phoneNumber: "123",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid input fields");
  });
});
