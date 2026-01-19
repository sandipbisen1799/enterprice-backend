import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
export const getTeamMemeberById =async (req,res)=>{
  try {
    const {id}= req.params ;
    console.log(id);
    if(!id){
      return res.status(500).json({
        success:'false',
        message:"id not found"
      })
    }
    const user = await User.findById(id);
    if(!user){
      return res.status(400).json({
        success:false,
        message:"user is not found"
      })
    }
    return res.status(200).json({
      success:true,
      message:'user is fetched',
      user
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:'error while getting teammemeber'
    })
  }
}
export const getMyTeamMembers = async (req, res) => {
  try {
    const projectManagerId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({
        accountType: "teamMember",
        projectManager: projectManagerId,
      })
        .select("-password")
        .skip(skip)
        .limit(limit),

      User.countDocuments({
        accountType: "teamMember",
        projectManager: projectManagerId,
      }),
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getMyAssignedProjects = async (req, res) => {
  try {
    if (req.user.accountType !== "projectManager") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
 console.log('dfbvsssssss',req.user._id)
    const projects = await Project.find({
      projectManager: req.user._id,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const createTeamMember = async (req, res) => {
  try {
    const { projectManagerId } = req.params;
    if (!projectManagerId) {
      return res.status(400).json({
        success: false,
        message: "project Manager is missing",
      });
    }
    const { email, userName, password } = req.body;
    if (!email || !userName || !password) {
      return res.status(400).json({
        success: false,
        message: "all field are required",
      });
    }
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({
        success: false,
        message: "user allready exist",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(projectManagerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project manager ID",
      });
    }

    const accountType = "teamMember";
    const user = await User.create({
      email,
      userName,
      password,
      accountType,
      projectManager: projectManagerId,
    });

    await user.save();
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user is missing",
      });
    }

    res.status(200).json({
      success: true,
      message: "teamMember created successfuly",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};
export const updateTeamMember = async (req, res) => {
  try {
    const { teamMemberId, projectManagerId } = req.params;
    const { userName, email, password } = req.body;
    if (!teamMemberId || !projectManagerId) {
      return res.status(400).json({
        success: false,
        message: "id is missing",
      });
    }
    const user = await User.findById(teamMemberId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    const projectManager = user.projectManager.toString();
    const compare = projectManager === projectManagerId;
    if (!compare) {
      return res.status(400).json({
        success: false,
        message: "wrong projectManager ",
      });
    }
    console.log("vfddfdd", teamMemberId);
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
        if(updates.password){
            const hashedPassword = await bcrypt.hash(updates.password, 10);
            updates.password =hashedPassword;
        }
            
    const updateduser = await User.findByIdAndUpdate(
      teamMemberId,updates,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateduser) {
      return res.status(400).json({
        success: false,
        message: "error in updating the user ",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user updating successfull ",
      updateduser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while updating the team member",
    });
  }
};
 export const deleteTeamMember =async(req,res)=>{
  try {

      const { teamMemberId, projectManagerId } = req.params;
   
    if (!teamMemberId || !projectManagerId) {
      return res.status(400).json({
        success: false,
        message: "id is missing",
      });
    }
    const user = await User.findById(teamMemberId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    const projectManager = user.projectManager.toString();
    const compare = projectManager === projectManagerId;
    if (!compare) {
      return res.status(400).json({
        success: false,
        message: "wrong projectManager ",
      });
    }
    const deletedUser = await User.findByIdAndDelete(teamMemberId, {
        new: true,
        runValidators: true,
      });
    if(!deletedUser){
      return res.status(400).json({
        success:false,
        message:"user is not deleted"
      })
    }
    return res.status(200).json({
      success:true,
      message:'user is deleted successfully'
    })

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success:false,
      message:"somrthing went wrong while deleting the user"
    })
  }
}
export const assignTeamMemberToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { teamMemberId } = req.body;
    if (!projectId || !teamMemberId) {
      return res.status(400).json({ message: "Project ID and Team Member ID are required" });
    }   
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }

    if (project.projectManager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to assign team members to this project" });
    } 
    const teamMember = await User.find
      .findById(teamMemberId);
    if (!teamMember || teamMember.accountType !== "teamMember") {
      return res.status(400).json({ message: "Invalid team member" });
    } 
    if (teamMember.projectManager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "This team member is not under your management" });
    } 
    if (!project.teamMember) {
      project.teamMember = [];
    }
    if (project.teamMember.includes(teamMemberId)) {
      return res.status(400).json({ message: "Team member already assigned to this project" });
    }
    project.teamMember.push(teamMemberId);
    await project.save();
    res.status(200).json({
      success: true,
      message: "Team member assigned to project successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
