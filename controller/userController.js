const express = require("express");
const dbCon = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "All fields are required" });
  }
  try {
    const [user] = await dbCon.query(
      "SELECT username, userid FROM usersTable WHERE username=? OR email=?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "username or email already exists" });
    }

    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least 8 characters long" });
    }
    // password hashing

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbCon.query(
      "INSERT INTO usersTable (username, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "user registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, please try again later!" });
  }
}

//login

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please enter all required fields", error: "bad request" });
  }

  //this is on database
  try {
    //the response is in the form of array
   const [user] = await dbCon.query(
  "SELECT username, userid, password FROM usersTable WHERE email=?",
  [email]
);

    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential" });
    }

    // compare password from front end   and password saved on database
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential" });
    }

    //token part
    //destructure user
    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, "secret", {
      expiresIn: "30d",
    });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "user login successful", token });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "something went wrong ,try again later",
      error: error.message,
    });
  }
}

async function checkUser(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  return res.status(200).json({ user });
}

module.exports = {
  register,
  login,
  checkUser,
};
