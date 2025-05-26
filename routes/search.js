import express from "express";
import { searchBooks } from "../src/controllers/searchController.js";

const router = express.Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search books by title or author
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Partial string to search by title or author
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of books matching the search
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   genre:
 *                     type: string
 *       400:
 *         description: Invalid or missing search query
 */
router.get("/", searchBooks);

export default router;
