import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { userModel } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { remedyModel } from "../models/remedyModel.js";

const get_Vr_Remedies = asyncHandler(async (req, res) => {
    try {
        const remedies = await remedyModel.find({
            isVerified: true
        });
        if (!remedies || remedies.length === 0) {
            res.status(405).json(new ApiResponse(405, remedies, "No remedies found"));
        }
        res.status(200).json(new ApiResponse(200, remedies, "Remedies fetched successfully"));
    } catch (error) {
        res.status(500).send(`Internal Server Error : ${error}`);
    }
});

const createRemedy = asyncHandler(async (req, res) => {
    try {
        const { title, description, ingredients, steps, ailments, effectiveness, EcommerceUrl } = req.body;
        const userId = req.user?._id;
        if ([title, description].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isVerified = user.isprofessional ? true : false;

        const remedy = await remedyModel.create({
            userId,
            title,
            description,
            ingredients,
            steps,
            ailments,
            effectiveness,
            EcommerceUrl,
            isVerified
        });
        if (!remedy) {
            throw new ApiError(400, "Failed to create remedy");
        }
        res.status(201).json(new ApiResponse(201, remedy, "Remedy created successfully"));
    } catch (error) {
        res.status(500).send(`Internal Server Error : ${error}`);
    }
});

const updateRemedy = asyncHandler(async (req, res) => {
    try {
        const { title, description, ingredients, steps, ailments, effectiveness, EcommerceUrl } = req.body;
        const userId = req.user?._id;
        const remedyId = req.params.id;

        if ([title, description].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const [user, remedy] = await Promise.all([
            userModel.findById(userId),
            remedyModel.findById(remedyId)
        ]);

        if (!user) {
            throw new ApiError(404, "User not found");
        }
        if (!remedy) {
            throw new ApiError(404, "Remedy not found");
        }
        if (remedy.userId.toString() !== userId.toString()) {
            throw new ApiError(403, "You are not authorized to update this remedy");
        }

        const updatedRemedy = await remedyModel.findByIdAndUpdate(
            remedyId,
            { title, description, ingredients, steps, ailments, effectiveness, EcommerceUrl },
            { new: true }
        );

        res.status(200).json(new ApiResponse(200, updatedRemedy, "Remedy updated successfully"));
    } catch (error) {
        res.status(500).send(`Internal Server Error : ${error}`);
    }
});

const deleteRemedy = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        const remedyId = req.params.id;

        const [user, remedy] = await Promise.all([
            userModel.findById(userId),
            remedyModel.findById(remedyId)
        ]);

        if (!user) {
            throw new ApiError(404, "User not found");
        }
        if (!remedy) {
            throw new ApiError(404, "Remedy not found");
        }
        if (remedy.userId.toString() !== userId.toString()) {
            throw new ApiError(403, "You are not authorized to delete this remedy");
        }

        await remedyModel.findByIdAndDelete(remedyId);
        res.status(200).json(new ApiResponse(200, null, "Remedy deleted successfully"));
    } catch (error) {
        res.status(500).send(`Internal Server Error : ${error}`);
    }
})

const get_Vr_RemedyById = asyncHandler(async (req, res) => {
    try {
        const remedy = await remedyModel.findById(req.params.id).populate('userId', '-password -refreshToken -watchHistory -createdAt -updatedAt');
        if (!remedy) {
            res.status(405).json(new ApiResponse(405, remedy, "No remedy found"));
        }
        if (remedy.isVerified === false) {
            res.status(405).json({ msg: "Remedy is not verified yet" });
        }
        res.status(200).json(new ApiResponse(200, remedy, "Remedy fetched successfully"));
    } catch (error) {
        res.status(500).send(`Internal Server Error : ${error}`);
    }
});

export { get_Vr_Remedies, createRemedy, updateRemedy, deleteRemedy, get_Vr_RemedyById };
