

## 📌 Overview
A secure and modular backend API for managing books and reviews.

Built using:
- ✅ Node.js + Express (ESM)
- ✅ PostgreSQL + Prisma ORM
- ✅ Swagger (OpenAPI 3.0)
- ✅ JWT authentication
- ✅ Redis, Logging, Validation, Rate Limiting

---

## 🧩 ER Diagram & Schema Design

### 📊 Entity Relationship (Text View)
```
User (1) ────< Review >──── (1) Book
```
- A user can submit multiple reviews
- A book can have multiple reviews
- Each review belongs to **one user and one book**
- Each user can only submit **one review per book**

### 🔢 Prisma Schema (Excerpt)
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  reviews   Review[]
  createdAt DateTime @default(now())
}

model Book {
  id        String   @id @default(uuid())
  title     String
  author    String
  genre     String
  reviews   Review[]
  createdAt DateTime @default(now())

  @@index([author])
  @@index([genre])
}

model Review {
  id        String   @id @default(uuid())
  rating    Int
  comment   String
  book      Book     @relation(fields: [bookId], references: [id])
  bookId    String
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())

  @@unique([userId, bookId])
}
```

---

## 🚀 Getting Started — Full Setup

### 1. Clone the Repository
```bash
git clone <your_repo_url>
cd book-review-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup PostgreSQL & Prisma
- Ensure PostgreSQL is running locally or use a cloud provider
- Create database `book_review_db`

### 4. Configure Environment Variables
Create a `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/book_review_db
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 5. Initialize Prisma + DB Schema
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Start Redis Server (optional but recommended)
```bash
redis-server
```

### 7. Start the API Server
```bash
npm run dev
```

### 8. Access Swagger API Docs
```
http://localhost:5000/api-docs
```

---

## 📚 API Documentation

### 🔗 Swagger UI
Visit: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
![image](https://github.com/user-attachments/assets/331d540d-2351-4542-b4fd-481e9eafaef1)


Contains detailed docs for:
- `/auth/signup`, `/auth/login`
- `/books`, `/books/:id`, `/books/:id/reviews`
- `/reviews/:id`
- `/search?query=`

---

## 📦 API Features

### 🔐 Auth
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Login & get token |

### 📘 Books
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/books` | POST | Add book (auth only) |
| `/api/books` | GET | List books with filter/pagination |
| `/api/books/:id` | GET | Get book + reviews + avg rating |

### ✍️ Reviews
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/books/:id/reviews` | POST | Add review (1 per user/book) |
| `/api/reviews/:id` | PUT | Update own review |
| `/api/reviews/:id` | DELETE | Delete own review |

### 🔍 Search
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search?query=...` | GET | Search by title/author |

---

## 🧪 Sample CURL Requests

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"email": "user@example.com", "password": "securepass"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "user@example.com", "password": "securepass"}'
```

### Add Book (Authenticated)
```bash
curl -X POST http://localhost:5000/api/books \
  -H 'Authorization: Bearer <your_token>' \
  -H 'Content-Type: application/json' \
  -d '{"title": "Book Title", "author": "Author Name", "genre": "FICTION"}'
```

### Submit Review
```bash
curl -X POST http://localhost:5000/api/books/<bookId>/reviews \
  -H 'Authorization: Bearer <your_token>' \
  -H 'Content-Type: application/json' \
  -d '{"rating": 4, "comment": "Great read!"}'
```

---

## ✅ Deployment Checklist

- [ ] Add `Dockerfile`, `docker-compose.yml`
- [ ] Set up Redis in production
- [ ] Enable Prisma connection pooling
- [ ] Use HTTPS and CORS configuration
- [ ] Use environment variables securely

---

## 🧠 Design Decisions
- Used UUIDs for all primary keys
- Enforced 1 review per user per book via unique constraint
- Swagger enables live API testing + developer handoff
- Prisma `select` and `include` optimize DB queries
- Validation handled by `express-validator`

---

## 📂 Folder Structure (Summary)
```
book-review-api/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── graphql/ (optional)
├── prisma/
│   └── schema.prisma
├── docs/
├── logs/
├── .env
├── server.js
├── README.md
```

---

## ❤️ Contribute / Extend
- Add user profile model
- Enable likes on reviews
- Add GraphQL endpoint (already scaffolded)
- Add Redis-based caching on book detail
