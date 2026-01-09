import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorise.js';
import { assignProjectManager, createMyProject,deleteProject,updateProject ,getAllProjects,getProject } from '../controllers/project.controller.js';
const router = express.Router();
router.get('/all',auth,authorize('admin'),getProject)
router.get('/get',auth,authorize("admin"),getAllProjects);
router.post('/create',auth ,authorize("admin"),createMyProject);
router.put('/:projectId/assign',auth,authorize("admin"),assignProjectManager);
router.delete('/:projectId/delete',auth,authorize('admin'),deleteProject);
router.put('/:projectId/update',auth,authorize("admin"), updateProject);



export default router;