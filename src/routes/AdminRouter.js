import { Router } from 'express';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import { get_All_users, verifyProfessional, declineProfessional, getAllProfessionalReq, getAllRemedies } from '../controllers/AdminController.js';

const router = Router();

router.use(verifyJWT, verifyAdmin);

router.get("/getusers", get_All_users);
router.post("/getVerify", verifyProfessional);
router.post("/getDecline", declineProfessional);
router.post("/getAllReq", getAllProfessionalReq);
router.post("/getAllRemedies", getAllRemedies);

export default router;
