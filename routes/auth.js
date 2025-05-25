const express = require("express");
const { signup, login } = require("../controllers/authController");
const { check, validationResult } = require("express-validator");

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
 *         description: Email already exists
 */
router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").isLength({ min: 6 }).withMessage("Password too short"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
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
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token returned
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    login(req, res);
  }
);

module.exports = router;
