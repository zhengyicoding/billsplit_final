import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import "dotenv/config";

import friendsRouter from "../routes/friends.js";
import expensesRouter from "../routes/expenses.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create the Express app
const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API routes
app.use("/api/friends", friendsRouter);
app.use("/api/expenses", expensesRouter);

// Serve static assets from the frontend/dist directory
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// Serve SPA for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

export default app;
