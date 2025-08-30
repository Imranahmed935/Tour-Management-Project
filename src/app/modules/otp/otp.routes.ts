import express from "express"
import { OTPController } from "./otp.controller";
const router = express.Router();

router.post("/send-Otp", OTPController.sendOTP)
router.post("/verify-Otp", OTPController.verifyOTP)

export const otpRouter =  router;