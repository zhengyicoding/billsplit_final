import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import debugPckg from "debug";
import fs from "fs";

import friendsRouter from "./routes/friends.js";
import expensesRouter from "./routes/expenses.js";

const debug = debugPckg("express-mongodb-friends-expenses:backend");

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Debug middleware to log request information
app.use((req, res, next) => {
  console.log(`[DEBUG] Request path: ${req.path}`);
  console.log(`[DEBUG] Current directory: ${__dirname}`);
  next();
});

// API routes
app.use("/api/friends", friendsRouter);
app.use("/api/expenses", expensesRouter);

// Check for various possible paths to the frontend build
const possiblePaths = [
  path.join(__dirname, "frontend/dist"),
  path.join(__dirname, "../frontend/dist"),
  path.join(process.cwd(), "frontend/dist"),
  path.join(process.cwd(), "dist"),
  "./frontend/dist",
];

// Log all path attempts
console.log("Checking possible frontend paths:");
possiblePaths.forEach((p) => {
  console.log(`- ${p} exists: ${fs.existsSync(p)}`);
});

// Find the first valid path
let staticPath = possiblePaths.find((p) => fs.existsSync(p));

// If no valid path was found, default to the first option
if (!staticPath) {
  console.log("No valid frontend path found, using default");
  staticPath = possiblePaths[0];
}

console.log(`Using static path: ${staticPath}`);
app.use(express.static(staticPath));

// Handle all other routes by serving index.html for client-side routing
app.get("*", (req, res) => {
  // Skip for API routes
  if (req.path.startsWith("/api/")) return next();

  const indexPath = path.join(staticPath, "index.html");
  console.log(`Serving index.html from: ${indexPath}`);

  // Check if index.html exists
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.log(`Index.html not found at: ${indexPath}`);
    res.status(404).send(`
      <h1>Frontend Not Found</h1>
      <p>Could not locate index.html at ${indexPath}</p>
      <p>Current directory: ${__dirname}</p>
      <p>Working directory: ${process.cwd()}</p>
    `);
  }
});

app.listen(PORT, () => {
  debug(`Backend is running on port ${PORT}`);
});

export default app;
