import mongoose, { Schema } from "mongoose";

const VerifyRemedyReqSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    requestingTO : {
      type : String,
    },
    about : {
        type : String,
        require : true
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        default: "pending"
    },
}, {
    timestamps: true // Add timestamps for createdAt and updatedAt
});

export const VerifyRemedyReq = mongoose.model("VerifyRemedyReq", VerifyRemedyReqSchema);
