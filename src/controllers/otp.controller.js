import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import otpGenerator from "otp-generator";
import { mailSender } from "../utils/nodeMailer.js"

export const resendotp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
console.log(otp)
     await OTP.create({ email, otp });
    const otpResult = mailSender( email, otp );
    if (!otpResult) {
      return res.status(400).json({
        success: false,
        message: "error while resending the otp",
      });

    }
    return res.status(200).json({
        success:true,
        message:'otp send successfuly ',
        otp
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while sending the otp",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email, otp }).exec();
    console.log(otpRecord);
    if (otpRecord) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({
          success: false,
          message: "user is not found",
        });
      }
      const updateuser = await User.findByIdAndUpdate(
        user._id,
        { isVerified: true },
        {
          new: true,
          runValidators: true,
        },
      );

      return res.status(200).json({
        success: true,
        message: "user is now verified",
        updateuser,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error verifying OTP");
  }
};
