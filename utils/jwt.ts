import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import { redis } from "./redis";
import { IUser } from "../models/user.model";

export const accessTokenOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as "none",
  maxAge: 120 * 60 * 1000, // 15 minutes
};

export const refreshTokenOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as "none",
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
};

// Generate Access Token
export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_JWT_EXPIRY || "120m",
  });
};

// Generate Refresh Token
export const generateRefreshToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "15d",
    }
  );
};

// Send Tokens
export const sendToken = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token in Redis
  await redis.set(
    user._id.toString(),
    JSON.stringify(user),
    "EX",
    15 * 24 * 60 * 60
  ); // 15 days

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
