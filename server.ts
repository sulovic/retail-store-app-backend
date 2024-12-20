import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import corsConfig from "./config/cors.js";
import errorHandler from "./middleware/errorHandling.js";
import verifyAccessToken from "./middleware/verifyAccessToken.js";

// Import auth routes

import loginRoute from "./routes/auth/loginRoute.js";
import logoutRoute from "./routes/auth/logoutRoute.js";
import refreshRoute from "./routes/auth/refreshRoute.js";

// Import data routes

import productRoutes from "./routes/productRoutes.js";
import userRoleRoutes from "./routes/userRoleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import inventoryProductsRoutes from "./routes/InventoryProductsRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import procurementRoutes from "./routes/procurementRoutes.js";

// Initialize app and constants

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

// Middleware setup

app.use(cors(corsConfig));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Auth routes
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/refresh", refreshRoute);

// Data Routes
app.use("/api/products", verifyAccessToken("products"), productRoutes);
app.use("/api/inventories", verifyAccessToken("inventories"), inventoryRoutes);
app.use("/api/inventory-products", verifyAccessToken("inventoryProducts"), inventoryProductsRoutes);
app.use("/api/user-roles", verifyAccessToken("userRoles"), userRoleRoutes);
app.use("/api/users", verifyAccessToken("users"), userRoutes);
app.use("/api/stores", verifyAccessToken("stores"), storeRoutes);
app.use("/api/procurements", verifyAccessToken("procurements"), procurementRoutes);

// Error handling middleware

app.use(errorHandler);

// Start server

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

//HTTPS Server for testing

// import https from "https";
// import fs from "fs";
// const options = {
//   key: fs.readFileSync(`./key.pem`),
//   cert: fs.readFileSync("./cert.pem"),
// };

// const server = https.createServer(options, app);

// server.listen(PORT, () => {
//   console.log(`HTTPS Server running at port ${PORT}`);
// });
//END HTTPS Server for testing
