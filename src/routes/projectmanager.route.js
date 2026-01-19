import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorise.js';
import { getMyTeamMembers,getMyAssignedProjects, createTeamMember,updateTeamMember,deleteTeamMember,getTeamMemeberById,assignTeamMemberToProject} from '../controllers/projecManager.controller.js';
const router = express.Router();
router.get('/teamMember',auth ,authorize("projectManager"),getMyTeamMembers);
router.get('/myprojects',auth, authorize('projectManager'),getMyAssignedProjects);
 router.post('/createTeamMember/:projectManagerId',auth,authorize('projectManager'),createTeamMember)
 router.put('/update/:teamMemberId/:projectManagerId',auth,authorize('projectManager'),updateTeamMember)
  router.delete('/delete/:teamMemberId/:projectManagerId',auth,authorize('projectManager'),deleteTeamMember)
router.get('/teammember/:id',auth,authorize('projectManager'),getTeamMemeberById);
router.put('/teamMember/:projectId/assign',auth,authorize("projectManager"),assignTeamMemberToProject);



export default router;