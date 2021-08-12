import winston from "winston";

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  ),
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      handleExceptions: true,
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "errors.log",
      level: "error",
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      ),
      handleExceptions: true,
      maxsize: 52428800,
      maxFiles: 3,
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      ),
      handleExceptions: true,
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],
  exitOnError: false,
});

export default logger;
