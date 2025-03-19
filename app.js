import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import debugPckg from "debug";

import friendsRouter from "./routes/friends.js";
import expensesRouter from "./routes/expenses.js";

const debug = debugPckg("express-mongodb-friends-expenses:backend");
const PORT = process.env.PORT || 3000;

// Safe __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Basic middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API routes
app.use("/api/friends", friendsRouter);
app.use("/api/expenses", expensesRouter);

// For Vercel - static files
try {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  // Serve index.html for all non-API routes (SPA support)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    try {
      res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
    } catch (err) {
      console.error("Error serving index.html:", err);
      res.status(500).send("Error serving frontend application");
    }
  });
} catch (err) {
  console.error("Error setting up static files:", err);
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    dirname: __dirname,
    cwd: process.cwd(),
  });
});

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    debug(`Backend is running on port ${PORT}`);
  });
}

export default app;
