import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import "dotenv/config";

import friendsRouter from "./routes/friends.js";
import expensesRouter from "./routes/expenses.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.use("/api/friends", friendsRouter);
app.use("/api/expenses", expensesRouter);

// Replace the current catch-all route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

// Add a more specific non-API route handler
app.get(/^(?!\/api\/).+$/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

export default app;
