import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import { calculateProgress } from "../services/auth/calculateProgress.js";
import { generateProjectCode } from "../services/auth/generateProjectcode.js";

export const createMyProject = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, description, startDate,
    endDate,
    visibility,
    priority,
    budget } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });

    }
      const projectCode = await generateProjectCode();
      const progress = calculateProgress(startDate, endDate);


    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      projectCode, startDate,
    endDate,
    visibility,
    priority,
    budget,
    progress,
     status: progress === 100 ? "completed" : "pending",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
export const getProject = async (req,res)=>{
try {
    const projects = await Project.find();
    console.log(projects)
    if(!projects){
      return res.status(400).json({
        success:false,
        message:"project is not found",
        projects

      })
      
}
return res.status(200).json({
     success:true,
     message:"All project is fatched",
     projects
   })} catch (error) {
  console.log(error)
  return res.status(500).json({
    success:false,
    message:"error while finding the project"

  })
}
  }


export const getAllProjects= async(req,res)=>{
  try {
    const page = parseInt(req.query.page) || 1 ;
    const limit = parseInt(req.query.limit) || 2 ;
    const skip =(page-1)*limit;
    const [projects ,total] = await Promise.all(
      [
        Project.find()
        .select('-password')
        .skip(skip)
        .limit(limit),
      Project.countDocuments()

      ]
    );
    res.status(200).json({
      success:true,
      message:"success getting the projects",
       projects,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      }
    })

  } catch (error) {
       console.log(error);
    return res.status(500).json(
   
      {
      success:false,
      message:"error while fetching projects"
    })
    
  }
 }

export const assignProjectManager = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { projectManagerId } = req.body;

    if (!projectManagerId) {
      return res.status(400).json({ message: "Project Manager ID is required" });
    }

    
    const project = await Project.findById(projectId);
    if(project.projectManager){
  return res.status(400).json({
    success :false,
    message:"cannot reassign the same project to the different project manager"
  })
}

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }


    const isCreator =
      project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user?.accountType === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Not allowed to assign project" });
    }

    
    const manager = await User.findById(projectManagerId);
    if (!manager || manager?.accountType !== "projectManager") {
      return res
        .status(400)
        .json({ message: "Invalid project manager" });
    }

    
    project.projectManager = projectManagerId;
    project.status = "assigned";

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project assigned successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteProject = async (req, res)=>{
  try {
      const{projectId} = req.params;
      const deleteProject = await Project.findByIdAndDelete(projectId)
      if(!deleteProject){
          return res.status(400).json({
              success:false,
              message:"project not found"
          })
      }
      return res.status(200).json({
          success:true,
          message:"project delete successfuly"
      })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"error while deleting the project"
    })
  }
    
}
export const  updateProject= async (req,res)=>{
   try {
     const{projectId}=req.params;
     console.log("PARAMS:", req.params);

    
      const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      req.body.data,                
      {
        new: true,             
        runValidators: true      
      }
    );
       if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "project  not found"
      });
    }
    return res.status(200).json({
      success:false,
      message:"project update successfull",
      updateProject
    })

   } catch (error) {
    return res.status(500).json({
        success:false,
        message:"error while updating the projects",
        updateProject,
    })
   }
    
}



export const createTask = async (req, res) => {
  const { projectId } = req.params;
 const { title, description, dueDate,priority,assignedTo } = req.body;

  if (!title || !description || !dueDate) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const task = await Task.create({
    title,
    description,
    dueDate,
    project: projectId,
    createdBy: req.user._id
  });

  // optional: push task into project
  await Project.findByIdAndUpdate(projectId, {
    $push: { tasks: task._id }
  });

  res.status(201).json({
    success: true,
    task
  });
};
export const assignTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { assignedTo } = req.body;

  const task = await Task.findByIdAndUpdate(
    taskId,
    { assignedTo },
    { new: true }
  );

  res.json({ success: true, task });
};

export const getTask = async (req, res) => {
try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    const spentTime = Math.abs(new Date() - new Date(task.createdAt));
   task.spentTime =`${ Math.floor(spentTime / (1000 * 60 * 60 * 24))} days`; // in days
    await task.save();
    res.json({ success: true, task });
} catch (error) {
  console.log(error);
  res.status(500).json({ success: false, message: "Error fetching task" });

  
}
};
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }   
    res.json({ success: true, message: "Task deleted successfully" });
  }
    catch (error) {

    console.log(error);
    res.status(500).json({ success: false, message: "Error deleting task" });
  } 
};
export const getAllTasks = async (req,res)=>{
  try {
    const {projectId} = req.params;
    const tasks = await Task.find({project:projectId});
    if(!tasks){
      return res.status(400).json({
        success:false,
        message:"tasks not found"
      })
    }
    res.status(200).json({
      success:true,
      message:"tasks fetched successfully",
      tasks
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching tasks" });
  }
}
