const dbCon = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
// Get answer by id
async function getAnswerById(req, res) {
  const questionId = req.params.id;
  console.log("Fetching answers for question ID:", questionId);
  try {
    const [question] = await dbCon.query(
      "SELECT * FROM questionsTable WHERE questionid=?",
      [questionId]
    );

    // if (question.length === 0) {
    //   return res.status(StatusCodes.NOT_FOUND).json({
    //     error: "Not Found",
    //     message: "The requested question could not be found",
    //   });
    // }
    // Get answers with user info
    const [answers] = await dbCon.query(
      `SELECT 
                a.answerid , 
                a.answer , 
                u.username 
              
            FROM answersTable a
            JOIN usersTable u ON a.userid = u.userid
            WHERE a.questionid = ?`,
      [questionId]
    );

    res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}
// post answer page

async function createAnswer(req, res) {
  const {answer} = req.body;
  const question_id = req.params.id; // fix here
  const userid = req.user.userid;

  console.log(userid);

  if (!answer || !question_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide answer" });
  }

  try {
    await dbCon.query(
      "INSERT INTO answersTable (answer, questionid, userid) VALUES (?, ?, ?)",
      [answer, question_id, userid]
    );
    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}
// controllers/answers.js
async function updateAnswers(req, res) {
  const answerId = req.params.id;
  const { answer } = req.body;

  if (!answer || answer.trim() === "") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Answer content is required" });
  }

  try {
    const [result] = await dbCon.query(
      "UPDATE answersTable SET answer = ? WHERE answerid = ?",
      [answer.trim(), answerId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Answer not found or already updated" });
    }

    return res.status(StatusCodes.OK).json({ msg: "Answer updated!" });
  } catch (err) {
    console.error(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to update answer",
    });
  }
}

// delet answer function
async function deleteAnswer(req, res) {
  const { id } = req.params;
  try {
    await dbCon.query("DELETE FROM answersTable WHERE answerid = ?", [id]);
    return res.status(StatusCodes.OK).json({ msg: "Answer deleted!" });
  } catch (err) {
    console.error(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to delete Answer",
    });
  }
}

// Get single answer by answerid
async function getSingleAnswerById(req, res) {
  const answerId = req.params.id;

  try {
    const [rows] = await dbCon.query(
      "SELECT answerid, answer, questionid FROM answersTable WHERE answerid = ?",
      [answerId]
    );

    // if (rows.length === 0) {
    //   return res
    //     .status(StatusCodes.NOT_FOUND)
    //     .json({ msg: "Answer not found" });
    // }

    return res.status(StatusCodes.OK).json(rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch answer",
    });
  }
}

module.exports = {
  getAnswerById,
  createAnswer,
  deleteAnswer,
  updateAnswers,
  getSingleAnswerById, // export the new function
};
