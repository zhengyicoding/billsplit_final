import { ObjectId } from "mongodb";
import { withCollection, createIndexes } from "./db.js";
import friendsCol from "./friends.js";

function ExpensesCol() {
  const COL_NAME = "expenses";
  const self = {};

  // Define indexes
  const indexes = [
    {
      key: { friendId: 1 },
      options: {},
    },
    {
      key: { date: -1 },
      options: {},
    },
    {
      key: { settled: 1 },
      options: {},
    },
    {
      key: { createdAt: -1 },
      options: {},
    },
  ];

  // Create indexes
  createIndexes(COL_NAME, indexes)
    .then(() => console.log(`Indexes created for ${COL_NAME} collection`))
    .catch((err) =>
      console.error(`Error creating indexes for ${COL_NAME}:`, err)
    );

  // Get all expenses, sorted by date (newest first)
  self.getAllExpenses = async () => {
    return withCollection(COL_NAME, async (collection) => {
      return collection.find().sort({ date: -1, createdAt: -1 }).toArray();
    });
  };

  // Get expenses for a specific friend
  self.getExpensesByFriend = async (friendId) => {
    return withCollection(COL_NAME, async (collection) => {
      return collection
        .find({ friendId: friendId })
        .sort({ date: -1, createdAt: -1 })
        .toArray();
    });
  };

  // Get a specific expense by ID
  self.getExpenseById = async (id) => {
    return withCollection(COL_NAME, async (collection) => {
      return collection.findOne({ _id: new ObjectId(id) });
    });
  };

  // Check if a friend has any unsettled expenses
  self.hasUnsettledExpenses = async (friendId) => {
    return withCollection(COL_NAME, async (collection) => {
      const count = await collection.countDocuments({
        friendId: friendId,
        settled: false,
      });
      return count > 0;
    });
  };

  // Calculate the balance adjustment based on payment details
  const calculateBalanceAdjustment = (totalAmount, userAmount, paidBy) => {
    // Make sure values are numbers
    totalAmount = parseFloat(totalAmount);
    userAmount = parseFloat(userAmount);

    // Calculate friend's amount (total minus user's portion)
    const friendAmount = totalAmount - userAmount;

    // Calculate balance adjustment based on who paid
    if (paidBy === "you") {
      // You paid the entire bill but are only responsible for userAmount
      // So friend owes you their portion (friendAmount)
      return friendAmount;
    } else {
      // Friend paid the entire bill but is only responsible for friendAmount
      // So you owe friend your portion (userAmount)
      return -userAmount;
    }
  };

  // Create a new expense
  self.createExpense = async (expenseData) => {
    return withCollection(COL_NAME, async (collection) => {
      // Get the friend to update their balance and get their name
      const friend = await friendsCol.getFriendById(expenseData.friendId);
      if (!friend) {
        throw new Error("Friend not found");
      }

      // Parse numeric values
      const totalAmount = parseFloat(expenseData.amount);

      // How much the user is responsible for paying
      let userAmount;
      let friendAmount;

      if (expenseData.splitMethod === "custom") {
        // For custom split, use the user-provided value
        userAmount = parseFloat(expenseData.userAmount);

        // Validate userAmount is a number and not greater than the total
        if (isNaN(userAmount)) {
          throw new Error("User amount must be a number");
        }

        if (userAmount > totalAmount) {
          throw new Error(
            "User amount cannot be greater than the total amount"
          );
        }

        // Calculate friend's portion
        friendAmount = totalAmount - userAmount;
      } else {
        // For equally split expenses
        userAmount = totalAmount / 2;
        friendAmount = totalAmount / 2;
      }

      const expense = {
        description: expenseData.description,
        amount: totalAmount,
        date: new Date(expenseData.date) || new Date(),
        friendId: expenseData.friendId,
        friendName: friend.name,
        splitMethod: expenseData.splitMethod || "equally",
        userAmount: userAmount,
        friendAmount: friendAmount,
        paidBy: expenseData.paidBy || "you",
        settled: false,
        createdAt: new Date(),
      };

      // Calculate balance adjustment
      const balanceAdjustment = calculateBalanceAdjustment(
        totalAmount,
        userAmount,
        expense.paidBy
      );

      // Update balance
      const newBalance = friend.balance + balanceAdjustment;

      // Save the expense
      const result = await collection.insertOne(expense);

      // Update friend's balance
      await friendsCol.updateBalance(expenseData.friendId, newBalance);

      return { ...expense, _id: result.insertedId };
    });
  };

  // Update an expense
  self.updateExpense = async (id, updateData) => {
    return withCollection(COL_NAME, async (collection) => {
      // Get original expense to calculate balance changes
      const originalExpense = await self.getExpenseById(id);
      if (!originalExpense) {
        throw new Error("Expense not found");
      }

      if (originalExpense.settled) {
        throw new Error("Cannot edit a settled expense");
      }

      // Get the original friend
      const originalFriend = await friendsCol.getFriendById(
        originalExpense.friendId
      );
      if (!originalFriend) {
        throw new Error("Original friend not found");
      }

      // Revert original balance adjustment
      const originalBalanceAdjustment = calculateBalanceAdjustment(
        originalExpense.amount,
        originalExpense.userAmount,
        originalExpense.paidBy
      );

      let originalFriendBalance =
        originalFriend.balance - originalBalanceAdjustment;

      // Create updated expense object with new values where provided
      const updatedExpense = {
        ...originalExpense,
        description: updateData.description || originalExpense.description,
        amount:
          updateData.amount !== undefined
            ? parseFloat(updateData.amount)
            : originalExpense.amount,
        date: updateData.date
          ? new Date(updateData.date)
          : originalExpense.date,
        splitMethod: updateData.splitMethod || originalExpense.splitMethod,
        paidBy: updateData.paidBy || originalExpense.paidBy,
      };

      // Calculate updated userAmount and friendAmount
      if (
        updateData.splitMethod === "custom" &&
        updateData.userAmount !== undefined
      ) {
        updatedExpense.userAmount = parseFloat(updateData.userAmount);

        // Validate userAmount is not greater than the total
        if (updatedExpense.userAmount > updatedExpense.amount) {
          throw new Error(
            "User amount cannot be greater than the total amount"
          );
        }

        updatedExpense.friendAmount =
          updatedExpense.amount - updatedExpense.userAmount;
      } else if (
        updateData.splitMethod === "equally" ||
        (updateData.amount !== undefined &&
          updatedExpense.splitMethod === "equally")
      ) {
        // Recalculate equal split
        updatedExpense.userAmount = updatedExpense.amount / 2;
        updatedExpense.friendAmount = updatedExpense.amount / 2;
      }

      // Check if friend has changed
      const friendChanged =
        updateData.friendId && updateData.friendId !== originalExpense.friendId;

      if (friendChanged) {
        // Handle friend change - get new friend
        const newFriend = await friendsCol.getFriendById(updateData.friendId);
        if (!newFriend) {
          throw new Error("New friend not found");
        }

        // Update expense with new friend info
        updatedExpense.friendId = updateData.friendId;
        updatedExpense.friendName = newFriend.name;

        // Calculate and apply new balance for original friend
        await friendsCol.updateBalance(
          originalExpense.friendId,
          originalFriendBalance
        );

        // Calculate new balance for new friend
        const newBalanceAdjustment = calculateBalanceAdjustment(
          updatedExpense.amount,
          updatedExpense.userAmount,
          updatedExpense.paidBy
        );

        let newFriendBalance = newFriend.balance + newBalanceAdjustment;

        // Update new friend's balance
        await friendsCol.updateBalance(updateData.friendId, newFriendBalance);
      } else {
        // Same friend, just update balance
        // Calculate new balance adjustment
        const newBalanceAdjustment = calculateBalanceAdjustment(
          updatedExpense.amount,
          updatedExpense.userAmount,
          updatedExpense.paidBy
        );

        originalFriendBalance += newBalanceAdjustment;

        // Update original friend's balance
        await friendsCol.updateBalance(
          originalExpense.friendId,
          originalFriendBalance
        );
      }

      // Save the updated expense
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedExpense },
        { returnDocument: "after" }
      );

      return result.value;
    });
  };

  // Delete an expense
  self.deleteExpense = async (id) => {
    return withCollection(COL_NAME, async (collection) => {
      // Get the expense to revert balance changes
      const expense = await self.getExpenseById(id);
      if (!expense) {
        throw new Error("Expense not found");
      }

      if (expense.settled) {
        throw new Error("Cannot delete a settled expense");
      }

      // Get the friend to update their balance
      const friend = await friendsCol.getFriendById(expense.friendId);
      if (friend) {
        // Calculate the original balance adjustment
        const balanceAdjustment = calculateBalanceAdjustment(
          expense.amount,
          expense.userPaid,
          expense.splitMethod
        );

        // Remove this adjustment from the friend's balance
        const newBalance = friend.balance - balanceAdjustment;

        // Update friend's balance
        await friendsCol.updateBalance(expense.friendId, newBalance);
      }

      // Delete the expense
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    });
  };

  // Delete all expenses for a friend
  self.deleteExpensesByFriend = async (friendId) => {
    return withCollection(COL_NAME, async (collection) => {
      const result = await collection.deleteMany({ friendId: friendId });
      return result.deletedCount;
    });
  };

  // Mark all expenses for a friend as settled
  self.settleExpenses = async (friendId) => {
    return withCollection(COL_NAME, async (collection) => {
      const result = await collection.updateMany(
        { friendId: friendId, settled: false },
        { $set: { settled: true, settledAt: new Date() } }
      );

      // Reset friend's balance to zero
      await friendsCol.resetBalance(friendId);

      return result.modifiedCount;
    });
  };

  return self;
}

const expensesCol = ExpensesCol();
export default expensesCol;
