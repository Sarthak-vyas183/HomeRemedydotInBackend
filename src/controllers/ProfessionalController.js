import { userModel } from "../models/userModel.js";
import { remedyModel } from "../models/remedyModel.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyRemedy = asyncHandler(async (req, res) => {
    try {
        const remedyId = req.params.id;
        const userId = req.user?._id;
        const reason = req.body.reason;

        const [remedy, user] = await Promise.all([
            remedyModel.findById(remedyId),
            userModel.findById(userId)
        ]);

        if (!remedy) {
            throw new ApiError(404, "Remedy not found");
        }

        if (remedy.isVerified === true || remedy.verifyInfo.status === "rejected" && remedy.approvedBy.toString() != userId.toString()) {
            throw new ApiError(400, "Remedy already verified");
        }

        if (!user) {
            throw new ApiError(404, "User not found");
        }
        if (!user.isprofessional) {
            throw new ApiError(403, "Unauthorized: Only professionals can verify remedies");
        }

        remedy.isVerified = true;
        remedy.approvedBy = userId;
        remedy.verifyInfo.status = "approved";
        remedy.verifyInfo.reason = reason;
        remedy.verifyInfo.date = new Date();
        await remedy.save();

        res.status(200).json(new ApiResponse(200, remedy, "Remedy verified successfully"));
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ msg: error.message, statusCode: error.statusCode });
        } else {
            res.status(500).json({ msg: "Internal server error", statusCode: 500 });
        }
    }
});

const rejectRemedy = asyncHandler(async (req, res) => {
    try {
        const remedyId = req.params.id;
        const { reason } = req.body;
        const userId = req.user?._id;

        const [remedy, user] = await Promise.all([
            remedyModel.findById(remedyId),
            userModel.findById(userId)
        ]);

        if (!remedy) {
            throw new ApiError(404, "Remedy not found");
        }

        if (!user) {
            throw new ApiError(404, "User not found");
        }
        if (!user.isprofessional) {
            throw new ApiError(403, "Unauthorized: Only professionals can reject remedies");
        }

        if (remedy.isVerified === true && remedy.approvedBy.toString() != user._id.toString()) {
            console.log(remedy.approvedBy.toString(), user._id.toString());
            throw new ApiError(400, "you can't reject a approved remedy");
        }

        remedy.isVerified = false;
        remedy.approvedBy = userId;
        remedy.verifyInfo.status = "rejected";
        remedy.verifyInfo.reason = reason;
        remedy.verifyInfo.date = new Date();
        await remedy.save();

        res.status(200).json(new ApiResponse(200, remedy, "Remedy rejected successfully"));
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ msg: error.message, statusCode: error.statusCode });
        } else {
            res.status(500).json({ msg: "Internal server error", statusCode: 500 });
        }
    }
});

const getPendingRemedies = asyncHandler(async (req, res) => {
    try {
        const pendingRemedies = await remedyModel.find({ status: "pending" });
        if (!pendingRemedies || pendingRemedies.length === 0) {
            throw new ApiError(404, "No pending remedies found");
        }
        res.status(200).json(new ApiResponse(200, pendingRemedies, "Pending remedies fetched successfully"));
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ msg: error.message, statusCode: error.statusCode });
        } else {
            res.status(500).json({ msg: "Internal server error", statusCode: 500 });
        }
    }
});

export { verifyRemedy, rejectRemedy, getPendingRemedies };