
import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";

import otpGenerator from 'otp-generator'
import nodemailer from 'nodemailer'
export const resendotp = async (req,res)=>{
    try {
        const {email}= req.body; 
         const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
        
            
                await OTP.create({ email, otp });
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'sandipbisen1799@gmail.com',
                        pass: 'cqyictnbcivtfsvk'
                    }
                });
        
        
                await transporter.sendMail({
                    from: 'your-mail@gmail.com',
                    to: email,
                    subject: 'OTP Verification',
                    text: `Your OTP for verification is: ${otp}`
                });
                return res.status(200).json({
                    success :true,
                    message :'otp resend successfully',
                    otp,
                })
        
    } catch (error) {
      console.log(error)  
      return res.status(400).json({
        success:false,
        message:"error while sending the otp"
      })
    }
}

export const verifyOTP = async (req, res) => {
  try {
   const { email, otp } = req.body;

    
        const otpRecord = await OTP.findOne({ email, otp }).exec();
  console.log(otpRecord);
        if (otpRecord) {
            const user =  await User.findOne({email});
            if(!user){
                return res.json({
                    success :false,
                    message:'user is not found'

                })
            }
            const updateuser = await User.findByIdAndUpdate(user._id,{isVerified:true},{
             new:true,
                runValidators:true
             })


        return res.status(200).json({
                success:true,
                message:'user is now verified',
                updateuser
            })
        } else {
          return   res.status(400).json({
            success:false,
            message:'Invalid OTP'});
        }
        
    } catch (error) {
        console.error(error);
      return  res.status(500).send('Error verifying OTP');
    }
  
};

