import { Redis } from "ioredis";
require("dotenv").config();

var redisInstance: Redis;

const redisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  password: process.env.REDIS_PASSWORD,
};
redisInstance = new Redis(redisOptions);

export const redis = redisInstance;

redis.on("connect", () => {
  console.log("Redis connected");
});

// Handle Redis connection errors
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});
