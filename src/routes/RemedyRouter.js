import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Corrected path

const router = Router();

import {
    get_Vr_Remedies,
    createRemedy,
    updateRemedy,
    deleteRemedy,
    get_Vr_RemedyById
} from "../controllers/RemedyController.js";

router.route("/").get(get_Vr_Remedies).post(verifyJWT, createRemedy);
router.route("/:id").patch(verifyJWT, updateRemedy).delete(verifyJWT, deleteRemedy)
                    .post(get_Vr_RemedyById);      

export default router;