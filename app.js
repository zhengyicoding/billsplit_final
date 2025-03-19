import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";

import friendsRouter from "./routes/friends.js";
import expensesRouter from "./routes/expenses.js";

// Safe __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Basic middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Health check endpoint - keep this simple to test the API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/friends", friendsRouter);
app.use("/api/expenses", expensesRouter);

// Simple handling for other routes (no static file serving yet)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return;
  }
  res
    .status(200)
    .send(
      "Backend is running. Frontend will be integrated once API is stable."
    );
});

export default app;
