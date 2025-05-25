# 📚 Bookwise API

**Bookwise API** is a secure and modular RESTful backend built with **Node.js**, **Express**, and **Prisma ORM** for managing users, books, and reviews. It supports authentication, role-based access, rate limiting, and real-time Redis caching.

---

// ----------------------------
// 2. ER Diagram (Textual View)
// ----------------------------

// User (1) ────< (M) Review (M) >──── (1) Book

// Entities:
// User: id, email, password, createdAt
// Book: id, title, author, genre, createdAt
// Review: id, rating, comment, userId, bookId, createdAt

// Relationships:
// - User ↔ Review: One-to-Many (1 user can write many reviews)
// - Book ↔ Review: One-to-Many (1 book can have many reviews)
// - userId and bookId in Review are foreign keys

## 🚀 Features

- 🛡️ JWT Authentication (Login, Signup)
- 👤 Role-Based Access Control (Admin, User, Free)
- 📚 Book CRUD operations
- ✍️ Review system with average rating calculation
- 📦 Caching with Redis
- 🧱 PostgreSQL + Prisma ORM
- 📊 API documentation via Swagger
- 🧪 Request validation and rate limiting
- 📂 Scalable folder structure

---

## 🔧 Technologies Used

- **Node.js** + **Express**
- **Prisma ORM** + **PostgreSQL**
- **JWT + bcryptjs** for secure auth
- **Redis** via ioredis
- **Swagger** for API docs
- **Nodemon**, **Winston**, **express-rate-limit**, and more

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bookwise-api.git
cd bookwise-api
