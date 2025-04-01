import mongoose, { isValidObjectId } from "mongoose";
import { LikeModel } from "../models/likeModel.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import videoModel from "../models/videoModel.js";
import { remedyModel } from "../models/remedyModel.js";
import commentModel from "../models/commentModel.js";

const toggleProductLike = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    if (!isValidObjectId(productId)) throw new ApiError(400, "Invalid productId");

    // Search for the product in both videoModel and remedyModel
    let LikedProduct = await remedyModel.findById(productId);

    if (!LikedProduct) {
        throw new ApiError(404, "Product not found in both models");
    }

    const Alreadyliked = await LikeModel.findOne({
      productId: LikedProduct?._id,
      likedBy: req.user?._id,
    });

    if (Alreadyliked) {
      await Alreadyliked.deleteOne();
      return res.status(200).json(new ApiResponse(200, Alreadyliked, "Unlike successfully"));
    }

    const likeDocument = await LikeModel.create({
      productId: LikedProduct?._id,
      likedBy: req.user?._id,
      liked: true // Ensure the liked field is set to true
    });

    if (!likeDocument) throw new ApiError(400, "Failed to like the product");
    return res
      .status(200)
      .json(new ApiResponse(200, likeDocument, "Product Liked Successfully"));
  } catch (error) {
    res.status(500).send(`Internal Server Error : ${error}`);
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid commentId");
    const LikedComment = await commentModel.findById(commentId);
    if (!LikedComment)
      throw new ApiError(404, "Comment not found : comment source not found");

    const Alreadyliked = await LikeModel.findOne({
      comment: LikedComment?._id,
      likedBy: req.user?._id,
    });

    if (Alreadyliked) {
      await Alreadyliked.deleteOne();
      return res.status(200).json(new ApiResponse(200, Alreadyliked, "Unlike successfully"))
    }

    const likeDocument = await LikeModel.create({
      comment: LikedComment?._id,
      likedBy: req.user?._id,
      liked: true, // Ensure the liked field is set to true
    });
    if (!likeDocument) throw new ApiError(400, "Failed to like the comment");
    return res
      .status(200)
      .json(new ApiResponse(200, likeDocument, "comment Liked Successfully"));
  } catch (error) {
    res.status(500).send(`Internal Server Error : ${error}`);
  }
});

const toggleVideoLike = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid productId");

    // Search for the product in both videoModel and remedyModel
    let LikedVideo = await remedyModel.findById(videoId);

    if (!LikedVideo) {
        throw new ApiError(404, "Product not found in videoModel");
    }

    const Alreadyliked = await LikeModel.findOne({
      videoId: LikedVideo?._id,
      likedBy: req.user?._id,
    });

    if (Alreadyliked) {
      await Alreadyliked.deleteOne();
      return res.status(200).json(new ApiResponse(200, Alreadyliked, "Unlike successfully"));
    }

    const likeDocument = await LikeModel.create({
      videoId: LikedVideo?._id,
      likedBy: req.user?._id,
      liked: true
    });

    if (!likeDocument) throw new ApiError(400, "Failed to like the product");
    return res
      .status(200)
      .json(new ApiResponse(200, likeDocument, "Product Liked Successfully"));
  } catch (error) {
    res.status(500).send(`Internal Server Error : ${error}`);
  }
});

const getLikedProduct = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) throw new ApiError(400, "unauthorized user");
    const LikedVideos = await LikeModel.find({
      $and: [{ likedBy: userId }, { video: { $exists: true } }]
    });
    if (!LikedVideos) {
      throw new ApiError(404, "No liked video found");
    }
    return res.status(200).json(new ApiResponse(200,))
  } catch (error) {
    res.status(500).send(`Internal server Error : ${error}`)
  }
});

export { toggleCommentLike, toggleProductLike, getLikedProduct, toggleVideoLike };
