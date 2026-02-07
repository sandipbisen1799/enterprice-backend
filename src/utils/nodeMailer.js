import nodemailer from "nodemailer";


export const mailSender = async (email, otp) => {
  try {
    console.log(email,otp)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `Sandip <${process.env.MAIL_USER}>`,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for verification is: ${otp}`,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw error;
  }
};

//  const transporter = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//     },
//   });
//    const info = await transporter.sendMail({

//     to: email,
//     subject: 'otp verification',
//     text:`your OTP for verification is : ${otp}`
//   });
