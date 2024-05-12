import User from "../../models/userModel.mjs";
import AppError from "../utils/appError.mjs";
import catchAsyncError from "../utils/catchAsync.mjs";
import logger from "../utils/logger.mjs";

export async function signUp(req, res) {
  try {
    const newUser = await User.create({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export function logout(req, res) {
  // Checks if user is authenticated
  if (!req.user) return res.sendStatus(401);

  // Clear the session cookie
  res.clearCookie("connect.sid");

  req.logout(function (err) {
    if (err) return res.sendStatus(401);
    req.session.destroy(function (err) {
      if (err) return res.sendStatus(401);
      logger.info("User logged out successfully");
      return res.status(200).json({ status: "success" });
    });
  });
}

export function login(req, res) {
  // Logging a message with additional metadata
  logger.info("User authenticated successfully", {
    userId: req.user._id,
    username: req.user.username,
  });
  // res.redirect("/user-homepage");
  res.status(200).json({ status: "success" });
}
