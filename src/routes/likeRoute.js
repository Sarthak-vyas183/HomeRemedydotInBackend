import { Router } from 'express';
import {
    getLikedProduct,
    toggleCommentLike,
    toggleProductLike,
    toggleVideoLike,
    likedByUserOrNot,
    getLikeCount
} from "../controllers/likeController.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();


router.route("/toggle/p/:productId").post(verifyJWT, toggleProductLike);
router.route("/toggle/c/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/toggle/v/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/product").get(getLikedProduct);
router.route("/byUser/:remedyId").post(verifyJWT, likedByUserOrNot);
router.route("/likeCount/:productId").post(getLikeCount);
export default router