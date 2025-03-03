import express from "express";
const router = express.Router();

const projects = [
  { name: "John", votes: 10 },
  { name: "Jane", votes: 0 },
  { name: "Doe", votes: 0 },
  { name: "Smith", votes: 0 },
  { name: "Alex", votes: 0 },
];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json(projects);
});

export default router;
