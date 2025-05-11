import { Response } from "express";
import { redis } from "../utils/redis";
import userModel from "../models/user.model";

// get user by id
export const getUserById = async (id: string) => {
  try {
    const userJson = await redis.get(id);

    if (userJson) {
      const user = JSON.parse(userJson);
      return user;
    }

    // Fetch from MongoDB if not in cache
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Store in Redis for future requests
    await redis.set(id.toString(), JSON.stringify(user), "EX", 3600); // Cache for 1 hour

    return user;
  } catch (error) {
    throw new Error("Internal Server Error");
  }
};

// Get All users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    users,
  });
};

// update user role
export const updateUserRoleService = async (
  res: Response,
  id: string,
  role: string
) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

  res.status(201).json({
    success: true,
    user,
  });
};
