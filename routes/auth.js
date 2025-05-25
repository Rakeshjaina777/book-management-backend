import express from "express";
import { signup, login } from "../src/controllers/authController.js";
import { check, validationResult } from "express-validator";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Email already exists or validation failed
 */
router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").isLength({ min: 6 }).withMessage("Password too short"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(
        "⚠️  Validation failed in /api/auth/signup:",
        errors.array()
      );
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("✅ Signup request received for:", req.body.email);
    signup(req, res);
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user and return JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Token returned
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/auth/login",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("⚠️  Validation failed in /api/auth/login:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("✅ Login request received for:", req.body.email);
    login(req, res);
  }
);

export default router;
