import { Router } from 'express';
import {
    addCommentonVideo,
    addCommentonProduct,
    deleteComment,
    getproductComments,
    updateComment,
    getvideoComments,
} from "../controllers/CommentController.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

//router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/p/:productId").get(getproductComments).post(verifyJWT, addCommentonProduct);
router.route("/v/:videoId").get(getvideoComments).post(verifyJWT, addCommentonVideo);
router.route("/:commentId").delete(verifyJWT, deleteComment).patch(verifyJWT, updateComment);

export default router