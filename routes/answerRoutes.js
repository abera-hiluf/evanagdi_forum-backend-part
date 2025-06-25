const express = require("express");
const router = express.Router();

const {
  getAnswerById,
  createAnswer,
  deleteAnswer,
  updateAnswers,
  getSingleAnswerById,
} = require("../controller/answersController");

router.get("/:id", getAnswerById);
// Create a new answer
router.post("/:id", createAnswer);
router.delete("/:id", deleteAnswer);
router.put("/:id", updateAnswers);
router.get("/:id", getSingleAnswerById);
module.exports = router;
