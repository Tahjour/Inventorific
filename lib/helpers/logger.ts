// lib\helpers\logger.ts
import { createLogger, format, transports } from "winston";
import "winston-mongodb";
const { timestamp, errors, combine, prettyPrint } = format;

export const logger = createLogger({
  level: "info",
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint()
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    // new transports.File({ filename: "error.log", level: "error" }),
    // new transports.File({ filename: "combined.log" }),
    // new transports.MongoDB({
    //   db: process.env.MONGODB_URI!,
    //   collection: "logs",
    //   options: {
    //     useUnifiedTopology: true,
    //   },
    // }),
    new transports.Console(),
  ],
});
