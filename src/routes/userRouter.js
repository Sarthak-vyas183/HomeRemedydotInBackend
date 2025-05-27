import { Router } from "express";
const router = Router();
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetail,
  updateAvatar,
  coverImageUpdate,
  getWatchHistory,
  SendLoggedUserData,
  becomeProfessional,
  getMyRemedies,
  VerifyRemedyReq,
  getconnect
} from "../controllers/userController.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/changepassword").post(verifyJWT, changeCurrentPassword);
router.route("/getcurrentUser").post(verifyJWT, getCurrentUser);
router.route("/updateAccountDetail").patch(verifyJWT, updateAccountDetail);
router
  .route("/updateAvatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);
router
  .route("/updateCoverImage")
  .patch(verifyJWT, upload.single("coverImage"), coverImageUpdate);
router.route("/getWatchHistory").post(verifyJWT, getWatchHistory);
router.route("/verifyUserToken").post(verifyJWT, SendLoggedUserData);
router.route("/becomeProfessional").post(verifyJWT, upload.single("RMP_Img"), becomeProfessional);
router.route("/getmyremedies").post(verifyJWT, getMyRemedies);
router.route("/VerifyRemedyReq").post(verifyJWT, VerifyRemedyReq);
router.route("/contact").post(getconnect);



export default router;
