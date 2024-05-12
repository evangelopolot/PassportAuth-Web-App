import { Router } from "express";
import * as viewController from "../controllers/viewController.mjs";

const router = Router();

router.get("/", viewController.getAuthPage);
router.get("/user-homepage", viewController.getUserDashboard);
router.get("/login", (req, res) => {
  res.render("oauth-page", { message: req.flash("error") });
});

export default router;
