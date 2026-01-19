import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorise.js';
import { assignProjectManager, createMyProject,deleteProject,updateProject ,getAllProjects,getProject,createTask ,assignTaskStatus } from '../controllers/project.controller.js';
const router = express.Router();
router.get('/all',auth,authorize('admin'),getProject)
router.get('/get',auth,authorize("admin"),getAllProjects);
router.post('/create',auth ,authorize("admin"),createMyProject);
router.put('/:projectId/assign',auth,authorize("admin"),assignProjectManager);
router.delete('/:projectId/delete',auth,authorize('admin'),deleteProject);
router.put('/:projectId/update',auth,authorize("admin"), updateProject);

router.post('/createtask/:projectId', auth, authorize('projectManager','admin'), createTask);
router.put('/updatetask/:taskId', auth, authorize('projectManager','admin'), assignTaskStatus);



export default router;