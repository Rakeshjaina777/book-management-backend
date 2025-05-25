// src/middleware/logger.js

import morgan from "morgan";
import winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: "logs/api.log" })],
});

const logMiddleware = morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

export default logMiddleware;
