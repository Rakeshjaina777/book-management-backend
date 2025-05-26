import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



export const addReview = async (req, res)=>{
  const { id: bookId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id; // ✅ correct
    if (!bookId || !rating || !comment) {
        return res.status(400).json({ error: "All fields are required" });
    }
  try {
    const existing = await prisma.review.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (existing)
      return res
        .status(400)
        .json({ error: "You have already reviewed this book." });

    const review = await prisma.review.create({
      data: { rating, comment, bookId, userId },
    });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
    
export const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
  
    try {
      const review = await prisma.review.findUnique({ where: { id } });
  
      if (!review || review.userId !== userId)
        return res.status(403).json({ error: 'Not allowed to edit this review.' });
  
      const updated = await prisma.review.update({
        where: { id },
        data: { rating, comment },
      });
  
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  };
  
  // -----------------------------
  // Delete Review (DELETE /reviews/:id)
  // -----------------------------
  export const deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    try {
      const review = await prisma.review.findUnique({ where: { id } });
      if (!review || review.userId !== userId)
        return res.status(403).json({ error: 'Not allowed to delete this review.' });
  
      await prisma.review.delete({ where: { id } });
      res.json({ message: 'Review deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  };
  