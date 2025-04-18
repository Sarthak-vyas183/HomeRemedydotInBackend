import mongoose, { isValidObjectId } from "mongoose";
import videoModel from "../models/videoModel.js";
import { userModel } from "../models/userModel.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { LikeModel } from "../models/likeModel.js";
import Comment from "../models/commentModel.js";

const getAllVideos = asyncHandler(async (req, res) => {
  try {
    //const Videos = await videoModel.find();
    const Videos = await videoModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetail",
        },
      },
      {
        $unwind: "$ownerDetail",
      },
      {
        $project: {
          "ownerDetail.password": 0, // Exclude password
          "ownerDetail.watchHistory": 0, // Exclude watchHistory
          "ownerDetail.refreshToken": 0, // Exclude refreshToken
        },
      },
    ]);
    if (!Videos || Videos.length === 0) {
      throw new ApiError(404, "Videos Not found");
    }

    res.status(200).json(new ApiResponse(200, Videos, "Videos found"));
  } catch (error) {
    res.send(`Internal server Error : ${error}`);
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    let videoFileLocalPath = req.files?.videoFile[0]?.path;
    let thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!videoFileLocalPath || !thumbnailLocalPath) {
      throw new ApiError(400, "file Localpath is worng");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile || !thumbnail) {
      throw new ApiError(500, "having Truble while uploading files");
    }

    const uploadedVideo = await videoModel.create({
      title,
      description,
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
      duration: videoFile.duration,
      owner: req.user?._id,
    });
    if (!updateVideo) {
      throw new ApiError(500, "Failed to Upload files : Try Again later");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, uploadedVideo, "video Uploaded Successfully"));
  } catch (error) {
    res.send(`internal Server Error : ${error}`);
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    const videoObjectId = new mongoose.Types.ObjectId(videoId);

    const video = await videoModel.aggregate([
      {
        $match: {
          _id: videoObjectId, // Match with ObjectId
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetail",
        },
      },
      {
        $unwind: "$ownerDetail", // Convert ownerDetail from array to object
      },
      {
        $project: {
          "ownerDetail.password": 0, // Exclude sensitive fields
          "ownerDetail.watchHistory": 0,
          "ownerDetail.refreshToken": 0,
        },
      },
    ]);

    if (video.length === 0) {
      throw new ApiError(404, "Video not found"); // Change status code to 404 for "Not Found"
    }

    return res.status(200).json(new ApiResponse(200, video[0], "Video found"));
  } catch (error) {
    res.status(500).send(`Internal server Error: ${error}`);
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;
    console.log(req.file.path);

    if (
      [title, description].some((field) => {
        !field?.trim() === "";
      })
    ) {
      throw new ApiError(404, "All fields are Require");
    }

    let thumbnailLocalPath = req.file.path;

    if (!thumbnailLocalPath) {
      throw new ApiError(404, "Invalid file path");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) throw new ApiError(500, "failed to upload on cludinary");

    const updatedVideo = await videoModel.findByIdAndUpdate(videoId, {
      title,
      description,
      thumbnail: thumbnail.url,
    });
    if (!updatedVideo) {
      throw new ApiError(400, "failed to upload");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "video Updated successfully !"));
  } catch (error) {
    res.send(`Internal server Error : ${error}`);
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await videoModel.findByIdAndDelete(videoId);
    if (!video) {
      throw new ApiError(400, "failed to delete video");
    }
    return res.status(200).json(new ApiResponse(200, {}, "video deleted !"));
  } catch (error) {
    res.send(`Internal server Error : ${error}`);
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await videoModel.findById(videoId);
  if (!video) throw new ApiError(400, "video not found");
  if (!video.isPublished)
    throw new ApiResponse(200, {}, "video is not publish yet");

  return res.status(200).json(new ApiResponse(200, {}, "video is Published"));
});

const getLikedCountOnVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    // Validate videoId
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId");
    }

    // Get the count of likes
    const LikedCount = await LikeModel.find({ video: videoId }).countDocuments();

    // Send the count in JSON format
    res.status(200).json({ count: LikedCount });
  } catch (error) {
    // Handle errors and send response in JSON format
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

const getLikedCountOnComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;

    // Validate commentId
    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid commentId");
    }

    // Fetch the count of likes for the comment
    const count = await LikeModel.find({ comment: commentId }).countDocuments();

    // Return the count with a proper response structure
    res.status(200).json({ success: true, count });
  } catch (error) {
    // Handle errors safely
    const statusCode = error.status || 500; // Default to 500 if status is undefined
    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const comments = await Comment.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(videoId),
        onModel: { $in: ["Video", "Remedy"] },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        content: 1,
        createdAt: 1,
        owner: {
          _id: 1,
          username: 1,
          avatar: 1,
        },
      },
    },
  ]);

  res.status(200).json(comments);
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getLikedCountOnVideo,
  getLikedCountOnComment,
  getVideoComments,
};
