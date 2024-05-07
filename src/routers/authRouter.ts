import { Router } from "express";
import {
  adminLogin,
  adminSignup,
  officerSignin,
  officerSignup,
  userLogin,
  userSignup,
} from "../controllers/authControllers";

const router = Router();

router.post("/signup/user", userSignup);

router.post("/login/user", userLogin);

router.post("/signup/officer", officerSignup);

router.post("/login/officer", officerSignin);

// router.post("/signup/admin", adminSignup);

router.post("/login/admin", adminLogin);

export default router;
