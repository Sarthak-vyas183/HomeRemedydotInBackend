import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Remedy'
    },
    videoId : {
       type : Schema.Types.ObjectId,
       ref : 'Video'
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }, 

    liked : {
        type: Boolean, 
        required: true,
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
}, {timestamps: true})

export const LikeModel = mongoose.model("Like", likeSchema)