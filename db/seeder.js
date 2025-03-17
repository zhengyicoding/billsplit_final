import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection URI
const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

/**
 * Calculate the proper balance based on expenses
 */
function calculateBalance(expenses) {
  let balance = 0;
  for (const expense of expenses) {
    if (expense.settled) continue;

    const totalAmount = expense.amount;

    if (expense.splitMethod === "custom") {
      // For custom split, user is responsible for userAmount
      if (expense.paidBy === "you") {
        // You paid full amount but are only responsible for userAmount
        // Friend owes you their portion (friendAmount)
        balance += expense.friendAmount;
      } else {
        // Friend paid full amount but is only responsible for friendAmount
        // You owe friend your portion (userAmount)
        balance -= expense.userAmount;
      }
    } else {
      // For equally split expenses, both pay half
      const halfAmount = totalAmount / 2;
      if (expense.paidBy === "you") {
        balance += halfAmount; // Friend owes you half
      } else {
        balance -= halfAmount; // You owe friend half
      }
    }
  }
  return balance;
}

/**
 * Seed the database with initial data
 */
async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);

    // Clear existing collections
    await db.collection("friends").deleteMany({});
    await db.collection("expenses").deleteMany({});

    console.log("Existing collections cleared");

    // Load expense data from JSON file
    const expensesPath = path.join(__dirname, "expense-data.json");
    const expensesData = JSON.parse(await readFile(expensesPath, "utf8"));

    // Convert any existing data to new format if needed
    const normalizedExpenses = expensesData.map((expense) => {
      // If expense already has userAmount and friendAmount, return as is
      if (
        expense.userAmount !== undefined &&
        expense.friendAmount !== undefined
      ) {
        return expense;
      }

      // Otherwise, convert from old format
      const totalAmount = expense.amount;

      if (expense.splitMethod === "custom") {
        return {
          ...expense,
          userAmount:
            expense.userPaid || totalAmount - (expense.friendPaid || 0),
          friendAmount:
            expense.friendPaid || totalAmount - (expense.userPaid || 0),
        };
      } else {
        // Equal split
        return {
          ...expense,
          userAmount: totalAmount / 2,
          friendAmount: totalAmount / 2,
        };
      }
    });

    console.log(`Loaded ${normalizedExpenses.length} expenses from file`);

    // Extract unique friends from expenses
    const friendsMap = new Map();

    for (const expense of normalizedExpenses) {
      if (!friendsMap.has(expense.friendId)) {
        friendsMap.set(expense.friendId, {
          _id: new ObjectId(expense.friendId),
          name: expense.friendName,
          avatar: `https://i.pravatar.cc/150?u=${expense.friendId.slice(-8)}`,
          balance: 0,
          expenses: [],
        });
      }

      // Add expense to friend's expense list for balance calculation
      friendsMap.get(expense.friendId).expenses.push(expense);
    }

    // Calculate balances for each friend
    for (const [friendId, friend] of friendsMap) {
      friend.balance = calculateBalance(friend.expenses);
      // Remove the temporary expenses array
      delete friend.expenses;
    }

    const friends = Array.from(friendsMap.values());

    // Insert friends into database
    await db.collection("friends").insertMany(friends);
    console.log(`Inserted ${friends.length} friends`);

    // Insert expenses into database
    await db.collection("expenses").insertMany(normalizedExpenses);
    console.log(`Inserted ${normalizedExpenses.length} expenses`);

    // Create indexes
    await db
      .collection("friends")
      .createIndex({ name: 1 }, { collation: { locale: "en" } });
    await db.collection("friends").createIndex({ balance: 1 });
    await db.collection("expenses").createIndex({ friendId: 1 });
    await db.collection("expenses").createIndex({ date: -1 });
    await db.collection("expenses").createIndex({ settled: 1 });

    console.log("Created indexes");

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

/**
 * Generate sample expense data
 * @param {number} count Number of expenses to generate
 * @returns {Array} Array of expense objects
 */
function generateSampleData(count = 1000) {
  // Create some sample friends
  const friends = [
    { id: new ObjectId(), name: "Alex" },
    { id: new ObjectId(), name: "Jamie" },
    { id: new ObjectId(), name: "Taylor" },
    { id: new ObjectId(), name: "Morgan" },
    { id: new ObjectId(), name: "Jordan" },
  ];

  // Expense descriptions
  const descriptions = [
    "Dinner",
    "Coffee",
    "Movie tickets",
    "Groceries",
    "Uber",
    "Concert tickets",
    "Lunch",
    "Gas",
    "Hotel stay",
    "Internet bill",
    "Gift",
    "Drinks",
    "Taxi",
    "Pizza",
    "Shopping",
  ];

  const expenses = [];

  // Generate random dates in the last year
  const getRandomDate = () => {
    const now = new Date();
    const pastYear = new Date();
    pastYear.setFullYear(now.getFullYear() - 1);

    return new Date(
      pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime())
    );
  };

  for (let i = 0; i < count; i++) {
    // Get random friend
    const friend = friends[Math.floor(Math.random() * friends.length)];

    // Generate random expense
    const amount = Math.round(Math.random() * 200 * 100) / 100; // Random amount up to $200
    const date = getRandomDate();
    const isSettled = Math.random() < 0.3; // 30% chance of being settled
    const splitMethod = Math.random() < 0.8 ? "equally" : "custom"; // 80% equally split
    const paidBy = Math.random() < 0.5 ? "you" : "friend"; // Who physically paid

    let expense;
    if (splitMethod === "equally") {
      // Equal 50/50 split
      const halfAmount = amount / 2;
      expense = {
        description:
          descriptions[Math.floor(Math.random() * descriptions.length)],
        amount: amount,
        date: date,
        friendId: friend.id,
        friendName: friend.name,
        paidBy: paidBy,
        splitMethod: "equally",
        userAmount: halfAmount,
        friendAmount: halfAmount,
        settled: isSettled,
        createdAt: date,
      };
    } else {
      // Custom split - generate random user amount
      const userAmount = Math.round(Math.random() * amount * 100) / 100;
      // Ensure it doesn't exceed the total amount
      const safeUserAmount = Math.min(userAmount, amount);
      const friendAmount = amount - safeUserAmount;

      expense = {
        description:
          descriptions[Math.floor(Math.random() * descriptions.length)],
        amount: amount,
        date: date,
        friendId: friend.id,
        friendName: friend.name,
        paidBy: paidBy,
        splitMethod: "custom",
        userAmount: safeUserAmount,
        friendAmount: friendAmount,
        settled: isSettled,
        createdAt: date,
      };
    }

    if (isSettled) {
      expense.settledAt = new Date(
        date.getTime() + Math.random() * (new Date().getTime() - date.getTime())
      );
    }

    expenses.push(expense);
  }

  return expenses;
}

/**
 * Save generated data to a JSON file that can be used for seeding
 */
async function saveGeneratedData(count = 1000) {
  try {
    const data = generateSampleData(count);
    const filePath = path.join(__dirname, "expense-data.json");
    await writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Generated and saved ${count} expense records to ${filePath}`);
  } catch (error) {
    console.error("Error generating sample data:", error);
  }
}

// Run the seeder if this script is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const command = process.argv[2];

  if (command === "generate") {
    const count = process.argv[3] ? parseInt(process.argv[3]) : 1000;
    saveGeneratedData(count).catch(console.error);
  } else {
    seedDatabase().catch(console.error);
  }
}

export { seedDatabase, generateSampleData };
