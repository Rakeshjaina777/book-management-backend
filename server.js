const express = require("express"); // import express framework
const app = express(); // create express app instance
 

const rateLimiter = require("./src/middleware/rateLimiter");
require("dotenv").config(); // load environment variables from .env file

app.use(express.json());

// middleware to parse JSON request bodies
app.get("/", (req, res) => {
    console.log("Received a request to the root endpoint");

  res.send("Welcome to Book Review API!");
});
 
app.use(rateLimiter);

app.get("/health", (req, res) => {
  res.json({ status: "OK", port: PORT });
});
  

// Swagger UI for OpenAPI documentation
require("./src/docs/swagger")(app);

// Mount your main routes
// app.use("/api/auth", require("./src/routes/auth")); // Auth endpoints
// app.use("/api/books", require("./src/routes/books")); // Book endpoints
// app.use("/api/reviews", require("./src/routes/reviews")); // Review endpoints

// Start the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
