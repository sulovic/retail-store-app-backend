import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) : void => {
  // Implement Error Logger
  console.error("Error:", err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({ message: "Duplicate entry detected." });
      return;
    }
    if (err.code === "P2003") {
      res.status(400).json({ message: "Invalid foreign key reference." });
      return;
    }
    if (err.code === "P2009") {
      res.status(400).json({ message: "Data validation error. Please check your input data." });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ message: "Record not found." });
      return;
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      res.status(503).json({ message: "Database is unavailable. Please check your database connection." });
      return;
    }
    if (err.errorCode === "P1001") {
      res.status(503).json({ message: "Database connection timed out. Please try again later." });
      return;
    }
    if (err.errorCode === "P1002") {
      res.status(503).json({ message: "Database connection was forcibly closed. Please check your server setup." });
      return;
    }
    res.status(500).json({ message: "Prisma Client Initialization Error." });
    return;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    res.status(400).json({ message: "Invalid request." });
    return;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ message: "Data validation error. Please check your input data." });
    return;
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    res.status(500).json({ message: "Prisma Client Rust Panic." });
    return;
  }
  //Handle other specific errors
      // errorLogger(err, req);
    // if (err.name === "InvalidGoogleToken") {
    //   return res.status(401).json({ error: "Unauthorized - Invalid Google Token" });
    // } else {
    //   res.status(500).json({ error: "Internal Server Error" });
    // }

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
