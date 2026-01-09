import express from "express";
import {  verifyOtp,  } from "../controllers/otp.controller.js";
// import rateLimiter from "../middlewares/rateLimiter.js";

const router = express.Router();

// router.post("/send-otp", rateLimiter, sendOtp);

// router.post("/resend-otp", rateLimiter, resendOtp);

export default router;
