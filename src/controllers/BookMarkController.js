import mongoose, { isValidObjectId } from "mongoose";
import { BookmarkModel } from "../models/Bookmark.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";

const CreateBookMark = asyncHandler(async (req, res) => {
    try {
       const { productId } = req.params;
       const userId = req.user?._id;
       if (!productId || !userId) {
         throw new ApiError(400, "Invalid Ids");
       }
       // Check if bookmark already exists
       const existingBookmark = await BookmarkModel.findOne({
            productId: productId,
            MarkedBy: userId
       });

       if (existingBookmark) {
           await existingBookmark.deleteOne();
           return res.status(200).json({ success: true, message: "Bookmark removed (unbookmarked)" });
       }
       const createdBookMark = await BookmarkModel.create({
            productId: productId,
            MarkedBy : userId
       }); 
       res.status(201).json({ success: true, data: createdBookMark, message: "Bookmark created successfully" });
    } catch (error) {
        res.status(501).json({ msg: "internal server error", err: error });
    }
}) 

const BookMarkCheck = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user?._id;
        if (!productId || !userId) {
            throw new ApiError(400, "Invalid Ids");
        }
        const bookmark = await BookmarkModel.findOne({
            productId: productId,
            MarkedBy: userId
        });

        res.status(200).json({
            bookmarked: !!bookmark,
            data: bookmark || null
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", err: error });
    }
});

export { CreateBookMark, BookMarkCheck }