const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    // new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: "logs/server.log" }),
  ],
});

// Logger middleware using Winston
const loggerMiddleware = (req, res, next) => {
  const currentDate = new Date();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;

  logger.info(
    `[${currentDate.toISOString()}] ${method} request to ${url} from ${ip}`
  );
  next();
};

module.exports = loggerMiddleware;
