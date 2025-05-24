import { Router } from "express";
import { verifyRemedy, rejectRemedy, getPendingRemedies,  getAllReqs } from "../controllers/ProfessionalController.js";
import { isprofessional, verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.use(verifyJWT);
router.use(isprofessional);

router.post('/verifyRemedy/:id', verifyRemedy);
router.post('/rejectRemedy/:id', rejectRemedy);
router.post('/pendingRemedies', getPendingRemedies);
router.route("/getAllVerificationReq").get(getAllReqs);

export default router;