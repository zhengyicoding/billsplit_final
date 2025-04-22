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

[BillSplit App](https://billsplit-zhengyicoding-zhengyis-projects.vercel.app/)

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

Danger/Delete: #D32F2F

Warning/Settle: #FFC107

Success/Settled: #81C784

<img width="698" alt="image" src="https://github.com/user-attachments/assets/a17a318a-e8bf-41a2-bc77-d1da20b7f729" />
<img width="698" alt="image" src="https://github.com/user-attachments/assets/0e1398f4-ec02-47c8-ab93-6865fef65b97" />

## Font Paring:

Primary Font: Inter. Used for headings, navigation, and buttons.

Secondary Font: Manrope. Used for body text, balances, and descriptive content.

## Usability Study:

[Usability Study Report Link](https://github.com/zhengyicoding/billsplit_final/blob/main/Design_Usability/Usability%20Study%20Report.pdf)

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

<img width="1486" alt="image" src="https://github.com/user-attachments/assets/cde6bc31-c564-4fbd-80d2-a31d2aecfec0" />


### Friends List - View and manage friends

Add friend:

<img width="1478" alt="image" src="https://github.com/user-attachments/assets/1fc12c25-7175-481a-88a6-8677f4d572ef" />


Edit friend:

<img width="1483" alt="image" src="https://github.com/user-attachments/assets/323dd3c8-71f6-49b2-a4b2-be5f5c0ca621" />


Delete friend:

<img width="1491" alt="image" src="https://github.com/user-attachments/assets/a84d8686-3f31-450b-9167-8a7a88c75fc2" />


Settle up with a friend:

<img width="1479" alt="image" src="https://github.com/user-attachments/assets/7158c80f-0f36-4fd0-846d-fcc887f46194" />


### Expense page - view all and filter/sort expense items with pagination

<img width="1486" alt="image" src="https://github.com/user-attachments/assets/7ea3433c-ff57-4c3e-bc05-9ba5dc59e3d9" />


<img width="1489" alt="image" src="https://github.com/user-attachments/assets/f0472d60-4c97-47a2-8ef9-e244f93712c6" />


### Add Expense - Create a new expense and split with friends

<img width="1496" alt="image" src="https://github.com/user-attachments/assets/713375c7-5b7f-4436-bbc9-ad77783d4308" />


### Expense Details - View and manage specific expense

View a specific expense item:

<img width="1485" alt="image" src="https://github.com/user-attachments/assets/fe168267-20f8-4af2-b010-97abf8e2d37a" />


Edit a specific expense item:

<img width="1475" alt="image" src="https://github.com/user-attachments/assets/c65f5742-0c0a-47cb-ad7b-7d4a7afb0dcd" />


Delete a specific expense item:

<img width="1491" alt="image" src="https://github.com/user-attachments/assets/a10630da-8863-4890-9a52-c25d1d9419e9" />


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
