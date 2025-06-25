const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
//user controller
const { register, login, checkUser } = require("../controller/userController");

// register routes
router.post("/register", register);

// login route
router.post("/login", login);

//check user
router.get("/check", authMiddleware, checkUser);

module.exports = router;
