import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Remedy"
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

commentSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model("comments", commentSchema);