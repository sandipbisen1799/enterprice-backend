import Project from '../../models/project.model.js';
export const generateProjectCode = async () => {
  const count = await Project.countDocuments();
  return `PMS-${String(count + 1).padStart(3, "0")}`;
};
