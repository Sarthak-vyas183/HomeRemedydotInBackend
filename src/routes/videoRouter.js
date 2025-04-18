import { Router } from "express";
import { publishAVideo , getAllVideos, getVideoById, deleteVideo, updateVideo,   togglePublishStatus, getLikedCountOnVideo, getLikedCountOnComment } from "../controllers/videoController.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"


const router = Router();

//router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
      .route("/")
      .get(getAllVideos)
      .post(verifyJWT, upload.fields([
         {
            name : "videoFile",
            maxCount : 1,
         },
         {
            name : "thumbnail",
            maxCount : 1,
         }
      ]) ,publishAVideo);

router
     .route("/:videoId")
     .get(getVideoById)
     .delete(verifyJWT, deleteVideo)
     .patch(verifyJWT, upload.single("thumbnail"), updateVideo)

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/toggle/publish/:videoId").post(getLikedCountOnVideo);
router.route("/toggle/C/:commentId").post(getLikedCountOnComment);

export default router