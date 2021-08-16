import winston, { Logform } from "winston";

const format: Logform.Format = winston.format.combine(
  winston.format.json(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
);
const logger = winston.createLogger({
  format: format,
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
      format: format,
      handleExceptions: true,
      maxsize: 52428800,
      maxFiles: 3,
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      format: format,
      handleExceptions: true,
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],
  exitOnError: false,
});

export default logger;
