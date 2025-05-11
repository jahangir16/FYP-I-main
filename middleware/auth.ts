import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { updateAccessToken } from "../controllers/user.controller";

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let access_token =
        req.cookies?.access_token || req.headers.authorization?.split(" ")[1];

      if (!access_token) {
        return next(
          new ErrorHandler("Please login to access this resource.", 401)
        );
      }

      // Verify and decode the token
      let decoded: JwtPayload;
      try {
        if (!process.env.JWT_SECRET) {
          return next(new ErrorHandler("JWT secret is not defined.", 500));
        }
        decoded = jwt.verify(
          access_token,
          process.env.JWT_SECRET
        ) as JwtPayload;
      } catch (err) {
        return next(new ErrorHandler("Invalid access token.", 401));
      }

      // Check if the token is expired
      if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        console.log("Token expired. Trying to refresh...");

        try {
          await updateAccessToken(req, res, next);
          return; // Exit middleware after refreshing the token
        } catch (error) {
          console.error("Error refreshing token:", error);
          return next(
            new ErrorHandler("Session expired. Please login again.", 401)
          );
        }
      }

      // Fetch user data from Redis
      const redisUserData = await redis.get(decoded.id);
      if (!redisUserData) {
        return next(
          new ErrorHandler("User session expired. Please login again.", 401)
        );
      }
      // Parse user data and attach it to req.user
      req.user = JSON.parse(redisUserData);

      next(); // Move to the next middleware
    } catch (error) {
      console.error("Authentication error:", error);
      return next(new ErrorHandler("Authentication failed.", 500));
    }
  }
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
