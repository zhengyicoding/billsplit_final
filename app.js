import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import debugPckg from "debug";

import friendsRouter from "./routes/friends.js";
import expensesRouter from "./routes/expenses.js";

const debug = debugPckg("express-mongodb-friends-expenses:backend");
const PORT = process.env.PORT || 3000;

// Safe __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    dirname: __dirname,
    cwd: process.cwd(),
  });
});

// Basic middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API routes
app.use("/api/friends", friendsRouter);
app.use("/api/expenses", expensesRouter);

// Find the frontend dist directory
const findFrontendDistDir = () => {
  const possiblePaths = [
    path.join(__dirname, "frontend/dist"),
    path.join(process.cwd(), "frontend/dist"),
    "/var/task/frontend/dist", // Vercel serverless path
    path.join(__dirname, "../frontend/dist"),
  ];

  for (const distPath of possiblePaths) {
    try {
      if (fs.existsSync(distPath)) {
        console.log(`Found frontend dist at: ${distPath}`);
        return distPath;
      }
    } catch (err) {
      console.error(`Error checking path ${distPath}:`, err);
    }
  }

  console.error("Could not find frontend dist directory");
  return null;
};

// Get the frontend directory
const frontendDistDir = findFrontendDistDir();

// Serve static files if frontend dist was found
if (frontendDistDir) {
  console.log(`Serving static files from: ${frontendDistDir}`);
  app.use(express.static(frontendDistDir));

  // Serve index.html for all non-API routes (SPA support)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    const indexPath = path.join(frontendDistDir, "index.html");

    try {
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      } else {
        console.error(`Index file not found at: ${indexPath}`);
        return res.status(404).send(`
          <h1>Frontend Not Found</h1>
          <p>Could not find index.html at ${indexPath}</p>
        `);
      }
    } catch (err) {
      console.error("Error serving index.html:", err);
      return res.status(500).send("Error serving frontend application");
    }
  });
} else {
  // Handle the case where frontend dist was not found
  app.get("/", (req, res) => {
    res.status(200).send(`
      <h1>Backend is running</h1>
      <p>Frontend files were not found. Please check your build configuration.</p>
    `);
  });
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

// Only start server if not in serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    debug(`Backend is running on port ${PORT}`);
  });
}

export default app;
