import { Router } from 'express';
import {
    getLikedProduct,
    toggleCommentLike,
    toggleProductLike,
    toggleVideoLike
} from "../controllers/likeController.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/p/:productId").post(toggleProductLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/product").get(getLikedProduct);

export default router