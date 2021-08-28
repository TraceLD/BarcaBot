import winston from "winston";

const defaultFormat = winston.format.combine(
  winston.format.json(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
);
const logger = winston.createLogger({
  format: defaultFormat,
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "DEVELOPMENT" ? "debug" : "info",
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      handleExceptions: true,
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "errors.log",
      level: "error",
      format: defaultFormat,
      handleExceptions: true,
      maxsize: 52428800,
      maxFiles: 3,
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      format: defaultFormat,
      handleExceptions: true,
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],
  exitOnError: false,
});

export default logger;
