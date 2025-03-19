import express from "express";
import expensesCol from "../db/expenses.js";

const router = express.Router();

// GET all expenses
router.get("/", async (req, res) => {
  try {
    // Extract query parameters
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sortBy: req.query.sortBy || "date",
      sortDirection: req.query.sortDirection || "desc",
      search: req.query.search || "",
      friendId: req.query.friendId || null,
      settled: req.query.settled !== undefined ? req.query.settled : null,
      dateFrom: req.query.dateFrom || null,
      dateTo: req.query.dateTo || null,
    };

    console.log("API Query params:", options);

    const result = await expensesCol.getAllExpenses(options);

    res.json(result);
  } catch (err) {
    console.error("Error in GET /expenses:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ message: err.message });
  }
});
// GET expenses by friend
router.get("/friend/:friendId", async (req, res) => {
  try {
    const expenses = await expensesCol.getExpensesByFriend(req.params.friendId);
    res.json(expenses);
  } catch (err) {
    console.error(`Error in GET /expenses/friend/${req.params.friendId}:`, err);
    res.status(500).json({ message: err.message });
  }
});

// GET a specific expense
router.get("/:id", async (req, res) => {
  try {
    const expense = await expensesCol.getExpenseById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    console.error(`Error in GET /expenses/${req.params.id}:`, err);
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new expense
router.post("/", async (req, res) => {
  try {
    const newExpense = await expensesCol.createExpense(req.body);
    res.status(201).json(newExpense);
  } catch (err) {
    console.error("Error in POST /expenses:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE an expense
router.put("/:id", async (req, res) => {
  try {
    const updatedExpense = await expensesCol.updateExpense(
      req.params.id,
      req.body
    );
    res.json(updatedExpense);
  } catch (err) {
    // Handle specific error cases
    if (err.message === "Expense not found") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message === "Cannot edit a settled expense") {
      return res.status(400).json({ message: err.message });
    }

    console.error(`Error in PUT /expenses/${req.params.id}:`, err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE an expense
router.delete("/:id", async (req, res) => {
  try {
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    // Handle specific error cases
    if (err.message === "Expense not found") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message === "Cannot delete a settled expense") {
      return res.status(400).json({ message: err.message });
    }

    console.error(`Error in DELETE /expenses/${req.params.id}:`, err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
