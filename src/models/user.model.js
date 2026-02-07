import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      unique: true,
      type: String,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["admin", "projectManager", "teamMember"],
      required: true,
    },
     active:{
      type:String,
      enum :["block","unblock"],
      default : "unblock"
    },
    ipAddress :{
     type : String,
     
    },
    phoneNumber :{
      type : Number
    },
      projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
    isVerified: {
    type: Boolean,
    default: false,
  },

  otp: String,
  otpExpiry: Date,
  imageUrl: {
    type: String,
  },
}

  ,
  { timestamps: false }
);
const User = mongoose.model("User", userSchema);
export default User;
