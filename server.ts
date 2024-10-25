import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import corsConfig from "./config/cors.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandling.js";

// Import routes

import productRoutes from "./routes/productRoutes.js";
import userRoleRoutes from "./routes/userRoleRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

app.use(cors(corsConfig));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Auth routes
// app.use("/login", rateLimiter(3, 10), require("./routes/auth/login"));
// app.use("/login", require("./routes/auth/login"));
// app.use("/logout", require("./routes/auth/logout"));
// app.use("/refresh", require("./routes/auth/refresh"));
// app.use("/reset", require("./routes/auth/reset"));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/userRoles", userRoleRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
