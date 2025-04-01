import mongoose, { Schema } from "mongoose";

const becomeProfessionalSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    RMP_NO: {
        type: String,
        required: true
    },
    RMP_Img: {
        type: String,
        required: true  // cloudinary url
    },
    message: {
        type: String,
    },
    // preferenceOfProfessional: {
    //     type: String,
    // },
    status: {
        type: String,
        default: "pending"
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviewedAt: {
        type: Date
    }
}, {
    timestamps: true // Add timestamps for createdAt and updatedAt
});

export const P_Req_model = mongoose.model("P_Req_model", becomeProfessionalSchema);
