
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

// signup controller
exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create new user
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true },
    });

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// LOGIN Controller

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // 3. Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
