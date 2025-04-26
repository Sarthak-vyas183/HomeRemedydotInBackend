import mongoose, {Schema} from "mongoose";

const BookMarkSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Remedy'
    }, 

    MarkedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
}, {timestamps: true})

export const BookmarkModel = mongoose.model("Bookmark", BookMarkSchema)