const swaggerJSDoc = require("swagger-jsdoc"); // generates the OpenAPI spec
const swaggerUi = require("swagger-ui-express"); // serves Swagger UI

const options = {
  definition: {
    openapi: "3.0.0", // use OpenAPI 3.0 spec
    info: {
      title: "Book Review API", // title of the API
      version: "1.0.0", // API version
      description: "Express + Prisma API", // description
    },
    servers: [
      {
        url: "http://localhost:5000/api", // base URL for API
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // source of annotations
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
