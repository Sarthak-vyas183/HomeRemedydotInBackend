import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"; 
import { CreateBookMark, BookMarkCheck } from "../controllers/BookMarkController.js";
const router = Router();

router.route("/toggle/p/:productId").post(verifyJWT, CreateBookMark);
router.route("/check/p/:productId").post(verifyJWT, BookMarkCheck);
export default router;