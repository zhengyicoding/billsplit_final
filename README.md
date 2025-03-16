# BillSplit: Expense Tracking & Splitting Application

A full-stack web application to track expenses, split bills with friends, and manage shared expenses effortlessly.

## Author

Zhengyi Xu
[Github](https://github.com/zhengyicoding)

## Class Link

CS5610 Web Development [Course Page](https://johnguerra.co/classes/webDevelopment_spring_2025/)

Instructor: John Alexis Guerra Gómez [Profile](https://johnguerra.co/)

## Instruction to build

### Option 1: Live Demo

[BillSplit App](https://billsplit-app.vercel.app/)

### Option 2: Run locally

#### Step 1

Git clone this repository to your local repository.

```
git clone https://github.com/zhengyicoding/billsplit.git
```

#### Step 2

`cd` into this repository and install dependencies for both server and client.

```
cd billsplit
npm install
cd frontend
npm install
```

#### Step 3

Create a `.env` file in the root directory with your MongoDB Atlas credentials.

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
DB_NAME=billsplitdb
```

If using MongoDB locally instead of MongoDB Atlas, use `mongodb://localhost:27017/billsplit` as MONGODB_URI.

#### Step 4

Return to the root directory and run seeder file to import the 1000 sample data items into the data collections:

```
node ./db/seeder.js
```

The following message should be shown in the terminal:

```
Connected to MongoDB
Existing collections cleared
Loaded 1000 expenses from file
Inserted 5 friends
Inserted 1000 expenses
Created indexes
Database seeded successfully
```

#### Step 5

Return to the root directory and start both server and client:

Development mode:

```
npm run dev
```

Production mode:

```
npm run build
npm start
```

The app will be available at `http://localhost:5173/` and the server will run on `http://localhost:3000/`.

## Features

- **Friend Management**: Add, edit, and delete friends
- **Expense Tracking**: Record expenses with detailed information
- **Split Options**: Multiple ways to split expenses (equally, custom amounts)
- **Balance Calculation**: Track who owes whom with automatic balance updates
- **Settlement**: Settle up with friends and clear balances
- **Filtering**: Search for specific expenses or filter by friend

## Database:

The application uses MongoDB with two main collections:

Collection 1: **friends** - Stores friend information and current balances

```
{
  _id: ObjectId,
  name: String,
  profilePicUrl: String,
  balance: Number,
  createdAt: Date
}
```

Collection 2: **expenses** - Records expense details and split information

```
{
  _id: ObjectId,
  description: String,
  amount: Number,
  date: Date,
  friendId: ObjectId,
  splitMethod: String,
  paidBy: String,
  userAmount: Number,
  friendAmount: Number,
  settled: Boolean,
  createdAt: Date
}
```

## Screenshots:

### Dashboard - Overview of balances and recent expenses

![Dashboard](https://github.com/zhengyicoding/billsplit/raw/main/screenshots/dashboard.png)

### Friends List - View and manage friends

![Friends List](https://github.com/zhengyicoding/billsplit/raw/main/screenshots/friends-list.png)

### Add Expense - Create a new expense and split with friends

![Add Expense](https://github.com/zhengyicoding/billsplit/raw/main/screenshots/add-expense.png)

### Expense Details - View and manage specific expense

![Expense Details](https://github.com/zhengyicoding/billsplit/raw/main/screenshots/expense-details.png)

## Technology Stack:

- **Frontend**: React.js, CSS Modules
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Vercel (frontend), Vercel Serverless Functions (backend)

## Links:

[Design Document](https://github.com/zhengyicoding/billsplit/blob/main/design_doc.pdf)

[Slides](https://docs.google.com/presentation/d/1aBC123DefGHIjkLMNOpqRStuVWXyz/edit?usp=sharing)

[Video Demo](https://youtu.be/example)

## Future Improvements

- User authentication and authorization
- Group expenses (more than two people)

## LLM Usage

Used Claude 3.7 Sonnet for the following use cases and prompts:

### Use case: Setting up PropTypes

Prompt: How to define React PropTypes for my components?

### Use case: MongoDB connection issues

Prompt: Debugging MongoDB Atlas connection errors

### Use case: Profile picture implementation

Prompt: Add input area to put in friend profile pic, if no profile pic, database will generate one automatically

## License

This project is licensed under the MIT License - see the LICENSE file for details.
