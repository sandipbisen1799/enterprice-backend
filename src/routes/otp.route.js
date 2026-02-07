import express from "express";
import { verifyOtp ,resendotp } from "../controllers/otp.controller.js";


const router = express.Router();

router.post("/resend-otp",  resendotp);
router.post("/verify-otp",  verifyOtp);

export default router;
