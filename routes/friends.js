import express from "express";
import friendsCol from "../db/friends.js";
import expensesCol from "../db/expenses.js";

const router = express.Router();

// GET all friends
router.get("/", async (req, res) => {
  try {
    const friends = await friendsCol.getAllFriends();
    res.json(friends);
  } catch (err) {
    console.error("Error in GET /friends:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET a specific friend
router.get("/:id", async (req, res) => {
  try {
    const friend = await friendsCol.getFriendById(req.params.id);

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    res.json(friend);
  } catch (err) {
    console.error(`Error in GET /friends/${req.params.id}:`, err);
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new friend
router.post("/", async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || req.body.name.trim() === "") {
      return res.status(400).json({ message: "Friend name is required" });
    }

    const newFriend = await friendsCol.createFriend(req.body);
    res.status(201).json(newFriend);
  } catch (err) {
    console.error("Error in POST /friends:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a friend
router.put("/:id", async (req, res) => {
  try {
    const updatedFriend = await friendsCol.updateFriend(
      req.params.id,
      req.body
    );

    if (!updatedFriend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    res.json(updatedFriend);
  } catch (err) {
    console.error(`Error in PUT /friends/${req.params.id}:`, err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a friend
router.delete("/:id", async (req, res) => {
  try {
    // Check for unsettled expenses
    const hasUnsettled = await expensesCol.hasUnsettledExpenses(req.params.id);

    if (hasUnsettled) {
      return res.status(400).json({
        message:
          "Cannot delete friend with unsettled expenses. Please settle all expenses first.",
      });
    }

    const deleted = await friendsCol.deleteFriend(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Delete related expenses
    await expensesCol.deleteExpensesByFriend(req.params.id);

    res.json({ message: "Friend deleted successfully" });
  } catch (err) {
    console.error(`Error in DELETE /friends/${req.params.id}:`, err);
    res.status(500).json({ message: err.message });
  }
});

// SETTLE all expenses with a friend
router.post("/:id/settle", async (req, res) => {
  try {
    // Check if friend exists first
    const friend = await friendsCol.getFriendById(req.params.id);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Mark expenses as settled
    const settledCount = await expensesCol.settleExpenses(req.params.id);

    // Get the updated friend
    const updatedFriend = await friendsCol.getFriendById(req.params.id);

    res.json({
      message: `Balance settled successfully. ${settledCount} expenses updated.`,
      friend: updatedFriend,
    });
  } catch (err) {
    console.error(`Error in POST /friends/${req.params.id}/settle:`, err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
