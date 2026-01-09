import express from "express";
import { signup, login, logout ,getAllUsers,getUserById,updateUser,deleteUser,getAllUserData,blockUser,unblockUser } from "../controllers/auth.controller.js";
import {  createProjectManager,deleteProjectManager,updateProjectManager, getProjectmanagerbyId ,getProjectmanager } from "../controllers/admin.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorise.js";
import User from "../models/user.model.js";
import { sendOTP } from "../utils/sendOtp.js";
import {mailSender} from "../utils/nodeMailer.js"
import { verifyOTP,resendotp } from "../controllers/otp.controller.js";
const router = express.Router();

router.post("/login", login);
router.post("/signup",signup);
router.post("/test",mailSender, sendOTP)
router.post('/logout',logout);
router.post('/resendotp',resendotp)
router.post("/verifyotp", verifyOTP);
router.get("/me", auth, async(req, res) => {
   const user = await User.findById(req.user._id).select("-password");

  res.json({
    success: true,
    user,
  });
});


router.get("/users", auth, authorize("admin"), getAllUsers);
router.get("/userdata", auth, authorize("admin"), getAllUserData);
router.route('/:_id')
.get(auth, authorize( "admin"), getUserById)
.put(auth, authorize( "admin"), updateUser)
.delete(auth, authorize("admin"), deleteUser);

router.get('/admin/projectmanager', auth, authorize("admin"),getProjectmanager);
router.post('/admin/createProjectmanager', auth ,authorize('admin'),createProjectManager)
router.route('/admin/:projectManagerId')
.delete(auth, authorize('admin'),deleteProjectManager)
.put(auth, authorize('admin'),updateProjectManager);
router.put('/blockuser/:id',auth, authorize('admin'), blockUser)
router.put('/unblockuser/:id',auth, authorize('admin'), unblockUser)


export default router;