import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create a new book
 */
export const createBook = async (req, res) => {
  const { title, author, genre } = req.body; // ✅ Fix this

  try {
    if (!title || !author || !genre) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newBook = await prisma.book.create({
      data: { title, author, genre }, // ✅ Fix here too
      select: { id: true, title: true, author: true, genre: true },
    });

    return res.status(201).json({
      message: "Book created",
      book: newBook,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get all books with optional filters and pagination
 */
export const getBooks = async (req, res) => {
  const { author, genre, page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const filters = {
    ...(author && { author: { contains: author, mode: "insensitive" } }),
    ...(genre && { genre: { contains: genre, mode: "insensitive" } }),
  };

  try {
    const books = await prisma.book.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const totalBooks = await prisma.book.count({ where: filters });

    return res.status(200).json({
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: +page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get a single book by ID, including paginated reviews and average rating
 */
export const getBookById = async (req, res) => {
  const { id } = req.params;
  const { page = 1 } = req.query;
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        reviews: {
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const totalReviews = await prisma.review.count({
      where: { bookId: id },
    });

    const averageRating = await prisma.review.aggregate({
      _avg: { rating: true },
      where: { bookId: id },
    });

    return res.status(200).json({
      book: {
        ...book,
        averageRating: averageRating._avg.rating || 0,
        totalReviews,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
