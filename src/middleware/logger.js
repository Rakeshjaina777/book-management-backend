const morgan = require("morgan");
const winston = require("winston");

const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: "logs/api.log" })],
});

const logMiddleware = morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

module.exports = logMiddleware;
