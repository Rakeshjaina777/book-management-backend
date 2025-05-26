import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const searchBooks = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Search query must be at least 2 characters." });
  }

  try {
    const books = await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { author: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        author: true,
        genre: true,
      },
      orderBy: { title: "asc" },
      take: 20, // limit to top 20 results
    });

    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while searching" });
  }
};
