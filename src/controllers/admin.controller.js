import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/jwt.js";


export const createProjectManager = async (req,res)=>{try {
  
    const {userName, email ,password,}= req.body;
    if(!userName ||!email || !password){
      return res.status(400).json({
        success:false,
        message:'all field are required'
      })
     
    }
     const foundUser = await User.findOne({email});
     if(foundUser){
      return res.status(400).json({
        success:false,
        message:"user allready exist"
      })
     }
      const hashedPassword = await bcrypt.hash(password,10);
      const accountType = 'projectManager'
  
      const user = await User.create(
        {
          userName,
          email,
          password:hashedPassword,
          accountType
  
        }
      )
  
      const token = generateToken({
        _id: user._id,
        accountType: user.accountType,
      })
      console.log(token);
      if(!token){
        return res.status(400).json({
          success:false,
          message:'token is missing'
  
        })
      }
          await user.save();
          res.status(200).json({
            success:true,
            message:"user is created successfuly",
            user
          })
} catch (error) {
    console.error(error);
  return res.status(400).json(
    
    {
    success:false,
    message:"error while creating the user",

  }
    
)
  
}

    
    

}
 export const getProjectmanager= async(req,res)=>{
  try {
        const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const total = await User.countDocuments({ accountType: "projectManager" });

    const users = await User.find({accountType:'projectManager'})
       .skip(skip)
      .limit(limit)
      .select("-password");
    console.log(users)
    res.status(200).json({
      success:true,
      message:"projectmanager is fetched successfuly",
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
      message:"error while fetching projectmanager"
    })
    
  }
 }

export const updateProjectManager = async (req,res)=>{
  try {
    const {userName, email,password}= req.body;
    const {projectManagerId}=req.params;
    if(!projectManagerId){
      return res.status(400).json({
        success:false,
        message:"projectmanagerId is missing"
      })
    }
    const user =  await User.findOne({email});
    if(user){
      return res.status(400).json({
        success:false,
        message:"email allready exist"
      })
    }
    const updatedUser=  await User.findByIdAndUpdate(projectManagerId ,req.body,
      
      {
        new: true,               // return updated document
        runValidators: true      // apply schema validation
      })

      if(!updatedUser){
        return res.status(400).json({
          success:false,
          message:'error while updating the user '
        })

      }
      res.status(200).json({
        success:true,
        message:"successfuly updating the user"
      })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:'error while updating the productManager'
    })
    
  }

};
export const deleteProjectManager = async (req,res)=>{
try {
    const {projectManagerId}= req.params ;
    if(!projectManagerId) {
      return res.status(400).json({
        success:false,
        message: "projectmanager id is missing "
      })
    }
   const deleteUser = await User.findByIdAndDelete(projectManagerId) ;
    if(!deleteUser){
      return res.status(400).json({
        success:false,
        message:'error in deleting project manager'
      })
    }
    return res.status(200).json({
      success:true,
      messsage:"project manager deleted successfuly"
    })
} catch (error) {
  console.error(error);
  return res.status(500).json({
    success:false,
    message:"error while delating the projectManager "
  })
  
}
}
export const getProjectmanagerbyId = async (req,res)=>{};



