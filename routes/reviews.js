// 📂 File: src/routes/reviews.js (ESM + Swagger + Validation)

import express from "express";
import {
  addReview,
  updateReview,
  deleteReview,
} from "../src/controllers/reviewController.js";
import authenticate from "../src/middleware/auth.js";
import { check, validationResult } from "express-validator";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Endpoints to manage book reviews
 */

/**
 * @swagger
 * /api/reviews/books/{id}:
 *   post:
 *     summary: Submit a review for a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to review
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Amazing storytelling and characters."
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: User has already reviewed or validation error
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.post(
  "/books/:id",
  authenticate,
  [
    check("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
    check("comment").notEmpty().withMessage("Comment required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    addReview(req, res);
  }
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update your own review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Updated comment for the book."
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       403:
 *         description: Forbidden — Not your review
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authenticate, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete your own review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Forbidden — Not your review
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authenticate, deleteReview);

export default router;
