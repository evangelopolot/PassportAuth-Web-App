import express from "express";
import passport from "passport";
import * as authController from "../controllers/authController.mjs";

const router = express.Router();

router.post("/signUp", authController.signUp);
router.post("/login", passport.authenticate("local"), authController.login);
router.get("/logout", authController.logout);

export default router;
