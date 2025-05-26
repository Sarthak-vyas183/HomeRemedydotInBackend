import { userModel } from "../models/userModel.js";
import { remedyModel } from "../models/remedyModel.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { P_Req_model } from "../models/Become.professional.Model.js"
import { ApiError } from "../utils/Apierror.js";

const get_All_users = asyncHandler(async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password -refreshToken");
        res.status(200).json({ users: users, msg: "all the users fatched successfully", statusCode: 200 });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", statusCode: 500 })
    }
})

const verifyProfessional = asyncHandler(async (req, res) => {
    try {
        const user_id = req.body.userId;
        if (!user_id) {
            return res.status(400).json({ msg: "User ID not provided", statusCode: 400 });
        }

        const user = await userModel.findById(user_id);
        if (!user) {
            return res.status(404).json({ msg: "User not found", statusCode: 404 });
        }

        // Fix: Use the correct field name for professional status
        user.isprofessional = !user.isprofessional;
        await user.save();

        // Remove the professional request if it exists
        const P_Reqs = await P_Req_model.findOne({ userId: user_id });
        if (P_Reqs) {
            await P_Reqs.deleteOne();
        }

        res.status(200).json({ msg: "User's professional status toggled successfully", statusCode: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error", statusCode: 500 });
    }
});

const getAllProfessionalReq = asyncHandler(async (req, res) => {
    try {
        const reqs = await P_Req_model.find(); // Ensure the query is awaited
        if (!reqs || reqs.length === 0) {
            return res.status(404).json({ msg: "No requests found", statusCode: 404 });
        }
        res.status(200).json({ msg: "Requests fetched successfully", data: reqs, statusCode: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error", statusCode: 500 });
    }

});



const getAllRemedies = asyncHandler(async (req, res) => {
    try {
        const AllRemedies = await remedyModel.find();
        if (!AllRemedies || AllRemedies.length == 0) {
            return res.status(404).send("remedies not found");
        }
        res.status(200).json({ msg: "All Remedies Fetched", data: AllRemedies });
    } catch (error) {
        res.status(404).send(`Internal Server error : ${error}`);
    }
})



export { get_All_users, verifyProfessional, getAllProfessionalReq, getAllRemedies }