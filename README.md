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

[BillSplit App](https://billsplit-git-main-zhengyis-projects.vercel.app)

### Option 2: Run locally

#### Step 1

Git clone this repository to your local repository.

```
git clone git@github.com:zhengyicoding/billsplit.git
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

Return to the root directory and run seeder file to import the 1000 expense sample data items into the data collections:

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

In project folder, run below command to start server:

`npm start`

Open a new terminal to start client:

```
cd front end
npm run dev
```

Production mode:

```
npm run build
npm start
```

The app will be available at `http://localhost:5173/` and the server will run on `http://localhost:3000/`.

## Color Palette

Primary: #4E54C8
Secondary/Edit: #8F94FB
Danger/Delete: #E57373
Success/Settle: #81C784

## Font Paring:

Primary Font: Inter. Used for headings, navigation, and buttons.

Secondary Font: Manrope. Used for body text, balances, and descriptive content.

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
  profilePic: String,
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

### Dashboard - Overview of balances, friends list and recent expenses

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/66dfa82c-f7cc-4f8c-aef9-2196aeac397e" />

### Friends List - View and manage friends

Add friend:

<img width="1511" alt="image" src="https://github.com/user-attachments/assets/7106fc91-6725-4ed4-9918-2cc713df9190" />

Edit friend:

<img width="1508" alt="image" src="https://github.com/user-attachments/assets/b6d46a66-e7ac-4050-82e1-96f2f70d7bfd" />

Delete friend:

<img width="1510" alt="image" src="https://github.com/user-attachments/assets/c2097e71-01db-44ed-b0f7-52fc5f97b5de" />

Settle up with a friend:

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/283b08c8-6ceb-4ac1-9c7c-774d7eeb1efb" />

### Expense page - view all and filter/sort expense items with pagination

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/4737746e-5a59-4369-926d-83afad578aeb" />

<img width="1511" alt="image" src="https://github.com/user-attachments/assets/0dfa1f17-b1fa-492e-a844-3fa0eadcb029" />

### Add Expense - Create a new expense and split with friends

<img width="1511" alt="image" src="https://github.com/user-attachments/assets/9be3042e-7753-47a1-9e41-ebb7150f38b1" />

### Expense Details - View and manage specific expense

View a specific expense item:

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/6120af08-2938-4000-ab3b-dcf04c074ad7" />

Edit a specific expense item:

<img width="1511" alt="image" src="https://github.com/user-attachments/assets/1ba44f5a-0e6e-4ecd-8a15-4b721ef73c20" />

Delete a specific expense item:

<img width="1511" alt="image" src="https://github.com/user-attachments/assets/e0a270de-73f4-4ca6-a156-8148a9024883" />

## Technology Stack:

- **Frontend**: React.js, CSS Modules
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Vercel (frontend), Vercel Serverless Functions (backend)

## Links:

[Design Document](https://github.com/zhengyicoding/billsplit/blob/main/designDoc/BillSplit%20App%20Design%20Document.pdf)

[Slides](https://docs.google.com/presentation/d/1dzMs63gO8veD8iX67uC0WgvGpZF5QL06qQMJLcL_82M/edit?usp=sharing)

[Video Demo](https://youtu.be/aM9q7ZpVgPE)

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

### Use case: Bug in filter function for expenses items

Prompt: Whenever I input in search box and backspace, the search function stops working and trap in loading status. What are potential reasons and how to fix it?

## Refactor React components

Prompt: Please help me to split and refactor React components to make the code more maintainable

## License

This project is licensed under the MIT License - see the LICENSE file for details.
