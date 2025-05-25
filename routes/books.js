const express = require("express");
const {
  createBook,
  getBooks,
  getBookById,
} = require("../controllers/bookController");
const authenticate = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

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
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
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
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
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
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of books
 */
router.get("/", getBooks);

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
 *         description: Page for review pagination
 *     responses:
 *       200:
 *         description: Book details with reviews
 *       404:
 *         description: Book not found
 */
router.get("/:id", getBookById);

module.exports = router;

// ✅ Summary:
// - POST /books: Authenticated book creation
// - GET /books: Filter by author/genre, paginate
// - GET /books/:id: Include average rating + reviews
// - Validation via express-validator
// - Prisma handles DB querying and joins
// - Swagger docs for all routes
// - JWT Middleware enforced on book creation
