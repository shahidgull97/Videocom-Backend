import express from "express";
import { SignUp } from "./user.controllser.js";
import { Login } from "./user.controllser.js";
const router = express.Router();

router.route("/signup").post(SignUp);
router.route("/login").post(Login);

export default router;
