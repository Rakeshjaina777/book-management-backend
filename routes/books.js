import express from "express";
import {
  createBook,
  getBooks,
  getBookById,
} from "../src/controllers/bookController.js";
import authenticate from "../src/middleware/auth.js";
import { check, query, validationResult } from "express-validator";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management endpoints
 */

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 * 
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - genre
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Great Gatsby
 *               author:
 *                 type: string
 *                 example: F. Scott Fitzgerald
 *               genre:
 *                 type: string
 *                 example: Classic Fiction
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  authenticate,
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("author").notEmpty().withMessage("Author is required"),
    check("genre").notEmpty().withMessage("Genre is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("Validation failed in POST /api/books:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("✅ Creating book with data:", req.body);
    createBook(req, res);
  }
);

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books with optional filters
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of books
 */
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("Validation failed in GET /api/books:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("✅ Fetching books with query:", req.query);
    getBooks(req, res);
  }
);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID with reviews and average rating
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page for review pagination
 *     responses:
 *       200:
 *         description: Book details with reviews
 *       404:
 *         description: Book not found
 */
router.get(
  "/:id",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn(
        `Validation failed in GET /api/books/${req.params.id}:`,
        errors.array()
      );
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("✅ Fetching book details for ID:", req.params.id);
    getBookById(req, res);
  }
);

export default router;
