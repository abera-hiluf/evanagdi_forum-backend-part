const express = require("express");
const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
//user controller
const {
  allQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controller/questionController");

// get all questions
router.get("/", allQuestions);
// get question by id
router.get("/:id", getQuestionById);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);
// create a new question
router.post("/", createQuestion);
// router.delete("/:id", authMiddleware, deleteQuestion);

module.exports = router;
