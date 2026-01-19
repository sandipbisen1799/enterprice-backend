import Project from "../../models/Project.js";
import Task from "../../models/Task.js";
export const updateProjectProgress = async (projectId) => {
  const tasks = await Task.find({ project: projectId });

  if (!tasks.length) return 0;

  const completed = tasks.filter(t => t.status === "completed").length;

  const progress = Math.round((completed / tasks.length) * 100);

  await Project.findByIdAndUpdate(projectId, { progress });
};
