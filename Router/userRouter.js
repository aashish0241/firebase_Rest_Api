const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateProfile,
  getProfile,
} = require("../Controller/authController");
const authenticate = require("../Middleware/authenticate");

//register user
/**
 * @swagger
 * api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone_number:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 */
router.post("/register", register);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);
/**
 * @swagger
 * /api/v1/auth/user/profile:
 *   put:
 *     summary: Update a user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []  # Adds the bearer token security requirement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phone_number:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */

router.put("/user/profile", authenticate, updateProfile);
/**
 * @swagger
 * /api/v1/auth/user/profile:
 *   get:
 *     summary: Retrieve user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []  # Requires Bearer Token for authentication
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone_number:
 *                   type: string
 *                 preferences:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                     notifications:
 *                       type: boolean
 *                 status:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 */

router.get("/user/profile", authenticate, getProfile);

module.exports = router;
