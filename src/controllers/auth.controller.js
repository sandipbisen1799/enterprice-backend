import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import env from '../config/env.js';
import OTP from "../models/otp.model.js";
import otpGenerator from 'otp-generator'

import { mailSender } from "../utils/nodeMailer.js";

export const signup = async (req, res) => {
  const { userName, email, accountType, password } = req.body;

  try {
    if (!userName || !email || !accountType || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
  
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
      
  const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    
    const otpResult =     await OTP.create({ email, otp });
    if(!otpResult){
      return res.status(400).json({
        success:false,
        message: 'error while creating  otp  in the database'
      })
    }

        // Send OTP via email (replace with your email sending logic)
  const result =  mailSender(email, otp);
  console.log(result);

    const user = await User.create({
      userName,
      email,
      accountType: accountType.trim(),
      password: hashedPassword,
      ipAddress : req.ip
      
    });
      const token = generateToken({
        _id: user._id,
        accountType: user.accountType,
      });
    console.log(token);
    console.log( `the ip address is ${req.ip}`)

    if (!token) {
      return res.status(400).json({
        success: true,
        message: "token is missing while register the user ",
      });
    }
    await user.save();
  

    // Remove password before sending response
    const { password: _, ...userData } = user._doc;

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        user: userData,
        token: token,
        otp
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user credentials",
      });
    }

    if((user.active == 'block')){
      if(!(user.accountType == 'admin')){
      return res.status(400).json({
        success:'false',
        message : 'user is blocked contact to the admin'
      })}
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    console.log(user);
    console.log(req.ip);

    // Remove password before sending response
    const { password: _, ...userData } = user._doc;
    const token = generateToken({
      _id: user._id,
      accountType: user.accountType,
    });
    console.log(token)
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      }).status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout =  async(req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });
  res.status(200).json({
    success: true,
    message: "logout successfuly",
  });
};

export const getAllUser= async(req,res)=>{
 try {
   const users= await User.find();
   console.log(users) ;
   return res.status(200).json({
     success:true,
     message:"All user is fatched",
     users
   })
 } catch (error) {
  return res.status(500).json({
    success:false,
    message:"error while getting all the users"

  })
  
 }
}
 export const getAllUsers= async(req,res)=>{
  try {
        const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const total = await User.countDocuments( );

    const users = await User.find()
       .skip(skip)
      .limit(limit)
      .select("-password");
    console.log(users)
    res.status(200).json({
      success:true,
      message:"users is fetched successfuly",
      users,
        pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"error while fetching users"
    })
    
  }
 }
export const getUserById = async (req, res) => {
    try {
        const { _id } = req.params;
        console.log(_id);
        if(!_id){
          return res.status(400).json({success:false,
            message : "id not found"
          })
        }
        const foundUser = await User.findById(_id);
        if
            (!foundUser) {          
            return res.status(404).json({

            success: false,     
            message: "User not found",
            });
        }
        res.status(200).json({
        success: true,
        user: foundUser,
        });
    }
        catch (error) {
        res.status(500).json({
        success: false,
        message: "Server Error",
        });
    } 
    };

export const updateUser = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const {email,userName,password}=req.body;
    console.log(email,userName,password)
        const updates = {};
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];
      if (value !== "" && value !== null && value !== undefined) {
        updates[key] = value;
      }
    });

    // If nothing to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update"
      });
    }
        const hashedPassword = await bcrypt.hash(updates.password, 10);
        updates.password =hashedPassword;
 const updatedUser = await User.findByIdAndUpdate(
      _id,
      updates,                 // data coming from frontend
      {
        new: true,               // return updated document
        runValidators: true      // apply schema validation
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const deleteUser = async (req, res) => { 
        try {

        const { _id } = req.params;
        console.log(_id)
        const deletedUser = await User.findByIdAndDelete(_id);
        if (!deletedUser) { 
            return res.status(404).json({
            success: false,
            message: "User not found",
        });
        }
        res.status(200).json({
            success: true,  
            message: "User deleted successfully",
        });
    }
        catch (error) {
        res.status(500).json({
        success: false,
            message: "Server Error",
        });
        }
    };
export const addUser = async (req, res) => {
      try {
        const { userName, email, password,PhoneNumber, accountType, } = req.body;

        if (!userName || !email || !password ) {
          return res.status(400).json({
            success: false,
            message: 'All fields are required',
          });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'User already exists',
          });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ userName,email, password: hashedPassword, accountType,PhoneNumber });
        await user.save();
    

    
       res.status(201).json({
          success: true,
          message: 'User added successfully',
          user: {
            id: user._id,
            userName: user.userName,
            PhoneNumber:user.phoneNumber,
            email: user.email,
            accountType: user.accountType,
            token: user.token,
          },
        });
      } catch (error) {
        console.error(' Error while adding the user', error);
        res.status(500).json({
          success: false,
          message: 'Server Error',
          error: error.message,
        });
      }
 };
  export const getAllUserData= async(req,res)=>{
   try {
   
 
     const total = await User.countDocuments({$or:[{ accountType: "projectManager" },{accountType:"teamMember"}]});
 
     const users = await User.find({ $or:[{accountType:'projectManager', active:'unblock'},{accountType:'teamMember',active:'unblock'}] }).select("-password");
     
     console.log(users)
     res.status(200).json({
       success:true,
       message:"users is fetched successfuly",
       users,
      
     })
     
   } catch (error) {
     return res.status(500).json({
       success:false,
       message:"error while fetching users"
     })
     
   }
  }
  export const blockUser = async(req,res)=>{
  try {
      const {id} = req.params ;
      if(!id){
        return res.status(400).json({
          success:false,
          message :'user id not found'
        })
      }
      const users = await User.findById(id);

      if (!users) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = await User.updateMany({ipAddress:users.ipAddress},{$set :{active:'block'}})
      if(!user){
        return res.status(400).json({
          success : false,
          message : ' ALL user is not updated '
        })
      }
      return res.status(200).json({
        success :true,
        message:"all user with this ip is now blocked",
        user
      })
  } catch (error) {
    console.log(error)
    return res.status(500).json(
      { success:false,
        message :'Server Error'
      }


    )

  }


  }
    export const unblockUser = async(req,res)=>{
  try {
      const {id} = req.params ;
      if(!id){
        return res.status(400).json({
          success:false,
          message :'user id not found'
        })
      }
      const user = await User.findByIdAndUpdate(id,{active:'unblock'}, {
        new: true,
        runValidators: true,
      })
      if(!user){
        return res.status(400).json({
          success : false,
          message : 'user is not updated '
        })
      }
      return res.status(200).json({
        success :true,
        message:"user is now unblocked",
        user
      })
  } catch (error) {
    console.log(error)
    return res.status(500).json(
      { success:false,
        message :'error while unblocking the user'
      }
    
      
    )
    
  }


  }
 export const getBlockUser= async(req,res)=>{
 try {
       const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 5;

   const skip = (page - 1) * limit;

   const total = await User.countDocuments({ active: "block" });
   console.log(total ,'sfd');

   const users = await User.find({active:'block'})
      .skip(skip)
     .limit(limit)
     .select("-password");
   console.log(users);
   res.status(200).json({
     success:true,
     message:"Block users fetched successfully",
     users,
       pagination: {
       total,
       page,
       limit,
       totalPages: Math.ceil(total / limit)
     }
   })

 } catch (error) {
   return res.status(500).json({
     success:false,
     message:" Server Error while fetching block users"
   })

 }
}

  export const imageupload = async (req,res)=>{
    try {
      if(!req.file){
        return res.status(400).json({
          success:false,
          message:'there is no file'
        })
      }
      const result = await uploadToCloudinary(
        req.file.buffer,
        'user_profile'
      );
       return res.status(200).json({
        success:false,
        message:'profile uploaded successfuly'
       })

    } catch (error) {
      return res.status(500).json({
        success :false,
        message:'error while uploading the image '
      })
    }
  }


export const uploadImage = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ CORRECT
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadToCloudinary(
      file.buffer,          // ✅ correct
      "user_profile"
    );


    const user = await User.findByIdAndUpdate(
      userId,
      { imageUrl: result.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      url: result.secure_url,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while uploading image",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userName, phoneNumber } = req.body;
    const updates = {};
    if (userName !== undefined) updates.userName = userName;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { priviouspassword
, password } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!priviouspassword
) {
      return res.status(400).json({
        success: false,
        message: "Previous password is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(priviouspassword
, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Previous password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while changing password",
    });
  }
};



