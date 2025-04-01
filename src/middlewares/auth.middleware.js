import { ApiError } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError();
    }

    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await userModel
      .findById(decodedData._id)
      .select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid token Access");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user?.isAdmin) {
    throw new ApiError(403, "You are not authorized to access this route");
  }
  next();
});

const isprofessional = asyncHandler(async (req, res, next) => {
  if (!req.user?.isprofessional) {
    throw new ApiError(403, "You are not authorized to access this professional route");
  }
  next();
});

export { verifyJWT, verifyAdmin, isprofessional };
